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
          "orders",
          "archivedAt",
          {
            type:
              Sequelize.DATE,
            allowNull: true,
          },
          {
            transaction,
          }
        );

      await queryInterface
        .addColumn(
          "orders",
          "archivedBy",
          {
            type:
              Sequelize.INTEGER,
            allowNull: true,

            references: {
              model: "users",
              key: "id",
            },

            onUpdate:
              "CASCADE",

            onDelete:
              "SET NULL",
          },
          {
            transaction,
          }
        );

      await queryInterface
        .addColumn(
          "orders",
          "archiveReason",
          {
            type:
              Sequelize.STRING(
                500
              ),
            allowNull: true,
          },
          {
            transaction,
          }
        );

      await queryInterface
        .addIndex(
          "orders",
          [
            "archivedAt",
            "id",
          ],
          {
            name:
              "orders_archived_at_id_idx",
            transaction,
          }
        );

      await queryInterface
        .addIndex(
          "orders",
          [
            "archivedBy",
          ],
          {
            name:
              "orders_archived_by_idx",
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
        .removeIndex(
          "orders",
          "orders_archived_by_idx",
          {
            transaction,
          }
        );

      await queryInterface
        .removeIndex(
          "orders",
          "orders_archived_at_id_idx",
          {
            transaction,
          }
        );

      await queryInterface
        .removeColumn(
          "orders",
          "archiveReason",
          {
            transaction,
          }
        );

      await queryInterface
        .removeColumn(
          "orders",
          "archivedBy",
          {
            transaction,
          }
        );

      await queryInterface
        .removeColumn(
          "orders",
          "archivedAt",
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
