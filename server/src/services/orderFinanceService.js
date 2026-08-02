const {
  Op,
} = require(
  "sequelize"
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

const money = (
  value
) => {
  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return 0;
  }

  return (
    Math.round(
      (
        number +
        Number.EPSILON
      ) * 100
    ) / 100
  );
};

const movementPrice = (
  movement,
  field,
  fallbackField
) =>
  money(
    movement[field] ??
      movement
        .inventoryItem?.[
          fallbackField
        ] ??
      0
  );

const loadFinanceData =
  async (
    orderId,
    {
      transaction = null,
      lockOrder = false,
    } = {}
  ) => {
    const orderOptions = {
      attributes: [
        "id",
        "status",
        "deliveredAt",
        "laborPrice",
        "discount",
        "otherCosts",
        "finalPrice",
      ],
      transaction,
    };

    if (
      lockOrder &&
      transaction
    ) {
      orderOptions.lock =
        transaction.LOCK
          .UPDATE;
    }

    const order =
      await Order.findByPk(
        orderId,
        orderOptions
      );

    if (!order) {
      return null;
    }

    const movements =
      await StockMovement
        .findAll({
          where: {
            orderId,
            type: {
              [Op.in]: [
                "issue",
                "return",
              ],
            },
          },
          include: [
            {
              model:
                InventoryItem,
              as:
                "inventoryItem",
              attributes: [
                "id",
                "sku",
                "name",
                "purchasePrice",
                "salePrice",
                "currentQuantity",
              ],
            },
          ],
          order: [
            [
              "createdAt",
              "ASC",
            ],
            [
              "id",
              "ASC",
            ],
          ],
          transaction,
        });

    return {
      order,
      movements,
    };
  };

const buildFinanceResponse =
  (
    data,
    {
      includeInternal =
        false,
      canEdit = false,
    } = {}
  ) => {
    const {
      order,
      movements,
    } = data;

    const grouped =
      new Map();

    let partsSaleTotal = 0;
    let partsCostTotal = 0;

    for (
      const movement of
      movements
    ) {
      const item =
        movement
          .inventoryItem;

      if (!item) {
        continue;
      }

      const quantityDelta =
        -Number(
          movement
            .quantityChange
        );

      const unitPrice =
        movementPrice(
          movement,
          "unitPrice",
          "salePrice"
        );

      const unitCost =
        movementPrice(
          movement,
          "unitCost",
          "purchasePrice"
        );

      const saleDelta =
        money(
          quantityDelta *
            unitPrice
        );

      const costDelta =
        money(
          quantityDelta *
            unitCost
        );

      const current =
        grouped.get(
          item.id
        ) ?? {
          inventoryItemId:
            item.id,
          sku:
            item.sku,
          name:
            item.name,
          currentQuantity:
            item.currentQuantity,
          quantity: 0,
          saleTotal: 0,
          costTotal: 0,
        };

      current.quantity +=
        quantityDelta;

      current.saleTotal =
        money(
          current.saleTotal +
            saleDelta
        );

      current.costTotal =
        money(
          current.costTotal +
            costDelta
        );

      grouped.set(
        item.id,
        current
      );

      partsSaleTotal =
        money(
          partsSaleTotal +
            saleDelta
        );

      partsCostTotal =
        money(
          partsCostTotal +
            costDelta
        );
    }

    const parts =
      Array.from(
        grouped.values()
      )
        .filter(
          (
            part
          ) =>
            part.quantity >
              0
        )
        .map(
          (
            part
          ) => {
            const publicPart = {
              inventoryItemId:
                part
                  .inventoryItemId,
              sku:
                part.sku,
              name:
                part.name,
              quantity:
                part.quantity,
              unitPrice:
                part.quantity >
                0
                  ? money(
                      part
                        .saleTotal /
                        part
                          .quantity
                    )
                  : 0,
              saleTotal:
                money(
                  part.saleTotal
                ),
              currentQuantity:
                part
                  .currentQuantity,
            };

            if (
              includeInternal
            ) {
              publicPart.unitCost =
                part.quantity >
                0
                  ? money(
                      part
                        .costTotal /
                        part
                          .quantity
                    )
                  : 0;

              publicPart.costTotal =
                money(
                  part.costTotal
                );
            }

            return publicPart;
          }
        )
        .sort(
          (
            left,
            right
          ) =>
            left.name.localeCompare(
              right.name
            )
        );

    const finalPrice =
      money(
        order.finalPrice
      );

    const discount =
      money(
        order.discount
      );

    const otherCosts =
      money(
        order.otherCosts
      );

    /*
     * The final price is the agreed
     * total for the customer.
     * Used parts are included in it,
     * not added on top of it.
     */
    const subtotal =
      money(
        finalPrice +
          discount
      );

    const laborPrice =
      money(
        Math.max(
          subtotal -
            partsSaleTotal,
          0
        )
      );

    const customerTotal =
      finalPrice;

    const summary = {
      laborPrice,
      partsSaleTotal:
        money(
          partsSaleTotal
        ),
      discount,
      subtotal,
      customerTotal,
      finalPrice:
        money(
          order.finalPrice
        ),
    };

    if (
      includeInternal
    ) {
      const grossProfit =
        money(
          customerTotal -
            partsCostTotal -
            otherCosts
        );

      summary.partsCostTotal =
        money(
          partsCostTotal
        );

      summary.otherCosts =
        otherCosts;

      summary.grossProfit =
        grossProfit;

      summary.marginPercent =
        customerTotal > 0
          ? money(
              (
                grossProfit /
                customerTotal
              ) * 100
            )
          : 0;
    }

    return {
      orderId:
        order.id,
      status:
        order.status,
      deliveredAt:
        order.deliveredAt,
      canEdit,
      internalVisible:
        includeInternal,
      summary,
      parts,
    };
  };

const getOrderFinance =
  async (
    orderId,
    {
      transaction = null,
      lockOrder = false,
      includeInternal =
        false,
      canEdit = false,
    } = {}
  ) => {
    const data =
      await loadFinanceData(
        orderId,
        {
          transaction,
          lockOrder,
        }
      );

    if (!data) {
      return null;
    }

    return buildFinanceResponse(
      data,
      {
        includeInternal,
        canEdit,
      }
    );
  };

const recalculateOrderFinalPrice =
  async (
    orderId,
    transaction
  ) => {
    const finance =
      await getOrderFinance(
        orderId,
        {
          transaction,
          lockOrder: true,
          includeInternal:
            true,
          canEdit: true,
        }
      );

    if (!finance) {
      return null;
    }

    /*
     * Inventory movements only
     * redistribute the fixed total
     * between parts and labor.
     * They must never increase the
     * agreed final customer price.
     */
    await Order.update(
      {
        laborPrice:
          finance.summary
            .laborPrice,
      },
      {
        where: {
          id: orderId,
        },
        transaction,
      }
    );

    return finance;
  };

module.exports = {
  getOrderFinance,
  money,
  recalculateOrderFinalPrice,
};
