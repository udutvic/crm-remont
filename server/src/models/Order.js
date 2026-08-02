const { DataTypes } = require(
  "sequelize"
);

const sequelize = require(
  "../config/database"
);

const Client = require("./Client");
const Device = require("./Device");
const User = require("./User");

const ORDER_STATUSES = [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
  "unrepairable",
];

const ACCESS_TYPES = [
  "none",
  "pin",
  "password",
  "pattern",
  "unknown",
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

const normalizeMoney = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return value;
  }

  return number.toFixed(2);
};

const normalizeOrderValues = (
  values
) => {
  if (values.problem !== undefined) {
    values.problem =
      normalizeRequiredText(
        values.problem
      );
  }

  if (values.status !== undefined) {
    values.status = String(
      values.status ?? ""
    )
      .trim()
      .toLowerCase();
  }

  if (
    values.deviceCondition !== undefined
  ) {
    values.deviceCondition =
      normalizeOptionalText(
        values.deviceCondition
      );
  }

  if (values.accessories !== undefined) {
    values.accessories =
      normalizeOptionalText(
        values.accessories
      );
  }

  if (values.accessType !== undefined) {
    values.accessType = String(
      values.accessType ?? "none"
    )
      .trim()
      .toLowerCase();
  }

  if (values.diagnosis !== undefined) {
    values.diagnosis =
      normalizeOptionalText(
        values.diagnosis
      );
  }

  if (
    values.workPerformed !== undefined
  ) {
    values.workPerformed =
      normalizeOptionalText(
        values.workPerformed
      );
  }

  if (values.internalNote !== undefined) {
    values.internalNote =
      normalizeOptionalText(
        values.internalNote
      );
  }

  for (
    const field of
    [
      "laborPrice",
      "discount",
      "otherCosts",
    ]
  ) {
    if (
      values[field] !==
      undefined
    ) {
      values[field] =
        normalizeMoney(
          values[field]
        );
    }
  }

  if (
    values.estimatedPrice !== undefined
  ) {
    values.estimatedPrice =
      normalizeMoney(
        values.estimatedPrice
      );
  }

  if (values.finalPrice !== undefined) {
    values.finalPrice =
      normalizeMoney(
        values.finalPrice
      );
  }
};

const Order = sequelize.define(
  "Order",
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

    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "devices",
        key: "id",
      },
    },

    problem: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notEmpty: true,
      },
    },

    status: {
      type: DataTypes.ENUM(
        ...ORDER_STATUSES
      ),
      allowNull: false,
      defaultValue: "pending",

      validate: {
        isIn: [ORDER_STATUSES],
      },
    },

    /*
     * Temporary compatibility field.
     * It will be removed after the new
     * order form uses estimatedPrice
     * and finalPrice.
     */
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,

      validate: {
        min: 0,
      },
    },

    deviceCondition: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    accessories: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    accessType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "none",

      validate: {
        isIn: [ACCESS_TYPES],
      },
    },

    accessCodeEncrypted: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    workPerformed: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    internalNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    laborPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,

      validate: {
        min: 0,
      },
    },

    discount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,

      validate: {
        min: 0,
      },
    },

    otherCosts: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,

      validate: {
        min: 0,
      },
    },

    estimatedPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,

      validate: {
        min: 0,
      },
    },

    finalPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,

      validate: {
        min: 0,
      },
    },

    receivedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    dueAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    archivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    archivedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,

      references: {
        model: "users",
        key: "id",
      },
    },

    archiveReason: {
      type:
        DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "orders",
    timestamps: true,

    defaultScope: {
      attributes: {
        exclude: [
          "accessCodeEncrypted",
        ],
      },

      where: {
        archivedAt: null,
      },
    },

    scopes: {
      withAccessCode: {
        attributes: {
          include: [
            "accessCodeEncrypted",
          ],
        },

        where: {
          archivedAt: null,
        },
      },
    },

    hooks: {
      beforeValidate(order) {
        normalizeOrderValues(order);
      },

      beforeBulkUpdate(options) {
        normalizeOrderValues(
          options.attributes
        );
      },
    },
  }
);

Order.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});

Order.belongsTo(Device, {
  foreignKey: "deviceId",
  as: "device",
});

Client.hasMany(Order, {
  foreignKey: "clientId",
  as: "orders",
});

Device.hasMany(Order, {
  foreignKey: "deviceId",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "archivedBy",
  as: "archivedByUser",
});

User.hasMany(Order, {
  foreignKey: "archivedBy",
  as: "archivedOrders",
});

module.exports = Order;