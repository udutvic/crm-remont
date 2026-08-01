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

const AuthSession =
  sequelize.define(
    "AuthSession",
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
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate:
          "CASCADE",
        onDelete:
          "CASCADE",
      },

      tokenHash: {
        type:
          DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },

      expiresAt: {
        type:
          DataTypes.DATE,
        allowNull: false,
      },

      lastUsedAt: {
        type:
          DataTypes.DATE,
        allowNull: false,
        defaultValue:
          DataTypes.NOW,
      },

      revokedAt: {
        type:
          DataTypes.DATE,
        allowNull: true,
      },

      userAgent: {
        type:
          DataTypes.STRING(512),
        allowNull: true,
      },

      ipAddress: {
        type:
          DataTypes.STRING(64),
        allowNull: true,
      },
    },
    {
      tableName:
        "auth_sessions",
      timestamps: true,

      indexes: [
        {
          fields: [
            "userId",
          ],
        },
        {
          fields: [
            "expiresAt",
          ],
        },
        {
          fields: [
            "revokedAt",
          ],
        },
      ],
    }
  );

AuthSession.belongsTo(
  User,
  {
    as: "user",
    foreignKey:
      "userId",
  }
);

User.hasMany(
  AuthSession,
  {
    as: "sessions",
    foreignKey:
      "userId",
  }
);

module.exports =
  AuthSession;
