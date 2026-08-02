const {
  Op,
} = require(
  "sequelize"
);

const Client = require(
  "../models/Client"
);
const Device = require(
  "../models/Device"
);
const Order = require(
  "../models/Order"
);
const User = require(
  "../models/User"
);

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 100;

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

  return (
    Number.isInteger(parsed) &&
    parsed > 0
  )
    ? parsed
    : null;
};

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

  return plain;
};

const buildSearchConditions = (
  query
) => {
  const conditions = [
    {
      archiveReason: {
        [Op.iLike]:
          `%${query}%`,
      },
    },
    {
      problem: {
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

  return conditions;
};

exports.getArchivedOrders =
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
      return res
        .status(400)
        .json({
          code:
            "ARCHIVE_INVALID_PAGE",
          error:
            "Invalid page.",
        });
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
      return res
        .status(400)
        .json({
          code:
            "ARCHIVE_INVALID_PAGE_SIZE",
          error:
            `Page size must be between 1 and ${MAX_PAGE_SIZE}.`,
        });
    }

    const query =
      String(
        req.query.q ?? ""
      ).trim();

    if (
      query.length >
      MAX_SEARCH_LENGTH
    ) {
      return res
        .status(400)
        .json({
          code:
            "ARCHIVE_SEARCH_TOO_LONG",
          error:
            `Search query cannot exceed ${MAX_SEARCH_LENGTH} characters.`,
        });
    }

    const where = {
      archivedAt: {
        [Op.ne]: null,
      },
    };

    if (query) {
      where[Op.or] =
        buildSearchConditions(
          query
        );
    }

    const offset =
      (page - 1) *
      pageSize;

    try {
      const {
        count,
        rows,
      } =
        await Order
          .unscoped()
          .findAndCountAll({
            where,

            attributes: [
              "id",
              "clientId",
              "deviceId",
              "problem",
              "status",
              "price",
              "estimatedPrice",
              "finalPrice",
              "receivedAt",
              "completedAt",
              "deliveredAt",
              "archivedAt",
              "archivedBy",
              "archiveReason",
            ],

            include: [
              {
                model:
                  Client,
                as: "client",
                required: true,

                attributes: [
                  "id",
                  "name",
                  "phone",
                  "email",
                ],
              },
              {
                model:
                  Device,
                as: "device",
                required: true,

                attributes: [
                  "id",
                  "clientId",
                  "deviceType",
                  "brand",
                  "model",
                ],
              },
              {
                model:
                  User,
                as:
                  "archivedByUser",
                required: false,

                attributes: [
                  "id",
                  "name",
                  "email",
                  "role",
                ],
              },
            ],

            distinct: true,
            col: "id",
            subQuery: false,

            order: [
              [
                "archivedAt",
                "DESC",
              ],
              [
                "id",
                "DESC",
              ],
            ],

            limit:
              pageSize,
            offset,
          });

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
        });
    } catch (error) {
      console.error(
        "Archived order list failed:",
        error
      );

      return res
        .status(500)
        .json({
          code:
            "ARCHIVE_LIST_INTERNAL_ERROR",
          error:
            "Internal server error.",
        });
    }
  };
