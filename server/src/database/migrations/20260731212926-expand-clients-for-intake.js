"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction =
      await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn(
        "clients",
        "phoneNormalized",
        {
          type: Sequelize.STRING(32),
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "clients",
        "secondaryPhone",
        {
          type: Sequelize.STRING(32),
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "clients",
        "address",
        {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.addColumn(
        "clients",
        "note",
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.changeColumn(
        "clients",
        "email",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        {
          transaction,
        }
      );

      await queryInterface.sequelize.query(
        `
          UPDATE "clients"
          SET "email" = NULL
          WHERE BTRIM(COALESCE("email", '')) = '';
        `,
        {
          transaction,
        }
      );

      await queryInterface.sequelize.query(
        `
          WITH prepared_phones AS (
            SELECT
              id,
              regexp_replace(
                COALESCE(phone, ''),
                '[^0-9]',
                '',
                'g'
              ) AS digits
            FROM clients
          ),
          normalized_phones AS (
            SELECT
              id,
              CASE
                WHEN digits LIKE '00%'
                  THEN substring(digits FROM 3)
                WHEN char_length(digits) = 9
                  THEN '420' || digits
                ELSE digits
              END AS normalized_phone
            FROM prepared_phones
          )
          UPDATE clients AS client
          SET "phoneNormalized" =
            normalized.normalized_phone
          FROM normalized_phones AS normalized
          WHERE client.id = normalized.id;
        `,
        {
          transaction,
        }
      );

      const [invalidPhones] =
        await queryInterface.sequelize.query(
          `
            SELECT id, phone
            FROM clients
            WHERE
              "phoneNormalized" IS NULL
              OR "phoneNormalized" = '';
          `,
          {
            transaction,
          }
        );

      if (invalidPhones.length > 0) {
        throw new Error(
          `Clients with invalid phone numbers: ${JSON.stringify(
            invalidPhones
          )}`
        );
      }

      const [duplicatePhones] =
        await queryInterface.sequelize.query(
          `
            SELECT
              "phoneNormalized",
              COUNT(*)::integer AS "count",
              ARRAY_AGG(id ORDER BY id) AS "clientIds"
            FROM clients
            GROUP BY "phoneNormalized"
            HAVING COUNT(*) > 1;
          `,
          {
            transaction,
          }
        );

      if (duplicatePhones.length > 0) {
        throw new Error(
          `Duplicate normalized phone numbers found: ${JSON.stringify(
            duplicatePhones
          )}`
        );
      }

      await queryInterface.changeColumn(
        "clients",
        "phoneNormalized",
        {
          type: Sequelize.STRING(32),
          allowNull: false,
        },
        {
          transaction,
        }
      );

      await queryInterface.addIndex(
        "clients",
        ["phoneNormalized"],
        {
          name: "clients_phone_normalized_unique",
          unique: true,
          transaction,
        }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction =
      await queryInterface.sequelize.transaction();

    try {
      const [clientsWithoutEmail] =
        await queryInterface.sequelize.query(
          `
            SELECT COUNT(*)::integer AS "count"
            FROM clients
            WHERE email IS NULL;
          `,
          {
            transaction,
          }
        );

      if (
        Number(clientsWithoutEmail[0].count) > 0
      ) {
        throw new Error(
          "Cannot revert client migration while clients without email exist."
        );
      }

      await queryInterface.removeIndex(
        "clients",
        "clients_phone_normalized_unique",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "clients",
        "phoneNormalized",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "clients",
        "secondaryPhone",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "clients",
        "address",
        {
          transaction,
        }
      );

      await queryInterface.removeColumn(
        "clients",
        "note",
        {
          transaction,
        }
      );

      await queryInterface.changeColumn(
        "clients",
        "email",
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
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