"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction =
      await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn(
        "devices",
        "deviceType",
        {
          type: Sequelize.STRING(40),
          allowNull: false,
          defaultValue: "phone",
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "devices",
        "imei1",
        {
          type: Sequelize.STRING(32),
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "devices",
        "imei1Normalized",
        {
          type: Sequelize.STRING(32),
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "devices",
        "imei2",
        {
          type: Sequelize.STRING(32),
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "devices",
        "imei2Normalized",
        {
          type: Sequelize.STRING(32),
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "devices",
        "serialNormalized",
        {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "devices",
        "color",
        {
          type: Sequelize.STRING(80),
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.sequelize.query(
        `
          UPDATE devices
          SET "serialNormalized" = NULLIF(
            UPPER(
              regexp_replace(
                COALESCE(serial, ''),
                '[^A-Za-z0-9]',
                '',
                'g'
              )
            ),
            ''
          );
        `,
        {
          transaction,
        }
      );

      await queryInterface.addIndex(
        "devices",
        ["imei1Normalized"],
        {
          name: "devices_imei1_normalized_idx",
          transaction,
        }
      );

      await queryInterface.addIndex(
        "devices",
        ["imei2Normalized"],
        {
          name: "devices_imei2_normalized_idx",
          transaction,
        }
      );

      await queryInterface.addIndex(
        "devices",
        ["serialNormalized"],
        {
          name: "devices_serial_normalized_idx",
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
        "devices",
        "devices_imei1_normalized_idx",
        {
          transaction,
        }
      );

      await queryInterface.removeIndex(
        "devices",
        "devices_imei2_normalized_idx",
        {
          transaction,
        }
      );

      await queryInterface.removeIndex(
        "devices",
        "devices_serial_normalized_idx",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "devices",
        "color",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "devices",
        "serialNormalized",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "devices",
        "imei2Normalized",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "devices",
        "imei2",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "devices",
        "imei1Normalized",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "devices",
        "imei1",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "devices",
        "deviceType",
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