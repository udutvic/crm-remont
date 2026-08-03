const { DataTypes } = require(
  "sequelize"
);

const sequelize = require(
  "../config/database"
);

const DEVICE_TYPES = [
  "phone",
  "tablet",
  "laptop",
  "smartwatch",
  "other",
];

const normalizeText = (value) =>
  String(value ?? "").trim();

const buildNormalizedKey = (
  deviceType,
  brand,
  model
) =>
  [deviceType, brand, model]
    .map((value) =>
      normalizeText(value).toLowerCase()
    )
    .join("|");

const normalizeAliases = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value
        .map(normalizeText)
        .filter(Boolean)
    ),
  ];
};

const normalizeValues = (values) => {
  if (values.deviceType !== undefined) {
    values.deviceType = normalizeText(
      values.deviceType
    ).toLowerCase();
  }

  if (values.brand !== undefined) {
    values.brand = normalizeText(
      values.brand
    );
  }

  if (values.model !== undefined) {
    values.model = normalizeText(
      values.model
    );
  }

  if (values.aliases !== undefined) {
    values.aliases = normalizeAliases(
      values.aliases
    );
  }

  if (
    values.deviceType !== undefined ||
    values.brand !== undefined ||
    values.model !== undefined
  ) {
    values.normalizedKey =
      buildNormalizedKey(
        values.deviceType,
        values.brand,
        values.model
      );
  }
};

const DeviceModel = sequelize.define(
  "DeviceModel",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    model: {
      type: DataTypes.STRING(160),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    aliases: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    normalizedKey: {
      type: DataTypes.STRING(360),
      allowNull: false,
      unique: true,
    },
    usageCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "device_models",
    timestamps: true,
    hooks: {
      beforeValidate(deviceModel) {
        normalizeValues(deviceModel);
      },
      beforeBulkUpdate(options) {
        normalizeValues(
          options.attributes
        );
      },
    },
  }
);

DeviceModel.DEVICE_TYPES = DEVICE_TYPES;
DeviceModel.buildNormalizedKey =
  buildNormalizedKey;

module.exports = DeviceModel;
