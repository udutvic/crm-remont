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


  if (values.color !== undefined) {
    values.color = normalizeOptionalText(
      values.color
    );
  }
};

const normalizeBulkIdentifier = (
  options,
  fieldName,
  normalizedFieldName
) => {
  const attributes =
    options.attributes ?? {};

  if (
    attributes[fieldName] ===
    undefined
  ) {
    return;
  }

  const value =
    normalizeOptionalText(
      attributes[fieldName]
    );

  attributes[fieldName] = value;

  attributes[normalizedFieldName] =
    normalizeDeviceIdentifier(value);

  if (
    Array.isArray(options.fields) &&
    !options.fields.includes(
      normalizedFieldName
    )
  ) {
    options.fields.push(
      normalizedFieldName
    );
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

  set(value) {
    const normalizedValue =
      normalizeOptionalText(value);

    this.setDataValue(
      "imei1",
      normalizedValue
    );

    this.setDataValue(
      "imei1Normalized",
      normalizeDeviceIdentifier(
        normalizedValue
      )
    );
  },
},

    imei1Normalized: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },

    imei2: {
  type: DataTypes.STRING(32),
  allowNull: true,

  set(value) {
    const normalizedValue =
      normalizeOptionalText(value);

    this.setDataValue(
      "imei2",
      normalizedValue
    );

    this.setDataValue(
      "imei2Normalized",
      normalizeDeviceIdentifier(
        normalizedValue
      )
    );
  },
},

    imei2Normalized: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },

    serial: {
  type: DataTypes.STRING,
  allowNull: true,

  set(value) {
    const normalizedValue =
      normalizeOptionalText(value);

    this.setDataValue(
      "serial",
      normalizedValue
    );

    this.setDataValue(
      "serialNormalized",
      normalizeDeviceIdentifier(
        normalizedValue
      )
    );
  },
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

  normalizeBulkIdentifier(
    options,
    "imei1",
    "imei1Normalized"
  );

  normalizeBulkIdentifier(
    options,
    "imei2",
    "imei2Normalized"
  );

  normalizeBulkIdentifier(
    options,
    "serial",
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
