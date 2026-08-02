const {
  DataTypes,
} = require(
  "sequelize"
);

const sequelize = require(
  "../config/database"
);

const normalizeRequiredText = (
  value
) =>
  String(
    value ?? ""
  ).trim();

const normalizeOptionalText = (
  value
) => {
  const normalized =
    String(
      value ?? ""
    ).trim();

  return normalized || null;
};

const normalizeCode = (
  value
) => {
  const normalized =
    normalizeOptionalText(
      value
    );

  return normalized
    ? normalized.toUpperCase()
    : null;
};

const normalizeValues = (
  values
) => {
  if (
    values.sku !==
    undefined
  ) {
    values.sku =
      normalizeCode(
        values.sku
      );
  }

  if (
    values.supplierSku !==
    undefined
  ) {
    values.supplierSku =
      normalizeCode(
        values.supplierSku
      );
  }

  if (
    values.barcode !==
    undefined
  ) {
    values.barcode =
      normalizeOptionalText(
        values.barcode
      );
  }

  for (
    const field of [
      "name",
      "category",
    ]
  ) {
    if (
      values[field] !==
      undefined
    ) {
      values[field] =
        normalizeRequiredText(
          values[field]
        );
    }
  }

  for (
    const field of [
      "brand",
      "compatibility",
      "supplier",
      "location",
      "note",
    ]
  ) {
    if (
      values[field] !==
      undefined
    ) {
      values[field] =
        normalizeOptionalText(
          values[field]
        );
    }
  }
};

const InventoryItem =
  sequelize.define(
    "InventoryItem",
    {
      id: {
        type:
          DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      sku: {
        type:
          DataTypes.STRING(
            100
          ),
        allowNull: false,
        unique: true,
      },

      supplierSku: {
        type:
          DataTypes.STRING(
            120
          ),
        allowNull: true,
        unique: true,
      },

      barcode: {
        type:
          DataTypes.STRING(
            120
          ),
        allowNull: true,
        unique: true,
      },

      name: {
        type:
          DataTypes.STRING(
            200
          ),
        allowNull: false,
      },

      category: {
        type:
          DataTypes.STRING(
            120
          ),
        allowNull: false,
      },

      brand: {
        type:
          DataTypes.STRING(
            120
          ),
        allowNull: true,
      },

      compatibility: {
        type:
          DataTypes.TEXT,
        allowNull: true,
      },

      purchasePrice: {
        type:
          DataTypes.DECIMAL(
            12,
            2
          ),
        allowNull: false,
        defaultValue: 0,
      },

      salePrice: {
        type:
          DataTypes.DECIMAL(
            12,
            2
          ),
        allowNull: false,
        defaultValue: 0,
      },

      currentQuantity: {
        type:
          DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      minStock: {
        type:
          DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      supplier: {
        type:
          DataTypes.STRING(
            200
          ),
        allowNull: true,
      },

      location: {
        type:
          DataTypes.STRING(
            200
          ),
        allowNull: true,
      },

      note: {
        type:
          DataTypes.TEXT,
        allowNull: true,
      },

      isActive: {
        type:
          DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName:
        "inventory_items",
      timestamps: true,

      hooks: {
        beforeValidate(
          item
        ) {
          normalizeValues(
            item
          );
        },

        beforeBulkUpdate(
          options
        ) {
          normalizeValues(
            options.attributes ??
              {}
          );
        },
      },
    }
  );

module.exports =
  InventoryItem;
