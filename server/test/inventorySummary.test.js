process.env.NODE_ENV = "test";

const {
  afterEach,
  test,
} = require("node:test");
const assert = require("node:assert/strict");

const InventoryItem = require(
  "../src/models/InventoryItem"
);
const inventoryController = require(
  "../src/controllers/inventoryController"
);

const originalFindAll =
  InventoryItem.findAll.bind(
    InventoryItem
  );

afterEach(() => {
  InventoryItem.findAll =
    originalFindAll;
});

const createResponse = () => {
  const response = {
    statusCode: 200,
    body: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(body) {
      this.body = body;
      return this;
    },
  };

  return response;
};

test(
  "inventory summary separates low stock from out of stock",
  async () => {
    InventoryItem.findAll =
      async () => [
        {
          currentQuantity: 0,
          minStock: 0,
          purchasePrice: 10,
          salePrice: 20,
        },
        {
          currentQuantity: 0,
          minStock: 2,
          purchasePrice: 10,
          salePrice: 20,
        },
        {
          currentQuantity: 1,
          minStock: 2,
          purchasePrice: 10,
          salePrice: 20,
        },
        {
          currentQuantity: 5,
          minStock: 2,
          purchasePrice: 10,
          salePrice: 20,
        },
      ];

    const response =
      createResponse();

    await inventoryController
      .getSummary(
        {},
        response
      );

    assert.equal(
      response.statusCode,
      200
    );

    assert.deepEqual(
      response.body,
      {
        activeItems: 4,
        totalUnits: 6,
        lowStockItems: 1,
        outOfStockItems: 2,
        purchaseValue: 60,
        saleValue: 120,
      }
    );
  }
);
