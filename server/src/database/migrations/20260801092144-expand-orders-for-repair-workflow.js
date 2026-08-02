"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction =
      await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn(
        "orders",
        "deviceCondition",
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "orders",
        "accessories",
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "orders",
        "accessType",
        {
          type: Sequelize.STRING(20),
          allowNull: false,
          defaultValue: "none",
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "orders",
        "accessCodeEncrypted",
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "orders",
        "diagnosis",
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "orders",
        "workPerformed",
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "orders",
        "internalNote",
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "orders",
        "estimatedPrice",
        {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "orders",
        "finalPrice",
        {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "orders",
        "receivedAt",
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "orders",
        "dueAt",
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "orders",
        "completedAt",
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "orders",
        "deliveredAt",
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.sequelize.query(
        `
          UPDATE orders
          SET
            "receivedAt" = "createdAt",
            "estimatedPrice" =
              CASE
                WHEN price IS NULL THEN NULL
                ELSE ROUND(
                  CAST(price AS numeric),
                  2
                )
              END;
        `,
        {
          transaction,
        }
      );

      await queryInterface.changeColumn(
        "orders",
        "receivedAt",
        {
          type: Sequelize.DATE,
          allowNull: false,

          defaultValue:
            Sequelize.literal(
              "CURRENT_TIMESTAMP"
            ),
        },
        {
          transaction,
        }
      );

      await queryInterface.addIndex(
        "orders",
        ["status", "createdAt"],
        {
          name:
            "orders_status_created_at_idx",
          transaction,
        }
      );

      await queryInterface.addIndex(
        "orders",
        ["clientId", "createdAt"],
        {
          name:
            "orders_client_created_at_idx",
          transaction,
        }
      );

      await queryInterface.addIndex(
        "orders",
        ["deviceId", "createdAt"],
        {
          name:
            "orders_device_created_at_idx",
          transaction,
        }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  },

  async down(queryInterface) {
    const transaction =
      await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeIndex(
        "orders",
        "orders_status_created_at_idx",
        {
          transaction,
        }
      );

      await queryInterface.removeIndex(
        "orders",
        "orders_client_created_at_idx",
        {
          transaction,
        }
      );

      await queryInterface.removeIndex(
        "orders",
        "orders_device_created_at_idx",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "deliveredAt",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "completedAt",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "dueAt",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "receivedAt",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "finalPrice",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "estimatedPrice",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "internalNote",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "workPerformed",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "diagnosis",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "accessCodeEncrypted",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "accessType",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "accessories",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "orders",
        "deviceCondition",
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