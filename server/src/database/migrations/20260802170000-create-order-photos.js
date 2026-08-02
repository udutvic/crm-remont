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
        .createTable(
          "order_photos",
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

            orderId: {
              type:
                Sequelize.INTEGER,
              allowNull:
                false,

              references: {
                model:
                  "orders",
                key: "id",
              },

              onUpdate:
                "CASCADE",
              onDelete:
                "CASCADE",
            },

            storagePath: {
              type:
                Sequelize.STRING(
                  500
                ),
              allowNull:
                false,
              unique: true,
            },

            category: {
              type:
                Sequelize.STRING(
                  20
                ),
              allowNull:
                false,
            },

            caption: {
              type:
                Sequelize.TEXT,
              allowNull:
                true,
            },

            originalName: {
              type:
                Sequelize.STRING(
                  255
                ),
              allowNull:
                false,
            },

            mimeType: {
              type:
                Sequelize.STRING(
                  100
                ),
              allowNull:
                false,
            },

            fileSize: {
              type:
                Sequelize.INTEGER,
              allowNull:
                false,
            },

            width: {
              type:
                Sequelize.INTEGER,
              allowNull:
                true,
            },

            height: {
              type:
                Sequelize.INTEGER,
              allowNull:
                true,
            },

            uploadedBy: {
              type:
                Sequelize.INTEGER,
              allowNull:
                true,

              references: {
                model:
                  "users",
                key: "id",
              },

              onUpdate:
                "CASCADE",
              onDelete:
                "SET NULL",
            },

            createdAt: {
              type:
                Sequelize.DATE,
              allowNull:
                false,
              defaultValue:
                Sequelize.literal(
                  "CURRENT_TIMESTAMP"
                ),
            },

            updatedAt: {
              type:
                Sequelize.DATE,
              allowNull:
                false,
              defaultValue:
                Sequelize.literal(
                  "CURRENT_TIMESTAMP"
                ),
            },
          },
          {
            transaction,
          }
        );

      await queryInterface
        .addConstraint(
          "order_photos",
          {
            fields: [
              "category",
            ],

            type: "check",

            name:
              "order_photos_category_check",

            where: {
              category: [
                "before",
                "during",
                "after",
              ],
            },

            transaction,
          }
        );

      await queryInterface
        .addIndex(
          "order_photos",
          [
            "orderId",
            "category",
            "createdAt",
          ],
          {
            name:
              "order_photos_order_category_created_idx",
            transaction,
          }
        );

      await queryInterface
        .addIndex(
          "order_photos",
          [
            "uploadedBy",
            "createdAt",
          ],
          {
            name:
              "order_photos_uploader_created_idx",
            transaction,
          }
        );

      await transaction
        .commit();
    } catch (error) {
      await transaction
        .rollback();

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
      await queryInterface
        .dropTable(
          "order_photos",
          {
            transaction,
          }
        );

      await transaction
        .commit();
    } catch (error) {
      await transaction
        .rollback();

      throw error;
    }
  },
};
