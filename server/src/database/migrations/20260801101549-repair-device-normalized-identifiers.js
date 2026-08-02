"use strict";

module.exports = {
  async up(queryInterface) {
    const transaction =
      await queryInterface.sequelize.transaction();

    try {
      await queryInterface.sequelize.query(
        `
          UPDATE devices
          SET
            "imei1Normalized" = NULLIF(
              UPPER(
                REGEXP_REPLACE(
                  COALESCE("imei1", ''),
                  '[^a-zA-Z0-9]',
                  '',
                  'g'
                )
              ),
              ''
            ),

            "imei2Normalized" = NULLIF(
              UPPER(
                REGEXP_REPLACE(
                  COALESCE("imei2", ''),
                  '[^a-zA-Z0-9]',
                  '',
                  'g'
                )
              ),
              ''
            ),

            "serialNormalized" = NULLIF(
              UPPER(
                REGEXP_REPLACE(
                  COALESCE("serial", ''),
                  '[^a-zA-Z0-9]',
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

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  },

  async down() {
    /*
     * This migration repairs inconsistent
     * derived data. Restoring incorrect
     * values would be unsafe.
     */
  },
};