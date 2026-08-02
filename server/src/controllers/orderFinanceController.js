const sequelize = require(
  "../config/database"
);

const Order = require(
  "../models/Order"
);

const {
  getOrderFinance,
  recalculateOrderFinalPrice,
} = require(
  "../services/orderFinanceService"
);

const positiveId = (
  value
) => {
  const number =
    Number(value);

  return (
    Number.isInteger(
      number
    ) &&
    number > 0
  )
    ? number
    : null;
};

const parseMoneyField = (
  body,
  field,
  currentValue,
  errors
) => {
  if (
    !Object.prototype
      .hasOwnProperty
      .call(
        body,
        field
      )
  ) {
    return Math.round(
      Number(
        currentValue ??
          0
      )
    );
  }

  const number =
    Number(
      body[field]
    );

  if (
    !Number.isFinite(
      number
    )
  ) {
    errors[field] =
      `${field} must be a number.`;

    return 0;
  }

  if (number < 0) {
    errors[field] =
      `${field} cannot be negative.`;

    return 0;
  }

  if (
    !Number.isInteger(
      number
    )
  ) {
    errors[field] =
      `${field} must be a whole amount in CZK.`;

    return 0;
  }

  if (
    number >
    9999999999
  ) {
    errors[field] =
      `${field} is too large.`;

    return 0;
  }

  return number;
};

const controlledError = (
  status,
  code,
  message,
  details = undefined
) => {
  const error =
    new Error(message);

  error.status = status;
  error.code = code;
  error.details =
    details;

  return error;
};

const sendError = (
  res,
  error,
  operation
) => {
  if (
    error.status &&
    error.code
  ) {
    return res
      .status(
        error.status
      )
      .json({
        code:
          error.code,
        error:
          error.message,
        ...(error.details
          ? {
              details:
                error.details,
            }
          : {}),
      });
  }

  console.error(
    `Order finance ${operation} failed:`,
    error
  );

  return res
    .status(500)
    .json({
      code:
        "ORDER_FINANCE_INTERNAL_ERROR",
      error:
        "Internal server error.",
    });
};

exports.getFinance =
  async (
    req,
    res
  ) => {
    const orderId =
      positiveId(
        req.params.id
      );

    if (!orderId) {
      return res
        .status(400)
        .json({
          code:
            "ORDER_FINANCE_INVALID_ID",
          error:
            "Invalid order ID.",
        });
    }

    try {
      const isAdmin =
        req.auth.user
          .role ===
        "admin";

      const finance =
        await getOrderFinance(
          orderId,
          {
            includeInternal:
              isAdmin,
            canEdit:
              isAdmin,
          }
        );

      if (!finance) {
        return res
          .status(404)
          .json({
            code:
              "ORDER_FINANCE_NOT_FOUND",
            error:
              "Order not found.",
          });
      }

      return res
        .status(200)
        .json(finance);
    } catch (error) {
      return sendError(
        res,
        error,
        "read"
      );
    }
  };

exports.updateFinance =
  async (
    req,
    res
  ) => {
    const orderId =
      positiveId(
        req.params.id
      );

    if (!orderId) {
      return res
        .status(400)
        .json({
          code:
            "ORDER_FINANCE_INVALID_ID",
          error:
            "Invalid order ID.",
        });
    }

    if (
      !req.body ||
      typeof req.body !==
        "object" ||
      Array.isArray(
        req.body
      )
    ) {
      return res
        .status(400)
        .json({
          code:
            "ORDER_FINANCE_VALIDATION_FAILED",
          error:
            "Finance payload must be a JSON object.",
        });
    }

    const transaction =
      await sequelize
        .transaction();

    try {
      const order =
        await Order.findByPk(
          orderId,
          {
            transaction,
            lock:
              transaction.LOCK
                .UPDATE,
          }
        );

      if (!order) {
        throw controlledError(
          404,
          "ORDER_FINANCE_NOT_FOUND",
          "Order not found."
        );
      }

      const errors = {};

      const finalPrice =
        parseMoneyField(
          req.body,
          "finalPrice",
          order.finalPrice,
          errors
        );

      const discount =
        parseMoneyField(
          req.body,
          "discount",
          order.discount,
          errors
        );

      const otherCosts =
        parseMoneyField(
          req.body,
          "otherCosts",
          order.otherCosts,
          errors
        );

      if (
        Object.keys(
          errors
        ).length > 0
      ) {
        throw controlledError(
          400,
          "ORDER_FINANCE_VALIDATION_FAILED",
          "Finance validation failed.",
          errors
        );
      }

      await order.update(
        {
          finalPrice,
          discount,
          otherCosts,
        },
        {
          transaction,
        }
      );

      const finance =
        await recalculateOrderFinalPrice(
          orderId,
          transaction
        );

      await transaction.commit();

      return res
        .status(200)
        .json(finance);
    } catch (error) {
      await transaction.rollback();

      return sendError(
        res,
        error,
        "update"
      );
    }
  };
