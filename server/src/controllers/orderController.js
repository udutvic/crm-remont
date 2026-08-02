const { Op } = require("sequelize");

const Client = require("../models/Client");
const Device = require("../models/Device");
const Order = require("../models/Order");

const normalizeDeviceIdentifier =
  require(
    "../utils/normalizeDeviceIdentifier"
  );

const {
  decryptAccessCode,
  encryptAccessCode,
} = require(
  "../utils/accessCodeCrypto"
);

const {
  ORDER_STATUSES,
  REQUIRED_CODE_TYPES,
  validateOrderPayload,
} = require(
  "../validators/orderValidator"
);

const OrderWithAccessCode =
  Order.scope("withAccessCode");

const orderIncludes = [
  {
    model: Client,
    as: "client",
  },
  {
    model: Device,
    as: "device",
  },
];

const parsePositiveId = (value) => {
  const id = Number(value);

  return Number.isInteger(id) && id > 0
    ? id
    : null;
};

const toNumberOrNull = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
};

const serializeOrder = (order) => {
  const plain = order.get({
    plain: true,
  });

  const hasAccessCode = Boolean(
    plain.accessCodeEncrypted
  );

  delete plain.accessCodeEncrypted;

  plain.price = toNumberOrNull(
    plain.price
  );

  plain.estimatedPrice =
    toNumberOrNull(
      plain.estimatedPrice
    );

  plain.finalPrice = toNumberOrNull(
    plain.finalPrice
  );

  plain.hasAccessCode =
    hasAccessCode;

  return plain;
};

const sendValidationError = (
  res,
  errors
) =>
  res.status(400).json({
    error:
      "Order validation failed.",
    details: errors,
  });

const handleOrderError = (
  res,
  error,
  operation
) => {
  if (
    error.name ===
    "SequelizeValidationError"
  ) {
    return res.status(400).json({
      error:
        "Order validation failed.",

      details: error.errors.reduce(
        (
          details,
          validationError
        ) => {
          const field =
            validationError.path ??
            "order";

          details[field] =
            validationError.message;

          return details;
        },
        {}
      ),
    });
  }

  if (
    error.name ===
    "SequelizeForeignKeyConstraintError"
  ) {
    return res.status(400).json({
      error:
        "The selected client or device is invalid.",
    });
  }

  console.error(
    `Order ${operation} failed:`,
    error
  );

  return res.status(500).json({
    error: "Internal server error.",
  });
};

const validateClientDeviceRelation =
  async (
    clientId,
    deviceId
  ) => {
    const [client, device] =
      await Promise.all([
        Client.findByPk(clientId, {
          attributes: ["id"],
        }),

        Device.findByPk(deviceId, {
          attributes: [
            "id",
            "clientId",
          ],
        }),
      ]);

    if (!client) {
      return {
        status: 404,
        error: "Client not found.",
      };
    }

    if (!device) {
      return {
        status: 404,
        error: "Device not found.",
      };
    }

    if (
      device.clientId !== clientId
    ) {
      return {
        status: 409,

        error:
          "The selected device does not belong to the selected client.",
      };
    }

    return null;
  };

const applyAccessCodeChange = ({
  currentOrder = null,
  validation,
  payload,
}) => {
  const effectiveAccessType =
    payload.accessType ??
    currentOrder?.accessType ??
    "none";

  const currentlyHasAccessCode =
    Boolean(
      currentOrder
        ?.accessCodeEncrypted
    );

  if (
    validation.accessCodeAction ===
    "set"
  ) {
    if (
      effectiveAccessType === "none"
    ) {
      return {
        accessCode:
          "Access code cannot be provided when access type is none.",
      };
    }

    payload.accessCodeEncrypted =
      encryptAccessCode(
        validation.accessCode
      );

    return null;
  }

  if (
    validation.accessCodeAction ===
    "clear"
  ) {
    payload.accessCodeEncrypted =
      null;

    return null;
  }

  if (
    effectiveAccessType === "none"
  ) {
    payload.accessCodeEncrypted =
      null;

    return null;
  }

  if (
    REQUIRED_CODE_TYPES.has(
      effectiveAccessType
    ) &&
    !currentlyHasAccessCode
  ) {
    return {
      accessCode:
        "Access code is required for the selected access type.",
    };
  }

  return null;
};

const applyStatusDates = ({
  currentOrder = null,
  payload,
}) => {
  const nextStatus =
    payload.status;

  if (!nextStatus) {
    return;
  }

  if (nextStatus === "completed") {
    if (!currentOrder?.completedAt) {
      payload.completedAt =
        new Date();
    }

    return;
  }

  payload.completedAt = null;
  payload.deliveredAt = null;
};

const findOrderWithRelations = (
  orderId
) =>
  OrderWithAccessCode.findByPk(
    orderId,
    {
      include: orderIncludes,
    }
  );

const parseQueryDate = (
  value,
  {
    endOfDay = false,
  } = {}
) => {
  const rawValue = String(
    value ?? ""
  ).trim();

  if (!rawValue) {
    return null;
  }

  const isDateOnly =
    /^\d{4}-\d{2}-\d{2}$/.test(
      rawValue
    );

  const date = isDateOnly
    ? new Date(
        `${rawValue}T${
          endOfDay
            ? "23:59:59.999"
            : "00:00:00.000"
        }Z`
      )
    : new Date(rawValue);

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
};

exports.getAllOrders = async (
  req,
  res
) => {
  const where = {};

  if (
    req.query.status !== undefined
  ) {
    const status = String(
      req.query.status
    )
      .trim()
      .toLowerCase();

    if (
      !ORDER_STATUSES.has(status)
    ) {
      return res.status(400).json({
        error:
          "Unsupported order status.",
      });
    }

    where.status = status;
  }

  for (const fieldName of [
    "clientId",
    "deviceId",
  ]) {
    if (
      req.query[fieldName] !==
      undefined
    ) {
      const id = parsePositiveId(
        req.query[fieldName]
      );

      if (!id) {
        return res.status(400).json({
          error:
            `Invalid ${fieldName}.`,
        });
      }

      where[fieldName] = id;
    }
  }

  if (
    req.query.startDate !==
      undefined ||
    req.query.endDate !== undefined
  ) {
    const createdAt = {};

    if (
      req.query.startDate !==
      undefined
    ) {
      const startDate =
        parseQueryDate(
          req.query.startDate
        );

      if (!startDate) {
        return res.status(400).json({
          error:
            "Invalid start date.",
        });
      }

      createdAt[Op.gte] =
        startDate;
    }

    if (
      req.query.endDate !==
      undefined
    ) {
      const endDate = parseQueryDate(
        req.query.endDate,
        {
          endOfDay: true,
        }
      );

      if (!endDate) {
        return res.status(400).json({
          error:
            "Invalid end date.",
        });
      }

      createdAt[Op.lte] =
        endDate;
    }

    if (
      createdAt[Op.gte] &&
      createdAt[Op.lte] &&
      createdAt[Op.gte] >
        createdAt[Op.lte]
    ) {
      return res.status(400).json({
        error:
          "Start date cannot be later than end date.",
      });
    }

    where.createdAt = createdAt;
  }

  try {
    const orders =
      await OrderWithAccessCode.findAll({
        where,
        include: orderIncludes,

        order: [
          ["createdAt", "DESC"],
          ["id", "DESC"],
        ],
      });

    return res.status(200).json(
      orders.map(serializeOrder)
    );
  } catch (error) {
    return handleOrderError(
      res,
      error,
      "list"
    );
  }
};

exports.revealAccessCode =
  async (
    req,
    res
  ) => {
    const orderId =
      parsePositiveId(
        req.params.id
      );

    if (!orderId) {
      return res
        .status(400)
        .json({
          code:
            "INVALID_ORDER_ID",
          error:
            "Invalid order ID.",
        });
    }

    try {
      const order =
        await OrderWithAccessCode.findByPk(
          orderId,
          {
            attributes: [
              "id",
              "accessType",
              "accessCodeEncrypted",
            ],
          }
        );

      if (!order) {
        return res
          .status(404)
          .json({
            code:
              "ORDER_NOT_FOUND",
            error:
              "Order not found.",
          });
      }

      if (
        !order
          .accessCodeEncrypted
      ) {
        return res
          .status(404)
          .json({
            code:
              "ACCESS_CODE_NOT_SET",
            error:
              "No access code is stored for this order.",
          });
      }

      const accessCode =
        decryptAccessCode(
          order
            .accessCodeEncrypted
        );

      res.set({
        "Cache-Control":
          "no-store, private",
        Pragma:
          "no-cache",
      });

      return res
        .status(200)
        .json({
          orderId:
            order.id,

          accessType:
            order.accessType,

          accessCode,
        });
    } catch (error) {
      return handleOrderError(
        res,
        error,
        "access-code reveal"
      );
    }
  };

exports.getOrder = async (
  req,
  res
) => {
  const orderId = parsePositiveId(
    req.params.id
  );

  if (!orderId) {
    return res.status(400).json({
      error: "Invalid order ID.",
    });
  }

  try {
    const order =
      await findOrderWithRelations(
        orderId
      );

    if (!order) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    return res
      .status(200)
      .json(serializeOrder(order));
  } catch (error) {
    return handleOrderError(
      res,
      error,
      "read"
    );
  }
};

exports.createOrder = async (
  req,
  res
) => {
  const validation =
    validateOrderPayload(req.body);

  if (!validation.isValid) {
    return sendValidationError(
      res,
      validation.errors
    );
  }

  try {
    const relationError =
      await validateClientDeviceRelation(
        validation.payload.clientId,
        validation.payload.deviceId
      );

    if (relationError) {
      return res
        .status(relationError.status)
        .json({
          error:
            relationError.error,
        });
    }

    const payload = {
      ...validation.payload,
    };

    const accessCodeErrors =
      applyAccessCodeChange({
        validation,
        payload,
      });

    if (accessCodeErrors) {
      return sendValidationError(
        res,
        accessCodeErrors
      );
    }

    applyStatusDates({
      payload,
    });

    const createdOrder =
      await Order.create(payload);

    const order =
      await findOrderWithRelations(
        createdOrder.id
      );

    return res
      .status(201)
      .json(serializeOrder(order));
  } catch (error) {
    return handleOrderError(
      res,
      error,
      "create"
    );
  }
};

exports.updateOrder = async (
  req,
  res
) => {
  const orderId = parsePositiveId(
    req.params.id
  );

  if (!orderId) {
    return res.status(400).json({
      error: "Invalid order ID.",
    });
  }

  const validation =
    validateOrderPayload(
      req.body,
      {
        isUpdate: true,
      }
    );

  if (!validation.isValid) {
    return sendValidationError(
      res,
      validation.errors
    );
  }

  try {
    const order =
      await OrderWithAccessCode.findByPk(
        orderId
      );

    if (!order) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    const relationError =
      await validateClientDeviceRelation(
        validation.payload.clientId,
        validation.payload.deviceId
      );

    if (relationError) {
      return res
        .status(relationError.status)
        .json({
          error:
            relationError.error,
        });
    }

    const payload = {
      ...validation.payload,
    };

    const accessCodeErrors =
      applyAccessCodeChange({
        currentOrder: order,
        validation,
        payload,
      });

    if (accessCodeErrors) {
      return sendValidationError(
        res,
        accessCodeErrors
      );
    }

    applyStatusDates({
      currentOrder: order,
      payload,
    });

    await order.update(payload);

    const updatedOrder =
      await findOrderWithRelations(
        orderId
      );

    return res
      .status(200)
      .json(
        serializeOrder(
          updatedOrder
        )
      );
  } catch (error) {
    return handleOrderError(
      res,
      error,
      "update"
    );
  }
};

exports.updateOrderStatus = async (
  req,
  res
) => {
  const orderId = parsePositiveId(
    req.params.id
  );

  if (!orderId) {
    return res.status(400).json({
      error: "Invalid order ID.",
    });
  }

  const status = String(
    req.body?.status ?? ""
  )
    .trim()
    .toLowerCase();

  if (
    !ORDER_STATUSES.has(status)
  ) {
    return res.status(400).json({
      error:
        "Unsupported order status.",
    });
  }

  try {
    const order =
      await OrderWithAccessCode.findByPk(
        orderId
      );

    if (!order) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    const payload = {
      status,
    };

    applyStatusDates({
      currentOrder: order,
      payload,
    });

    await order.update(payload);

    const updatedOrder =
      await findOrderWithRelations(
        orderId
      );

    return res
      .status(200)
      .json(
        serializeOrder(
          updatedOrder
        )
      );
  } catch (error) {
    return handleOrderError(
      res,
      error,
      "status update"
    );
  }
};

exports.markOrderDelivered = async (
  req,
  res
) => {
  const orderId = parsePositiveId(
    req.params.id
  );

  if (!orderId) {
    return res.status(400).json({
      error: "Invalid order ID.",
    });
  }

  try {
    const order =
      await OrderWithAccessCode.findByPk(
        orderId
      );

    if (!order) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    const deliverableStatuses =
      new Set([
        "completed",
        "unrepairable",
      ]);

    if (
      !deliverableStatuses.has(
        order.status
      )
    ) {
      return res.status(409).json({
        error:
          "Only a completed or unrepairable order can be marked as delivered.",
      });
    }

    const now = new Date();
    const updates = {};

    if (
      order.status ===
        "completed" &&
      !order.completedAt
    ) {
      updates.completedAt = now;
    }

    if (!order.deliveredAt) {
      updates.deliveredAt = now;
    }

    if (
      Object.keys(updates).length > 0
    ) {
      await order.update(updates);
    }

    const updatedOrder =
      await findOrderWithRelations(
        orderId
      );

    return res
      .status(200)
      .json(
        serializeOrder(
          updatedOrder
        )
      );
  } catch (error) {
    return handleOrderError(
      res,
      error,
      "delivery update"
    );
  }
};

exports.deleteOrder = async (
  req,
  res
) => {
  const orderId = parsePositiveId(
    req.params.id
  );

  if (!orderId) {
    return res.status(400).json({
      error: "Invalid order ID.",
    });
  }

  try {
    const order =
      await Order.findByPk(
        orderId
      );

    if (!order) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    await order.destroy();

    return res.status(204).send();
  } catch (error) {
    return handleOrderError(
      res,
      error,
      "delete"
    );
  }
};

exports.searchOrders = async (
  req,
  res
) => {
  const query = String(
    req.query.q ?? ""
  ).trim();

  if (!query) {
    return res.status(200).json([]);
  }

  if (query.length > 100) {
    return res.status(400).json({
      error:
        "Search query cannot exceed 100 characters.",
    });
  }

  const normalizedIdentifier =
    normalizeDeviceIdentifier(query);

  const searchConditions = [
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

  if (normalizedIdentifier) {
    searchConditions.push(
      {
        "$device.imei1Normalized$": {
          [Op.like]:
            `%${normalizedIdentifier}%`,
        },
      },
      {
        "$device.imei2Normalized$": {
          [Op.like]:
            `%${normalizedIdentifier}%`,
        },
      },
      {
        "$device.serialNormalized$": {
          [Op.like]:
            `%${normalizedIdentifier}%`,
        },
      }
    );
  }

  try {
    const orders =
      await OrderWithAccessCode.findAll({
        where: {
          [Op.or]:
            searchConditions,
        },

        include: orderIncludes,

        order: [
          ["createdAt", "DESC"],
          ["id", "DESC"],
        ],

        limit: 50,
        subQuery: false,
      });

    return res.status(200).json(
      orders.map(serializeOrder)
    );
  } catch (error) {
    return handleOrderError(
      res,
      error,
      "search"
    );
  }
};