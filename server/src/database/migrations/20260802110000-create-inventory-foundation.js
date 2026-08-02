"use strict";

module.exports = {
  async up(
    queryInterface,
    Sequelize
  ) {
    await queryInterface
      .sequelize
      .transaction(
        async (
          transaction
        ) => {
          await queryInterface.createTable(
            "inventory_items",
            {
              id: {
                type:
                  Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
              },

              sku: {
                type:
                  Sequelize.STRING(
                    100
                  ),
                allowNull: false,
                unique: true,
              },

              supplierSku: {
                type:
                  Sequelize.STRING(
                    120
                  ),
                allowNull: true,
                unique: true,
              },

              barcode: {
                type:
                  Sequelize.STRING(
                    120
                  ),
                allowNull: true,
                unique: true,
              },

              name: {
                type:
                  Sequelize.STRING(
                    200
                  ),
                allowNull: false,
              },

              category: {
                type:
                  Sequelize.STRING(
                    120
                  ),
                allowNull: false,
              },

              brand: {
                type:
                  Sequelize.STRING(
                    120
                  ),
                allowNull: true,
              },

              compatibility: {
                type:
                  Sequelize.TEXT,
                allowNull: true,
              },

              purchasePrice: {
                type:
                  Sequelize.DECIMAL(
                    12,
                    2
                  ),
                allowNull: false,
                defaultValue: 0,
              },

              salePrice: {
                type:
                  Sequelize.DECIMAL(
                    12,
                    2
                  ),
                allowNull: false,
                defaultValue: 0,
              },

              currentQuantity: {
                type:
                  Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
              },

              minStock: {
                type:
                  Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
              },

              supplier: {
                type:
                  Sequelize.STRING(
                    200
                  ),
                allowNull: true,
              },

              location: {
                type:
                  Sequelize.STRING(
                    200
                  ),
                allowNull: true,
              },

              note: {
                type:
                  Sequelize.TEXT,
                allowNull: true,
              },

              isActive: {
                type:
                  Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
              },

              createdAt: {
                type:
                  Sequelize.DATE,
                allowNull: false,
                defaultValue:
                  Sequelize.fn(
                    "NOW"
                  ),
              },

              updatedAt: {
                type:
                  Sequelize.DATE,
                allowNull: false,
                defaultValue:
                  Sequelize.fn(
                    "NOW"
                  ),
              },
            },
            {
              transaction,
            }
          );

          await queryInterface.addIndex(
            "inventory_items",
            ["name"],
            {
              name:
                "inventory_items_name_idx",
              transaction,
            }
          );

          await queryInterface.addIndex(
            "inventory_items",
            ["category"],
            {
              name:
                "inventory_items_category_idx",
              transaction,
            }
          );

          await queryInterface.addIndex(
            "inventory_items",
            [
              "currentQuantity",
              "minStock",
            ],
            {
              name:
                "inventory_items_stock_idx",
              transaction,
            }
          );

          await queryInterface.createTable(
            "stock_movements",
            {
              id: {
                type:
                  Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
              },

              inventoryItemId: {
                type:
                  Sequelize.INTEGER,
                allowNull: false,
                references: {
                  model:
                    "inventory_items",
                  key: "id",
                },
                onUpdate:
                  "CASCADE",
                onDelete:
                  "RESTRICT",
              },

              type: {
                type:
                  Sequelize.ENUM(
                    "receipt",
                    "issue",
                    "return",
                    "adjustment"
                  ),
                allowNull: false,
              },

              quantityChange: {
                type:
                  Sequelize.INTEGER,
                allowNull: false,
              },

              balanceBefore: {
                type:
                  Sequelize.INTEGER,
                allowNull: false,
              },

              balanceAfter: {
                type:
                  Sequelize.INTEGER,
                allowNull: false,
              },

              unitCost: {
                type:
                  Sequelize.DECIMAL(
                    12,
                    2
                  ),
                allowNull: true,
              },

              orderId: {
                type:
                  Sequelize.INTEGER,
                allowNull: true,
                references: {
                  model: "orders",
                  key: "id",
                },
                onUpdate:
                  "CASCADE",
                onDelete:
                  "SET NULL",
              },

              userId: {
                type:
                  Sequelize.INTEGER,
                allowNull: false,
                references: {
                  model: "users",
                  key: "id",
                },
                onUpdate:
                  "CASCADE",
                onDelete:
                  "RESTRICT",
              },

              note: {
                type:
                  Sequelize.TEXT,
                allowNull: true,
              },

              createdAt: {
                type:
                  Sequelize.DATE,
                allowNull: false,
                defaultValue:
                  Sequelize.fn(
                    "NOW"
                  ),
              },

              updatedAt: {
                type:
                  Sequelize.DATE,
                allowNull: false,
                defaultValue:
                  Sequelize.fn(
                    "NOW"
                  ),
              },
            },
            {
              transaction,
            }
          );

          await queryInterface.addIndex(
            "stock_movements",
            [
              "inventoryItemId",
              "createdAt",
            ],
            {
              name:
                "stock_movements_item_date_idx",
              transaction,
            }
          );

          await queryInterface.addIndex(
            "stock_movements",
            ["orderId"],
            {
              name:
                "stock_movements_order_idx",
              transaction,
            }
          );

          await queryInterface.addIndex(
            "stock_movements",
            ["userId"],
            {
              name:
                "stock_movements_user_idx",
              transaction,
            }
          );
        }
      );
  },

  async down(
    queryInterface
  ) {
    await queryInterface
      .sequelize
      .transaction(
        async (
          transaction
        ) => {
          await queryInterface.dropTable(
            "stock_movements",
            {
              transaction,
            }
          );

          await queryInterface.dropTable(
            "inventory_items",
            {
              transaction,
            }
          );

          await queryInterface
            .sequelize
            .query(
              'DROP TYPE IF EXISTS "enum_stock_movements_type";',
              {
                transaction,
              }
            );
        }
      );
  },
};
