const {
  DataTypes,
} = require(
  "sequelize"
);

const sequelize = require(
  "../config/database"
);

const USER_ROLES = [
  "admin",
  "technician",
];

const normalizeEmail = (
  value
) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const normalizeName = (
  value
) =>
  String(value ?? "")
    .trim();

const User = sequelize.define(
  "User",
  {
    id: {
      type:
        DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    email: {
      type:
        DataTypes.STRING(254),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },

    name: {
      type:
        DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 120],
      },
    },

    role: {
      type:
        DataTypes.ENUM(
          ...USER_ROLES
        ),
      allowNull: false,
      defaultValue:
        "technician",
    },

    passwordHash: {
      type:
        DataTypes.TEXT,
      allowNull: false,
    },

    isActive: {
      type:
        DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    lastLoginAt: {
      type:
        DataTypes.DATE,
      allowNull: true,
    },

    passwordChangedAt: {
      type:
        DataTypes.DATE,
      allowNull: false,
      defaultValue:
        DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: true,

    defaultScope: {
      attributes: {
        exclude: [
          "passwordHash",
        ],
      },
    },

    scopes: {
      withPassword: {
        attributes: {
          include: [
            "passwordHash",
          ],
        },
      },
    },

    hooks: {
      beforeValidate(
        user
      ) {
        if (
          user.email !==
          undefined
        ) {
          user.email =
            normalizeEmail(
              user.email
            );
        }

        if (
          user.name !==
          undefined
        ) {
          user.name =
            normalizeName(
              user.name
            );
        }

        if (
          user.role !==
          undefined
        ) {
          user.role =
            String(
              user.role
            )
              .trim()
              .toLowerCase();
        }
      },
    },
  }
);

User.USER_ROLES =
  USER_ROLES;

module.exports = User;
