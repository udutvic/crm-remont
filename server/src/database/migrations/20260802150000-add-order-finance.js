"use strict";

module.exports = {
  async up(
    queryInterface,
    Sequelize
  ) {
    const transaction =
      await queryInterface
        .sequelize
        .transaction();

    try {
      await queryInterface
        .addColumn(
          "stock_movements",
          "unitPrice",
          {
            type:
              Sequelize.DECIMAL(
                12,
                2
              ),
            allowNull: true,
          },
          {
            transaction,
          }
        );

      for (
        const column of
        [
          "laborPrice",
          "discount",
          "otherCosts",
        ]
      ) {
        await queryInterface
          .addColumn(
            "orders",
            column,
            {
              type:
                Sequelize.DECIMAL(
                  12,
                  2
                ),
              allowNull: false,
              defaultValue: 0,
            },
            {
              transaction,
            }
          );
      }

      await queryInterface
        .sequelize
        .query(
          `
            UPDATE stock_movements AS movement
            SET "unitPrice" =
              COALESCE(
                item."salePrice",
                movement."unitCost",
                0
              )
            FROM inventory_items AS item
            WHERE
              movement."inventoryItemId" =
                item.id
              AND movement.type IN (
                'issue',
                'return'
              )
              AND movement."unitPrice"
                IS NULL;
          `,
          {
            transaction,
          }
        );

      await queryInterface
        .sequelize
        .query(
          `
            UPDATE orders AS current_order
            SET "laborPrice" =
              GREATEST(
                COALESCE(
                  current_order."finalPrice",
                  current_order."estimatedPrice",
                  CAST(
                    current_order.price
                    AS numeric
                  ),
                  0
                ) -
                COALESCE(
                  (
                    SELECT
                      SUM(
                        -movement."quantityChange" *
                        COALESCE(
                          movement."unitPrice",
                          0
                        )
                      )
                    FROM stock_movements
                      AS movement
                    WHERE
                      movement."orderId" =
                        current_order.id
                      AND movement.type IN (
                        'issue',
                        'return'
                      )
                  ),
                  0
                ),
                0
              );
          `,
          {
            transaction,
          }
        );

      await queryInterface
        .sequelize
        .query(
          `
            UPDATE orders AS current_order
            SET "finalPrice" =
              ROUND(
                current_order."laborPrice" +
                COALESCE(
                  (
                    SELECT
                      SUM(
                        -movement."quantityChange" *
                        COALESCE(
                          movement."unitPrice",
                          0
                        )
                      )
                    FROM stock_movements
                      AS movement
                    WHERE
                      movement."orderId" =
                        current_order.id
                      AND movement.type IN (
                        'issue',
                        'return'
                      )
                  ),
                  0
                ) -
                current_order.discount,
                2
              );
          `,
          {
            transaction,
          }
        );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(
    queryInterface
  ) {
    const transaction =
      await queryInterface
        .sequelize
        .transaction();

    try {
      for (
        const column of
        [
          "otherCosts",
          "discount",
          "laborPrice",
        ]
      ) {
        await queryInterface
          .removeColumn(
            "orders",
            column,
            {
              transaction,
            }
          );
      }

      await queryInterface
        .removeColumn(
          "stock_movements",
          "unitPrice",
          {
            transaction,
          }
        );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
