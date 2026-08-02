"use strict";

module.exports = {
  async up(
    queryInterface,
    Sequelize
  ) {
    await queryInterface.sequelize.transaction(
      async (
        transaction
      ) => {
        await queryInterface.createTable(
          "users",
          {
            id: {
              type:
                Sequelize.INTEGER,
              autoIncrement:
                true,
              primaryKey:
                true,
              allowNull:
                false,
            },

            email: {
              type:
                Sequelize.STRING(
                  254
                ),
              allowNull:
                false,
              unique: true,
            },

            name: {
              type:
                Sequelize.STRING(
                  120
                ),
              allowNull:
                false,
            },

            role: {
              type:
                Sequelize.ENUM(
                  "admin",
                  "technician"
                ),
              allowNull:
                false,
              defaultValue:
                "technician",
            },

            passwordHash: {
              type:
                Sequelize.TEXT,
              allowNull:
                false,
            },

            isActive: {
              type:
                Sequelize.BOOLEAN,
              allowNull:
                false,
              defaultValue:
                true,
            },

            lastLoginAt: {
              type:
                Sequelize.DATE,
              allowNull:
                true,
            },

            passwordChangedAt:
              {
                type:
                  Sequelize.DATE,
                allowNull:
                  false,
                defaultValue:
                  Sequelize.fn(
                    "NOW"
                  ),
              },

            createdAt: {
              type:
                Sequelize.DATE,
              allowNull:
                false,
              defaultValue:
                Sequelize.fn(
                  "NOW"
                ),
            },

            updatedAt: {
              type:
                Sequelize.DATE,
              allowNull:
                false,
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

        await queryInterface.createTable(
          "auth_sessions",
          {
            id: {
              type:
                Sequelize.BIGINT,
              autoIncrement:
                true,
              primaryKey:
                true,
              allowNull:
                false,
            },

            userId: {
              type:
                Sequelize.INTEGER,
              allowNull:
                false,
              references: {
                model:
                  "users",
                key: "id",
              },
              onUpdate:
                "CASCADE",
              onDelete:
                "CASCADE",
            },

            tokenHash: {
              type:
                Sequelize.STRING(
                  64
                ),
              allowNull:
                false,
              unique: true,
            },

            expiresAt: {
              type:
                Sequelize.DATE,
              allowNull:
                false,
            },

            lastUsedAt: {
              type:
                Sequelize.DATE,
              allowNull:
                false,
              defaultValue:
                Sequelize.fn(
                  "NOW"
                ),
            },

            revokedAt: {
              type:
                Sequelize.DATE,
              allowNull:
                true,
            },

            userAgent: {
              type:
                Sequelize.STRING(
                  512
                ),
              allowNull:
                true,
            },

            ipAddress: {
              type:
                Sequelize.STRING(
                  64
                ),
              allowNull:
                true,
            },

            createdAt: {
              type:
                Sequelize.DATE,
              allowNull:
                false,
              defaultValue:
                Sequelize.fn(
                  "NOW"
                ),
            },

            updatedAt: {
              type:
                Sequelize.DATE,
              allowNull:
                false,
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
          "auth_sessions",
          [
            "userId",
          ],
          {
            name:
              "auth_sessions_user_id_index",
            transaction,
          }
        );

        await queryInterface.addIndex(
          "auth_sessions",
          [
            "expiresAt",
          ],
          {
            name:
              "auth_sessions_expires_at_index",
            transaction,
          }
        );

        await queryInterface.addIndex(
          "auth_sessions",
          [
            "revokedAt",
          ],
          {
            name:
              "auth_sessions_revoked_at_index",
            transaction,
          }
        );
      }
    );
  },

  async down(
    queryInterface
  ) {
    await queryInterface.sequelize.transaction(
      async (
        transaction
      ) => {
        await queryInterface.dropTable(
          "auth_sessions",
          {
            transaction,
          }
        );

        await queryInterface.dropTable(
          "users",
          {
            transaction,
          }
        );
      }
    );

    await queryInterface.sequelize.query(
      `
        DROP TYPE IF EXISTS "enum_users_role";
      `
    );
  },
};
