const {
  DataTypes,
} = require(
  "sequelize"
);

const sequelize = require(
  "../config/database"
);

const InventoryItem = require(
  "./InventoryItem"
);
const Order = require(
  "./Order"
);
const User = require(
  "./User"
);

const MOVEMENT_TYPES = [
  "receipt",
  "issue",
  "return",
  "adjustment",
];

const StockMovement =
  sequelize.define(
    "StockMovement",
    {
      id: {
        type:
          DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      inventoryItemId: {
        type:
          DataTypes.INTEGER,
        allowNull: false,
      },

      type: {
        type:
          DataTypes.ENUM(
            ...MOVEMENT_TYPES
          ),
        allowNull: false,
      },

      quantityChange: {
        type:
          DataTypes.INTEGER,
        allowNull: false,
      },

      balanceBefore: {
        type:
          DataTypes.INTEGER,
        allowNull: false,
      },

      balanceAfter: {
        type:
          DataTypes.INTEGER,
        allowNull: false,
      },

      unitCost: {
        type:
          DataTypes.DECIMAL(
            12,
            2
          ),
        allowNull: true,
      },

      orderId: {
        type:
          DataTypes.INTEGER,
        allowNull: true,
      },

      userId: {
        type:
          DataTypes.INTEGER,
        allowNull: false,
      },

      note: {
        type:
          DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName:
        "stock_movements",
      timestamps: true,
    }
  );

StockMovement.belongsTo(
  InventoryItem,
  {
    foreignKey:
      "inventoryItemId",
    as: "inventoryItem",
  }
);

InventoryItem.hasMany(
  StockMovement,
  {
    foreignKey:
      "inventoryItemId",
    as: "movements",
  }
);

StockMovement.belongsTo(
  Order,
  {
    foreignKey:
      "orderId",
    as: "order",
  }
);

Order.hasMany(
  StockMovement,
  {
    foreignKey:
      "orderId",
    as: "stockMovements",
  }
);

StockMovement.belongsTo(
  User,
  {
    foreignKey:
      "userId",
    as: "createdBy",
  }
);

User.hasMany(
  StockMovement,
  {
    foreignKey:
      "userId",
    as: "stockMovements",
  }
);

StockMovement.MOVEMENT_TYPES =
  MOVEMENT_TYPES;

module.exports =
  StockMovement;
