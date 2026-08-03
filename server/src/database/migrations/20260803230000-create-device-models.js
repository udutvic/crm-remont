"use strict";

const initialModels = [
  ["phone", "Apple", "iPhone 15 Pro Max", 120],
  ["phone", "Apple", "iPhone 15 Pro", 110],
  ["phone", "Apple", "iPhone 15", 100],
  ["phone", "Apple", "iPhone 14 Pro Max", 95],
  ["phone", "Apple", "iPhone 14 Pro", 90],
  ["phone", "Apple", "iPhone 14", 85],
  ["phone", "Apple", "iPhone 13 Pro Max", 80],
  ["phone", "Apple", "iPhone 13 Pro", 75],
  ["phone", "Apple", "iPhone 13", 70],
  ["phone", "Samsung", "Galaxy S24 Ultra", 65],
  ["phone", "Samsung", "Galaxy S23 Ultra", 60],
  ["phone", "Samsung", "Galaxy S21 5G", 55],
  ["phone", "Xiaomi", "13T Pro", 50],
  ["phone", "Xiaomi", "Redmi Note 13 Pro", 45],
  ["tablet", "Apple", "iPad Pro 11", 35],
  ["tablet", "Samsung", "Galaxy Tab S9", 30],
];

const normalizedKey = (
  deviceType,
  brand,
  model
) =>
  [deviceType, brand, model]
    .map((value) =>
      String(value).trim().toLowerCase()
    )
    .join("|");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(
      async (transaction) => {
        await queryInterface.createTable(
          "device_models",
          {
            id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true,
              allowNull: false,
            },
            deviceType: {
              type: Sequelize.STRING(40),
              allowNull: false,
              defaultValue: "phone",
            },
            brand: {
              type: Sequelize.STRING(120),
              allowNull: false,
            },
            model: {
              type: Sequelize.STRING(160),
              allowNull: false,
            },
            aliases: {
              type: Sequelize.JSONB,
              allowNull: false,
              defaultValue: [],
            },
            normalizedKey: {
              type: Sequelize.STRING(360),
              allowNull: false,
              unique: true,
            },
            usageCount: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 0,
            },
            isActive: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: true,
            },
            createdAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn("NOW"),
            },
            updatedAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn("NOW"),
            },
          },
          { transaction }
        );

        await queryInterface.addIndex(
          "device_models",
          ["isActive", "usageCount"],
          {
            name: "device_models_popular_idx",
            transaction,
          }
        );

        await queryInterface.addIndex(
          "device_models",
          ["brand", "model"],
          {
            name: "device_models_search_idx",
            transaction,
          }
        );

        const now = new Date();

        await queryInterface.bulkInsert(
          "device_models",
          initialModels.map(
            ([deviceType, brand, model, usageCount]) => ({
              deviceType,
              brand,
              model,
              aliases: JSON.stringify([]),
              normalizedKey: normalizedKey(
                deviceType,
                brand,
                model
              ),
              usageCount,
              isActive: true,
              createdAt: now,
              updatedAt: now,
            })
          ),
          { transaction }
        );
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      "device_models"
    );
  },
};
