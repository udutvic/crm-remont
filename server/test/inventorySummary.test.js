process.env.NODE_ENV = "test";

const {
  afterEach,
  test,
} = require("node:test");

const assert = require("node:assert/strict");

const {
  QueryTypes,
} = require("sequelize");

const sequelize = require(
  "../src/config/database"
);

const inventoryController = require(
  "../src/controllers/inventoryController"
);

const originalQuery =
  sequelize.query.bind(
    sequelize
  );

afterEach(() => {
  sequelize.query =
    originalQuery;
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
  "inventory summary uses one aggregate query and separates stock states",
  async () => {
    let executedSql =
      "";

    sequelize.query =
      async (
        sql,
        options
      ) => {
        executedSql =
          sql;

        assert.equal(
          options.type,
          QueryTypes.SELECT
        );

        return [
          {
            activeItems: "4",
            totalUnits: "6",
            lowStockItems: "1",
            outOfStockItems: "2",
            purchaseValue: "60.00",
            saleValue: "120.00",
          },
        ];
      };

    const response =
      createResponse();

    await inventoryController
      .getSummary(
        {},
        response
      );

    assert.match(
      executedSql,
      /COUNT\(\*\)/
    );

    assert.match(
      executedSql,
      /"minStock" > 0/
    );

    assert.match(
      executedSql,
      /"currentQuantity" > 0/
    );

    assert.match(
      executedSql,
      /"currentQuantity" = 0/
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
