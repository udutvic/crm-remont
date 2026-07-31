"use strict";

const normalizeTableName = (table) => {
  if (typeof table === "string") {
    return table;
  }

  return table.tableName;
};

const assertRequiredColumns = async (
  queryInterface,
  tableName,
  requiredColumns,
  transaction
) => {
  const columns = await queryInterface.describeTable(
    tableName,
    {
      transaction,
    }
  );

  const missingColumns = requiredColumns.filter(
    (columnName) => !columns[columnName]
  );

  if (missingColumns.length > 0) {
    throw new Error(
      `Table "${tableName}" is missing required columns: ${missingColumns.join(", ")}`
    );
  }
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(
      async (transaction) => {
        const rawTables =
          await queryInterface.showAllTables({
            transaction,
          });

        const existingTables = new Set(
          rawTables.map(normalizeTableName)
        );

        if (!existingTables.has("clients")) {
          await queryInterface.createTable(
            "clients",
            {
              id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
              },

              name: {
                type: Sequelize.STRING,
                allowNull: false,
              },

              phone: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
              },

              email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
              },

              createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                  "CURRENT_TIMESTAMP"
                ),
              },

              updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                  "CURRENT_TIMESTAMP"
                ),
              },
            },
            {
              transaction,
            }
          );

          existingTables.add("clients");
        } else {
          await assertRequiredColumns(
            queryInterface,
            "clients",
            [
              "id",
              "name",
              "phone",
              "email",
              "createdAt",
              "updatedAt",
            ],
            transaction
          );
        }

        if (!existingTables.has("devices")) {
          await queryInterface.createTable(
            "devices",
            {
              id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
              },

              clientId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                  model: "clients",
                  key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
              },

              brand: {
                type: Sequelize.STRING,
                allowNull: false,
              },

              model: {
                type: Sequelize.STRING,
                allowNull: false,
              },

              serial: {
                type: Sequelize.STRING,
                allowNull: true,
              },

              createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                  "CURRENT_TIMESTAMP"
                ),
              },

              updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                  "CURRENT_TIMESTAMP"
                ),
              },
            },
            {
              transaction,
            }
          );

          existingTables.add("devices");
        } else {
          await assertRequiredColumns(
            queryInterface,
            "devices",
            [
              "id",
              "clientId",
              "brand",
              "model",
              "serial",
              "createdAt",
              "updatedAt",
            ],
            transaction
          );
        }

        if (!existingTables.has("orders")) {
          await queryInterface.createTable(
            "orders",
            {
              id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
              },

              clientId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                  model: "clients",
                  key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
              },

              deviceId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                  model: "devices",
                  key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
              },

              problem: {
                type: Sequelize.STRING,
                allowNull: false,
              },

              status: {
                type: Sequelize.ENUM(
                  "pending",
                  "in_progress",
                  "completed",
                  "cancelled"
                ),
                allowNull: false,
                defaultValue: "pending",
              },

              price: {
                type: Sequelize.FLOAT,
                allowNull: true,
              },

              createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                  "CURRENT_TIMESTAMP"
                ),
              },

              updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                  "CURRENT_TIMESTAMP"
                ),
              },
            },
            {
              transaction,
            }
          );

          existingTables.add("orders");
        } else {
          await assertRequiredColumns(
            queryInterface,
            "orders",
            [
              "id",
              "clientId",
              "deviceId",
              "problem",
              "status",
              "price",
              "createdAt",
              "updatedAt",
            ],
            transaction
          );
        }
      }
    );
  },

  async down() {
    throw new Error(
      "The baseline migration cannot be reverted because it may contain existing user data."
    );
  },
};