"use strict";

module.exports = {
  async up(
    queryInterface,
    Sequelize
  ) {
    await queryInterface.createTable(
      "audit_logs",
      {
        id: {
          type:
            Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },

        userId: {
          type:
            Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },

        action: {
          type:
            Sequelize.STRING(100),
          allowNull: false,
        },

        entityType: {
          type:
            Sequelize.STRING(64),
          allowNull: true,
        },

        entityId: {
          type:
            Sequelize.STRING(64),
          allowNull: true,
        },

        method: {
          type:
            Sequelize.STRING(10),
          allowNull: false,
        },

        path: {
          type:
            Sequelize.STRING(500),
          allowNull: false,
        },

        statusCode: {
          type:
            Sequelize.INTEGER,
          allowNull: false,
        },

        ipAddress: {
          type:
            Sequelize.STRING(64),
          allowNull: true,
        },

        userAgent: {
          type:
            Sequelize.STRING(512),
          allowNull: true,
        },

        metadata: {
          type:
            Sequelize.JSON,
          allowNull: true,
        },

        createdAt: {
          type:
            Sequelize.DATE,
          allowNull: false,
          defaultValue:
            Sequelize.fn("NOW"),
        },

        updatedAt: {
          type:
            Sequelize.DATE,
          allowNull: false,
          defaultValue:
            Sequelize.fn("NOW"),
        },
      }
    );

    await queryInterface.addIndex(
      "audit_logs",
      ["userId"],
      {
        name:
          "audit_logs_user_id_index",
      }
    );

    await queryInterface.addIndex(
      "audit_logs",
      ["action"],
      {
        name:
          "audit_logs_action_index",
      }
    );

    await queryInterface.addIndex(
      "audit_logs",
      [
        "entityType",
        "entityId",
      ],
      {
        name:
          "audit_logs_entity_index",
      }
    );

    await queryInterface.addIndex(
      "audit_logs",
      ["createdAt"],
      {
        name:
          "audit_logs_created_at_index",
      }
    );
  },

  async down(
    queryInterface
  ) {
    await queryInterface.dropTable(
      "audit_logs"
    );
  },
};
