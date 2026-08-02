"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `
        ALTER TYPE "enum_orders_status"
        ADD VALUE IF NOT EXISTS 'unrepairable';
      `
    );
  },

  async down(queryInterface) {
    const sequelize =
      queryInterface.sequelize;

    await sequelize.transaction(
      async (transaction) => {
        await sequelize.query(
          `
            UPDATE "orders"
            SET "status" = 'cancelled'
            WHERE "status" = 'unrepairable';
          `,
          {
            transaction,
          }
        );

        await sequelize.query(
          `
            ALTER TABLE "orders"
            ALTER COLUMN "status"
            DROP DEFAULT;
          `,
          {
            transaction,
          }
        );

        await sequelize.query(
          `
            ALTER TYPE "enum_orders_status"
            RENAME TO "enum_orders_status_old";
          `,
          {
            transaction,
          }
        );

        await sequelize.query(
          `
            CREATE TYPE "enum_orders_status"
            AS ENUM (
              'pending',
              'in_progress',
              'completed',
              'cancelled'
            );
          `,
          {
            transaction,
          }
        );

        await sequelize.query(
          `
            ALTER TABLE "orders"
            ALTER COLUMN "status"
            TYPE "enum_orders_status"
            USING (
              "status"::text::"enum_orders_status"
            );
          `,
          {
            transaction,
          }
        );

        await sequelize.query(
          `
            ALTER TABLE "orders"
            ALTER COLUMN "status"
            SET DEFAULT 'pending';
          `,
          {
            transaction,
          }
        );

        await sequelize.query(
          `
            DROP TYPE "enum_orders_status_old";
          `,
          {
            transaction,
          }
        );
      }
    );
  },
};
