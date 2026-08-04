"use strict";

module.exports = {
  async up(
    queryInterface
  ) {
    await queryInterface.sequelize.query(
      `
        UPDATE auth_sessions
        SET
          "revokedAt" = NOW(),
          "updatedAt" = NOW()
        WHERE "revokedAt" IS NULL;
      `
    );
  },

  async down() {
    throw new Error(
      "Revoked authentication sessions cannot be restored safely."
    );
  },
};
