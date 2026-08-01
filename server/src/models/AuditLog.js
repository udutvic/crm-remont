const {
  DataTypes,
} = require(
  "sequelize"
);

const sequelize = require(
  "../config/database"
);

const User = require(
  "./User"
);

const AuditLog =
  sequelize.define(
    "AuditLog",
    {
      id: {
        type:
          DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type:
          DataTypes.INTEGER,
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

      action: {
        type:
          DataTypes.STRING(
            100
          ),
        allowNull: false,
      },

      entityType: {
        type:
          DataTypes.STRING(
            64
          ),
        allowNull: true,
      },

      entityId: {
        type:
          DataTypes.STRING(
            64
          ),
        allowNull: true,
      },

      method: {
        type:
          DataTypes.STRING(
            10
          ),
        allowNull: false,
      },

      path: {
        type:
          DataTypes.STRING(
            500
          ),
        allowNull: false,
      },

      statusCode: {
        type:
          DataTypes.INTEGER,
        allowNull: false,
      },

      ipAddress: {
        type:
          DataTypes.STRING(
            64
          ),
        allowNull: true,
      },

      userAgent: {
        type:
          DataTypes.STRING(
            512
          ),
        allowNull: true,
      },

      metadata: {
        type:
          DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName:
        "audit_logs",
      timestamps: true,

      indexes: [
        {
          fields: [
            "userId",
          ],
        },
        {
          fields: [
            "action",
          ],
        },
        {
          fields: [
            "entityType",
            "entityId",
          ],
        },
        {
          fields: [
            "createdAt",
          ],
        },
      ],
    }
  );

AuditLog.belongsTo(
  User,
  {
    as: "user",
    foreignKey:
      "userId",
  }
);

User.hasMany(
  AuditLog,
  {
    as: "auditLogs",
    foreignKey:
      "userId",
  }
);

module.exports =
  AuditLog;
