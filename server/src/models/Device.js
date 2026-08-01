const { DataTypes } = require(
  "sequelize"
);

const sequelize = require(
  "../config/database"
);
const normalizeDeviceIdentifier =
  require(
    "../utils/normalizeDeviceIdentifier"
  );

const Client = require("./Client");

const DEVICE_TYPES = [
  "phone",
  "tablet",
  "laptop",
  "smartwatch",
  "other",
];

const normalizeRequiredText = (
  value
) => String(value ?? "").trim();

const normalizeOptionalText = (
  value
) => {
  const normalized = String(
    value ?? ""
  ).trim();

  return normalized || null;
};

const normalizeDeviceValues = (
  values
) => {
  if (values.deviceType !== undefined) {
    values.deviceType = String(
      values.deviceType ?? "phone"
    )
      .trim()
      .toLowerCase();
  }

  if (values.brand !== undefined) {
    values.brand = normalizeRequiredText(
      values.brand
    );
  }

  if (values.model !== undefined) {
    values.model = normalizeRequiredText(
      values.model
    );
  }

  if (values.imei1 !== undefined) {
    values.imei1 = normalizeOptionalText(
      values.imei1
    );

    values.imei1Normalized =
      normalizeDeviceIdentifier(
        values.imei1
      );
  }

  if (values.imei2 !== undefined) {
    values.imei2 = normalizeOptionalText(
      values.imei2
    );

    values.imei2Normalized =
      normalizeDeviceIdentifier(
        values.imei2
      );
  }

  if (values.serial !== undefined) {
    values.serial = normalizeOptionalText(
      values.serial
    );

    values.serialNormalized =
      normalizeDeviceIdentifier(
        values.serial
      );
  }

  if (values.color !== undefined) {
    values.color = normalizeOptionalText(
      values.color
    );
  }
};

const includeBulkField = (
  options,
  fieldName
) => {
  if (
    options.attributes[fieldName] !==
      undefined &&
    Array.isArray(options.fields) &&
    !options.fields.includes(fieldName)
  ) {
    options.fields.push(fieldName);
  }
};

const Device = sequelize.define(
  "Device",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "clients",
        key: "id",
      },
    },

    deviceType: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "phone",

      validate: {
        isIn: [DEVICE_TYPES],
      },
    },

    brand: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notEmpty: true,
      },
    },

    model: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notEmpty: true,
      },
    },

    imei1: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },

    imei1Normalized: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },

    imei2: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },

    imei2Normalized: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },

    serial: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    serialNormalized: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    color: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
  },
  {
    tableName: "devices",
    timestamps: true,

    hooks: {
      beforeValidate(device) {
        normalizeDeviceValues(device);
      },

      beforeBulkUpdate(options) {
        normalizeDeviceValues(
          options.attributes
        );

        includeBulkField(
          options,
          "imei1Normalized"
        );

        includeBulkField(
          options,
          "imei2Normalized"
        );

        includeBulkField(
          options,
          "serialNormalized"
        );
      },
    },
  }
);

Device.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});

Client.hasMany(Device, {
  foreignKey: "clientId",
  as: "devices",
});

module.exports = Device;
