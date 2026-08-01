const {
  Op,
} = require("sequelize");

const Client = require(
  "../models/Client"
);

const Device = require(
  "../models/Device"
);

const Order = require(
  "../models/Order"
);

const normalizeDeviceIdentifier =
  require(
    "../utils/normalizeDeviceIdentifier"
  );

const {
  ORDER_STATUSES,
} = require(
  "../validators/orderValidator"
);

const OrderWithAccessCode =
  Order.scope("withAccessCode");

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 100;

const DELIVERY_FILTERS =
  new Set([
    "all",
    "delivered",
    "not_delivered",
    "ready",
  ]);

const SORT_FIELDS = {
  id: "id",
  receivedAt: "receivedAt",
  dueAt: "dueAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  status: "status",
  estimatedPrice:
    "estimatedPrice",
  finalPrice: "finalPrice",
};

const orderIncludes = [
  {
    model: Client,
    as: "client",
    required: true,
  },
  {
    model: Device,
    as: "device",
    required: true,
  },
];

const toNumberOrNull = (
  value
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : null;
};

const serializeOrder = (
  order
) => {
  const plain =
    order.get({
      plain: true,
    });

  const hasAccessCode =
    Boolean(
      plain.accessCodeEncrypted
    );

  delete plain.accessCodeEncrypted;

  plain.price =
    toNumberOrNull(
      plain.price
    );

  plain.estimatedPrice =
    toNumberOrNull(
      plain.estimatedPrice
    );

  plain.finalPrice =
    toNumberOrNull(
      plain.finalPrice
    );

  plain.hasAccessCode =
    hasAccessCode;

  return plain;
};

const parsePositiveInteger = (
  value,
  fallback
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  const parsed =
    Number(value);

  return Number.isInteger(
    parsed
  ) &&
    parsed > 0
    ? parsed
    : null;
};

const parseQueryDate = (
  value,
  {
    endOfDay = false,
  } = {}
) => {
  const rawValue =
    String(
      value ?? ""
    ).trim();

  if (!rawValue) {
    return null;
  }

  const isDateOnly =
    /^\d{4}-\d{2}-\d{2}$/.test(
      rawValue
    );

  const date =
    isDateOnly
      ? new Date(
          `${rawValue}T${
            endOfDay
              ? "23:59:59.999"
              : "00:00:00.000"
          }Z`
        )
      : new Date(
          rawValue
        );

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
};

const buildSearchConditions = (
  query
) => {
  const conditions = [
    {
      problem: {
        [Op.iLike]:
          `%${query}%`,
      },
    },
    {
      diagnosis: {
        [Op.iLike]:
          `%${query}%`,
      },
    },
    {
      workPerformed: {
        [Op.iLike]:
          `%${query}%`,
      },
    },
    {
      internalNote: {
        [Op.iLike]:
          `%${query}%`,
      },
    },
    {
      "$client.name$": {
        [Op.iLike]:
          `%${query}%`,
      },
    },
    {
      "$client.phone$": {
        [Op.iLike]:
          `%${query}%`,
      },
    },
    {
      "$client.secondaryPhone$":
        {
          [Op.iLike]:
            `%${query}%`,
        },
    },
    {
      "$client.email$": {
        [Op.iLike]:
          `%${query}%`,
      },
    },
    {
      "$device.brand$": {
        [Op.iLike]:
          `%${query}%`,
      },
    },
    {
      "$device.model$": {
        [Op.iLike]:
          `%${query}%`,
      },
    },
  ];

  const numberCandidate =
    query
      .replace(/^#/, "")
      .replace(/^0+/, "");

  if (
    /^\d+$/.test(
      numberCandidate
    )
  ) {
    const id =
      Number(
        numberCandidate
      );

    if (
      Number.isSafeInteger(
        id
      ) &&
      id > 0
    ) {
      conditions.push({
        id,
      });
    }
  }

  const normalizedIdentifier =
    normalizeDeviceIdentifier(
      query
    );

  if (
    normalizedIdentifier
  ) {
    conditions.push(
      {
        "$device.imei1Normalized$":
          {
            [Op.like]:
              `%${normalizedIdentifier}%`,
          },
      },
      {
        "$device.imei2Normalized$":
          {
            [Op.like]:
              `%${normalizedIdentifier}%`,
          },
      },
      {
        "$device.serialNormalized$":
          {
            [Op.like]:
              `%${normalizedIdentifier}%`,
          },
      }
    );
  }

  return conditions;
};

const sendQueryError = (
  res,
  error
) => {
  return res
    .status(400)
    .json({
      error,
    });
};

exports.getPagedOrders =
  async (
    req,
    res
  ) => {
    const page =
      parsePositiveInteger(
        req.query.page,
        DEFAULT_PAGE
      );

    if (!page) {
      return sendQueryError(
        res,
        "Invalid page."
      );
    }

    const pageSize =
      parsePositiveInteger(
        req.query.pageSize,
        DEFAULT_PAGE_SIZE
      );

    if (
      !pageSize ||
      pageSize >
        MAX_PAGE_SIZE
    ) {
      return sendQueryError(
        res,
        `Page size must be between 1 and ${MAX_PAGE_SIZE}.`
      );
    }

    const query =
      String(
        req.query.q ?? ""
      ).trim();

    if (
      query.length >
      MAX_SEARCH_LENGTH
    ) {
      return sendQueryError(
        res,
        `Search query cannot exceed ${MAX_SEARCH_LENGTH} characters.`
      );
    }

    const status =
      String(
        req.query.status ??
          "all"
      )
        .trim()
        .toLowerCase();

    if (
      status !== "all" &&
      !ORDER_STATUSES.has(
        status
      )
    ) {
      return sendQueryError(
        res,
        "Unsupported order status."
      );
    }

    const delivery =
      String(
        req.query.delivery ??
          "all"
      )
        .trim()
        .toLowerCase();

    if (
      !DELIVERY_FILTERS.has(
        delivery
      )
    ) {
      return sendQueryError(
        res,
        "Unsupported delivery filter."
      );
    }

    const sortBy =
      String(
        req.query.sortBy ??
          "receivedAt"
      ).trim();

    if (
      !Object.prototype.hasOwnProperty.call(
        SORT_FIELDS,
        sortBy
      )
    ) {
      return sendQueryError(
        res,
        "Unsupported sort field."
      );
    }

    const sortDirection =
      String(
        req.query.sortDirection ??
          "desc"
      )
        .trim()
        .toLowerCase();

    if (
      ![
        "asc",
        "desc",
      ].includes(
        sortDirection
      )
    ) {
      return sendQueryError(
        res,
        "Sort direction must be asc or desc."
      );
    }

    const where = {};

    if (
      status !== "all"
    ) {
      where.status =
        status;
    }

    if (
      delivery ===
      "delivered"
    ) {
      where.deliveredAt = {
        [Op.ne]: null,
      };
    } else if (
      delivery ===
      "not_delivered"
    ) {
      where.deliveredAt = {
        [Op.is]: null,
      };
    } else if (
      delivery === "ready"
    ) {
      where.status = {
        [Op.in]: [
          "completed",
          "unrepairable",
        ],
      };

      where.deliveredAt = {
        [Op.is]: null,
      };
    }

    if (query) {
      where[Op.or] =
        buildSearchConditions(
          query
        );
    }

    const startDate =
      req.query.startDate !==
      undefined
        ? parseQueryDate(
            req.query.startDate
          )
        : null;

    if (
      req.query.startDate !==
        undefined &&
      !startDate
    ) {
      return sendQueryError(
        res,
        "Invalid start date."
      );
    }

    const endDate =
      req.query.endDate !==
      undefined
        ? parseQueryDate(
            req.query.endDate,
            {
              endOfDay: true,
            }
          )
        : null;

    if (
      req.query.endDate !==
        undefined &&
      !endDate
    ) {
      return sendQueryError(
        res,
        "Invalid end date."
      );
    }

    if (
      startDate &&
      endDate &&
      startDate > endDate
    ) {
      return sendQueryError(
        res,
        "Start date cannot be later than end date."
      );
    }

    if (
      startDate ||
      endDate
    ) {
      where.receivedAt = {};

      if (startDate) {
        where.receivedAt[
          Op.gte
        ] = startDate;
      }

      if (endDate) {
        where.receivedAt[
          Op.lte
        ] = endDate;
      }
    }

    const offset =
      (page - 1) *
      pageSize;

    try {
      const {
        count,
        rows,
      } =
        await OrderWithAccessCode.findAndCountAll(
          {
            where,
            include:
              orderIncludes,

            distinct: true,
            col: "id",
            subQuery: false,

            order: [
              [
                SORT_FIELDS[
                  sortBy
                ],
                sortDirection.toUpperCase(),
              ],
              [
                "id",
                sortDirection.toUpperCase(),
              ],
            ],

            limit: pageSize,
            offset,
          }
        );

      const total =
        typeof count ===
        "number"
          ? count
          : count.length;

      const totalPages =
        total === 0
          ? 0
          : Math.ceil(
              total /
                pageSize
            );

      return res
        .status(200)
        .json({
          items:
            rows.map(
              serializeOrder
            ),

          pagination: {
            page,
            pageSize,
            total,
            totalPages,
          },

          sort: {
            field: sortBy,
            direction:
              sortDirection,
          },
        });
    } catch (error) {
      console.error(
        "Paged order list failed:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "Internal server error.",
        });
    }
  };
