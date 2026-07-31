const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");
const normalizePhone = require(
  "../utils/normalizePhone"
);

const normalizeRequiredText = (value) =>
  String(value ?? "").trim();

const normalizeOptionalText = (value) => {
  const normalized = String(value ?? "").trim();

  return normalized.length > 0
    ? normalized
    : null;
};

const normalizeEmail = (value) => {
  const normalized = normalizeOptionalText(value);

  return normalized
    ? normalized.toLowerCase()
    : null;
};

const normalizeClientValues = (values) => {
  if (values.name !== undefined) {
    values.name = normalizeRequiredText(
      values.name
    );
  }

  if (values.phone !== undefined) {
    values.phone = normalizeRequiredText(
      values.phone
    );

    values.phoneNormalized = normalizePhone(
      values.phone
    );
  }

  if (values.email !== undefined) {
    values.email = normalizeEmail(values.email);
  }

  if (values.secondaryPhone !== undefined) {
    values.secondaryPhone =
      normalizeOptionalText(
        values.secondaryPhone
      );
  }

  if (values.address !== undefined) {
    values.address = normalizeOptionalText(
      values.address
    );
  }

  if (values.note !== undefined) {
    values.note = normalizeOptionalText(
      values.note
    );
  }
};

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },

    phoneNormalized: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },

    secondaryPhone: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "clients",
    timestamps: true,

    hooks: {
      beforeValidate(client) {
        normalizeClientValues(client);
      },

      beforeBulkUpdate(options) {
        normalizeClientValues(
          options.attributes
        );

        if (
          options.attributes.phoneNormalized !==
            undefined &&
          Array.isArray(options.fields) &&
          !options.fields.includes(
            "phoneNormalized"
          )
        ) {
          options.fields.push(
            "phoneNormalized"
          );
        }
      },
    },
  }
);

module.exports = Client;