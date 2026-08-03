const {
  Op,
  QueryTypes,
  col,
  where,
} = require(
  "sequelize"
);

const sequelize = require(
  "../config/database"
);

const InventoryItem = require(
  "../models/InventoryItem"
);
const Order = require(
  "../models/Order"
);
const StockMovement = require(
  "../models/StockMovement"
);
const User = require(
  "../models/User"
);

const {
  recalculateOrderFinalPrice,
} = require(
  "../services/orderFinanceService"
);

const {
  positiveId,
  validateItemPayload,
  validateMovementPayload,
} = require(
  "../validators/inventoryValidator"
);

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

const parsePagination = (
  query
) => {
  const page =
    Math.max(
      Number.parseInt(
        query.page,
        10
      ) || 1,
      1
    );

  const pageSize =
    Math.min(
      Math.max(
        Number.parseInt(
          query.pageSize,
          10
        ) ||
          DEFAULT_PAGE_SIZE,
        1
      ),
      MAX_PAGE_SIZE
    );

  return {
    page,
    pageSize,
    offset:
      (
        page - 1
      ) *
      pageSize,
  };
};

const numberOrZero = (
  value
) => {
  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : 0;
};

const numberOrNull = (
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

const isLowStock = (
  currentQuantity,
  minStock
) =>
  minStock > 0 &&
  currentQuantity > 0 &&
  currentQuantity <=
    minStock;

const serializeItem = (
  item
) => {
  const plain =
    item.get({
      plain: true,
    });

  plain.purchasePrice =
    numberOrZero(
      plain.purchasePrice
    );

  plain.salePrice =
    numberOrZero(
      plain.salePrice
    );

  plain.isLowStock =
    isLowStock(
      plain.currentQuantity,
      plain.minStock
    );

  return plain;
};

const serializeMovement = (
  movement
) => {
  const plain =
    movement.get({
      plain: true,
    });

  plain.unitCost =
    numberOrNull(
      plain.unitCost
    );

  plain.unitPrice =
    numberOrNull(
      plain.unitPrice
    );

  return plain;
};

const sendValidationError = (
  res,
  errors
) =>
  res.status(400).json({
    code:
      "INVENTORY_VALIDATION_FAILED",
    error:
      "Inventory validation failed.",
    details: errors,
  });

const handleInventoryError = (
  res,
  error,
  operation
) => {
  if (
    error.name ===
    "SequelizeUniqueConstraintError"
  ) {
    const fields =
      Object.keys(
        error.fields ??
          {}
      );

    let code =
      "INVENTORY_DUPLICATE";

    let message =
      "An inventory item with these identifiers already exists.";

    if (
      fields.includes(
        "sku"
      )
    ) {
      code =
        "INVENTORY_SKU_EXISTS";

      message =
        "An inventory item with this SKU already exists.";
    } else if (
      fields.includes(
        "supplierSku"
      )
    ) {
      code =
        "INVENTORY_SUPPLIER_SKU_EXISTS";

      message =
        "An inventory item with this supplier SKU already exists.";
    } else if (
      fields.includes(
        "barcode"
      )
    ) {
      code =
        "INVENTORY_BARCODE_EXISTS";

      message =
        "An inventory item with this barcode already exists.";
    }

    return res
      .status(409)
      .json({
        code,
        error: message,
      });
  }

  if (
    error.code &&
    error.status
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
      });
  }

  console.error(
    `Inventory ${operation} failed:`,
    error
  );

  return res
    .status(500)
    .json({
      code:
        "INVENTORY_INTERNAL_ERROR",
      error:
        "Internal server error.",
    });
};

const makeControlledError = (
  status,
  code,
  message
) => {
  const error =
    new Error(
      message
    );

  error.status =
    status;
  error.code =
    code;

  return error;
};

const movementIncludes = [
  {
    model: User,
    as: "createdBy",
    attributes: [
      "id",
      "name",
      "email",
      "role",
    ],
  },
  {
    model: Order,
    as: "order",
    attributes: [
      "id",
      "status",
      "problem",
    ],
    required: false,
  },
];

const movementDelta = (
  type,
  quantity
) => {
  switch (type) {
    case "receipt":
    case "return":
      return Math.abs(
        quantity
      );

    case "issue":
      return -Math.abs(
        quantity
      );

    case "adjustment":
      return quantity;

    default:
      return 0;
  }
};

exports.getItems = async (
  req,
  res
) => {
  const {
    page,
    pageSize,
    offset,
  } = parsePagination(
    req.query
  );

  const search =
    String(
      req.query.q ??
        ""
    ).trim();

  const category =
    String(
      req.query.category ??
        ""
    ).trim();

  const whereConditions =
    [];

  if (search) {
    whereConditions.push({
      [Op.or]: [
        {
          sku: {
            [Op.iLike]:
              `%${search}%`,
          },
        },
        {
          supplierSku: {
            [Op.iLike]:
              `%${search}%`,
          },
        },
        {
          barcode: {
            [Op.iLike]:
              `%${search}%`,
          },
        },
        {
          name: {
            [Op.iLike]:
              `%${search}%`,
          },
        },
        {
          category: {
            [Op.iLike]:
              `%${search}%`,
          },
        },
        {
          brand: {
            [Op.iLike]:
              `%${search}%`,
          },
        },
        {
          compatibility: {
            [Op.iLike]:
              `%${search}%`,
          },
        },
        {
          supplier: {
            [Op.iLike]:
              `%${search}%`,
          },
        },
      ],
    });
  }

  if (category) {
    whereConditions.push({
      category: {
        [Op.iLike]:
          category,
      },
    });
  }

  if (
    String(
      req.query.lowStock ??
        ""
    ).toLowerCase() ===
    "true"
  ) {
    whereConditions.push(
      {
        currentQuantity: {
          [Op.gt]: 0,
        },
        minStock: {
          [Op.gt]: 0,
        },
      },
      where(
        col(
          "currentQuantity"
        ),
        Op.lte,
        col(
          "minStock"
        )
      )
    );
  }

  if (
    req.query.active !==
    undefined
  ) {
    const active =
      String(
        req.query.active
      ).toLowerCase();

    if (
      active !== "true" &&
      active !== "false"
    ) {
      return res
        .status(400)
        .json({
          code:
            "INVENTORY_INVALID_FILTER",
          error:
            "Active filter must be true or false.",
        });
    }

    whereConditions.push({
      isActive:
        active ===
        "true",
    });
  }

  const whereClause =
    whereConditions.length >
    0
      ? {
          [Op.and]:
            whereConditions,
        }
      : {};

  try {
    const result =
      await InventoryItem
        .findAndCountAll({
          where:
            whereClause,

          order: [
            [
              "name",
              "ASC",
            ],
            [
              "id",
              "ASC",
            ],
          ],

          limit:
            pageSize,
          offset,
        });

    return res
      .status(200)
      .json({
        items:
          result.rows.map(
            serializeItem
          ),

        pagination: {
          page,
          pageSize,
          total:
            result.count,
          totalPages:
            Math.ceil(
              result.count /
                pageSize
            ),
        },
      });
  } catch (error) {
    return handleInventoryError(
      res,
      error,
      "list"
    );
  }
};

exports.getItem = async (
  req,
  res
) => {
  const itemId =
    positiveId(
      req.params.id
    );

  if (!itemId) {
    return res
      .status(400)
      .json({
        code:
          "INVENTORY_INVALID_ID",
        error:
          "Inventory item ID is invalid.",
      });
  }

  try {
    const item =
      await InventoryItem.findByPk(
        itemId
      );

    if (!item) {
      return res
        .status(404)
        .json({
          code:
            "INVENTORY_NOT_FOUND",
          error:
            "Inventory item not found.",
        });
    }

    return res
      .status(200)
      .json(
        serializeItem(
          item
        )
      );
  } catch (error) {
    return handleInventoryError(
      res,
      error,
      "read"
    );
  }
};

exports.getSummary = async (
  req,
  res
) => {
  try {
    const [row] =
      await sequelize.query(
        `
          SELECT
            COUNT(*)::integer AS "activeItems",

            COALESCE(
              SUM("currentQuantity"),
              0
            )::integer AS "totalUnits",

            COUNT(*) FILTER (
              WHERE "minStock" > 0
                AND "currentQuantity" > 0
                AND "currentQuantity" <= "minStock"
            )::integer AS "lowStockItems",

            COUNT(*) FILTER (
              WHERE "currentQuantity" = 0
            )::integer AS "outOfStockItems",

            COALESCE(
              SUM(
                "currentQuantity" *
                "purchasePrice"
              ),
              0
            )::numeric AS "purchaseValue",

            COALESCE(
              SUM(
                "currentQuantity" *
                "salePrice"
              ),
              0
            )::numeric AS "saleValue"

          FROM "inventory_items"
          WHERE "isActive" = TRUE
        `,
        {
          type:
            QueryTypes.SELECT,
        }
      );

    const summary = {
      activeItems:
        numberOrZero(
          row?.activeItems
        ),

      totalUnits:
        numberOrZero(
          row?.totalUnits
        ),

      lowStockItems:
        numberOrZero(
          row?.lowStockItems
        ),

      outOfStockItems:
        numberOrZero(
          row?.outOfStockItems
        ),

      purchaseValue:
        Math.round(
          numberOrZero(
            row?.purchaseValue
          ) * 100
        ) / 100,

      saleValue:
        Math.round(
          numberOrZero(
            row?.saleValue
          ) * 100
        ) / 100,
    };

    return res
      .status(200)
      .json(summary);
  } catch (error) {
    return handleInventoryError(
      res,
      error,
      "summary"
    );
  }
};

exports.createItem = async (
  req,
  res
) => {
  const validation =
    validateItemPayload(
      req.body
    );

  if (
    !validation.isValid
  ) {
    return sendValidationError(
      res,
      validation.errors
    );
  }

  const transaction =
    await sequelize.transaction();

  try {
    const item =
      await InventoryItem.create(
        {
          ...validation.payload,
          currentQuantity: 0,
        },
        {
          transaction,
        }
      );

    if (
      validation.initialQuantity >
      0
    ) {
      await StockMovement.create(
        {
          inventoryItemId:
            item.id,

          type:
            "receipt",

          quantityChange:
            validation.initialQuantity,

          balanceBefore:
            0,

          balanceAfter:
            validation.initialQuantity,

          unitCost:
            validation.payload
              .purchasePrice,

          orderId: null,

          userId:
            req.auth.user.id,

          note:
            "Initial stock",
        },
        {
          transaction,
        }
      );

      await item.update(
        {
          currentQuantity:
            validation.initialQuantity,
        },
        {
          transaction,
        }
      );
    }

    await transaction.commit();

    return res
      .status(201)
      .json(
        serializeItem(
          item
        )
      );
  } catch (error) {
    await transaction.rollback();

    return handleInventoryError(
      res,
      error,
      "create"
    );
  }
};

exports.updateItem = async (
  req,
  res
) => {
  const itemId =
    positiveId(
      req.params.id
    );

  if (!itemId) {
    return res
      .status(400)
      .json({
        code:
          "INVENTORY_INVALID_ID",
        error:
          "Inventory item ID is invalid.",
      });
  }

  if (
    req.body
      .currentQuantity !==
    undefined ||
    req.body
      .initialQuantity !==
    undefined
  ) {
    return res
      .status(400)
      .json({
        code:
          "INVENTORY_DIRECT_QUANTITY_FORBIDDEN",
        error:
          "Stock quantity can only be changed through a stock movement.",
      });
  }

  const validation =
    validateItemPayload(
      req.body,
      {
        isUpdate: true,
      }
    );

  if (
    !validation.isValid
  ) {
    return sendValidationError(
      res,
      validation.errors
    );
  }

  if (
    Object.keys(
      validation.payload
    ).length === 0
  ) {
    return res
      .status(400)
      .json({
        code:
          "INVENTORY_EMPTY_UPDATE",
        error:
          "No inventory fields were provided for update.",
      });
  }

  try {
    const item =
      await InventoryItem.findByPk(
        itemId
      );

    if (!item) {
      return res
        .status(404)
        .json({
          code:
            "INVENTORY_NOT_FOUND",
          error:
            "Inventory item not found.",
        });
    }

    await item.update(
      validation.payload
    );

    return res
      .status(200)
      .json(
        serializeItem(
          item
        )
      );
  } catch (error) {
    return handleInventoryError(
      res,
      error,
      "update"
    );
  }
};

exports.createMovement = async (
  req,
  res
) => {
  const itemId =
    positiveId(
      req.params.id
    );

  if (!itemId) {
    return res
      .status(400)
      .json({
        code:
          "INVENTORY_INVALID_ID",
        error:
          "Inventory item ID is invalid.",
      });
  }

  const validation =
    validateMovementPayload(
      req.body
    );

  if (
    !validation.isValid
  ) {
    return sendValidationError(
      res,
      validation.errors
    );
  }

  const transaction =
    await sequelize.transaction();

  try {
    const item =
      await InventoryItem.findByPk(
        itemId,
        {
          transaction,
          lock:
            transaction.LOCK
              .UPDATE,
        }
      );

    if (!item) {
      throw makeControlledError(
        404,
        "INVENTORY_NOT_FOUND",
        "Inventory item not found."
      );
    }

    if (!item.isActive) {
      throw makeControlledError(
        409,
        "INVENTORY_ITEM_INACTIVE",
        "Stock movements cannot be created for an inactive inventory item."
      );
    }

    if (
      validation.payload
        .orderId
    ) {
      const order =
        await Order.findByPk(
          validation.payload
            .orderId,
          {
            attributes: [
              "id",
            ],
            transaction,
          }
        );

      if (!order) {
        throw makeControlledError(
          404,
          "INVENTORY_ORDER_NOT_FOUND",
          "Order not found."
        );
      }
    }

    if (
      validation.payload.type ===
        "return" &&
      validation.payload.orderId
    ) {
      const orderMovementBalance =
        await StockMovement.sum(
          "quantityChange",
          {
            where: {
              inventoryItemId:
                item.id,
              orderId:
                validation.payload.orderId,
              type: {
                [Op.in]: [
                  "issue",
                  "return",
                ],
              },
            },
            transaction,
          }
        );

      const quantityStillIssued =
        Math.max(
          0,
          -Number(
            orderMovementBalance ?? 0
          )
        );

      if (
        validation.payload.quantity >
        quantityStillIssued
      ) {
        throw makeControlledError(
          409,
          "INVENTORY_RETURN_EXCEEDS_ISSUED",
          "Cannot return more than was issued to this order. Remaining issued quantity: " +
            quantityStillIssued +
            "."
        );
      }
    }

    const resolvedUnitCost =
      validation.payload
        .unitCost ??
      numberOrZero(
        item.purchasePrice
      );

    const resolvedUnitPrice =
      [
        "issue",
        "return",
      ].includes(
        validation.payload
          .type
      )
        ? (
            validation.payload
              .unitPrice ??
            numberOrZero(
              item.salePrice
            )
          )
        : null;

    const delta =
      movementDelta(
        validation.payload
          .type,
        validation.payload
          .quantity
      );

    const balanceBefore =
      item.currentQuantity;

    const balanceAfter =
      balanceBefore +
      delta;

    if (
      balanceAfter < 0
    ) {
      throw makeControlledError(
        409,
        "INVENTORY_INSUFFICIENT_STOCK",
        `Insufficient stock. Available quantity: ${balanceBefore}.`
      );
    }

    const movement =
      await StockMovement.create(
        {
          inventoryItemId:
            item.id,

          type:
            validation.payload
              .type,

          quantityChange:
            delta,

          balanceBefore,
          balanceAfter,

          unitCost:
            resolvedUnitCost,

          unitPrice:
            resolvedUnitPrice,

          orderId:
            validation.payload
              .orderId,

          userId:
            req.auth.user.id,

          note:
            validation.payload
              .note,
        },
        {
          transaction,
        }
      );

    await item.update(
      {
        currentQuantity:
          balanceAfter,
      },
      {
        transaction,
      }
    );

    if (
      validation.payload
        .orderId &&
      [
        "issue",
        "return",
      ].includes(
        validation.payload
          .type
      )
    ) {
      await recalculateOrderFinalPrice(
        validation.payload
          .orderId,
        transaction
      );
    }

    await transaction.commit();

    const completeMovement =
      await StockMovement.findByPk(
        movement.id,
        {
          include:
            movementIncludes,
        }
      );

    return res
      .status(201)
      .json({
        item:
          serializeItem(
            item
          ),

        movement:
          serializeMovement(
            completeMovement
          ),
      });
  } catch (error) {
    await transaction.rollback();

    return handleInventoryError(
      res,
      error,
      "movement"
    );
  }
};

exports.getMovements = async (
  req,
  res
) => {
  const itemId =
    positiveId(
      req.params.id
    );

  if (!itemId) {
    return res
      .status(400)
      .json({
        code:
          "INVENTORY_INVALID_ID",
        error:
          "Inventory item ID is invalid.",
      });
  }

  const {
    page,
    pageSize,
    offset,
  } = parsePagination(
    req.query
  );

  try {
    const item =
      await InventoryItem.findByPk(
        itemId,
        {
          attributes: [
            "id",
          ],
        }
      );

    if (!item) {
      return res
        .status(404)
        .json({
          code:
            "INVENTORY_NOT_FOUND",
          error:
            "Inventory item not found.",
        });
    }

    const result =
      await StockMovement
        .findAndCountAll({
          where: {
            inventoryItemId:
              itemId,
          },

          include:
            movementIncludes,

          order: [
            [
              "createdAt",
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

    return res
      .status(200)
      .json({
        movements:
          result.rows.map(
            serializeMovement
          ),

        pagination: {
          page,
          pageSize,
          total:
            result.count,
          totalPages:
            Math.ceil(
              result.count /
                pageSize
            ),
        },
      });
  } catch (error) {
    return handleInventoryError(
      res,
      error,
      "movement list"
    );
  }
};
