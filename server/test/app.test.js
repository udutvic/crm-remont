process.env.NODE_ENV = "test";

const {
  afterEach,
  test,
} = require("node:test");

const assert = require("node:assert/strict");
const request = require("supertest");

const db = require("../src/config/database");
const app = require("../src/app");

const originalAuthenticate =
  db.authenticate.bind(db);

afterEach(() => {
  db.authenticate =
    originalAuthenticate;
});

test("GET /api повертає інформацію про API", async () => {
  const response =
    await request(app)
      .get("/api");

  assert.equal(
    response.status,
    200
  );

  assert.deepEqual(
    response.body,
    {
      message:
        "CRM Remont API is running!",
    }
  );
});

test("GET /api/health повертає 200, коли база доступна", async () => {
  db.authenticate =
    async () => undefined;

  const response =
    await request(app)
      .get("/api/health");

  assert.equal(
    response.status,
    200
  );

  assert.equal(
    response.body.status,
    "ok"
  );

  assert.equal(
    response.body.api,
    "running"
  );

  assert.equal(
    response.body.database,
    "connected"
  );

  assert.equal(
    typeof response.body.timestamp,
    "string"
  );
});

test("GET /api/health повертає 503, коли база недоступна", async () => {
  db.authenticate =
    async () => {
      throw new Error(
        "Database unavailable"
      );
    };

  const response =
    await request(app)
      .get("/api/health");

  assert.equal(
    response.status,
    503
  );

  assert.equal(
    response.body.status,
    "error"
  );

  assert.equal(
    response.body.database,
    "disconnected"
  );

  assert.equal(
    response.body.error,
    "Database unavailable"
  );
});

test("невідомий API-маршрут повертає JSON з кодом 404", async () => {
  const response =
    await request(app)
      .get(
        "/api/unknown-route"
      );

  assert.equal(
    response.status,
    404
  );

  assert.equal(
    response.body.status,
    "error"
  );

  assert.equal(
    response.body.message,
    "Route not found: GET /api/unknown-route"
  );

  assert.equal(
    response.body.path,
    "/api/unknown-route"
  );
});

test("неправильний JSON повертає код 400", async () => {
  const response =
    await request(app)
      .post("/api/auth/login")
      .set(
        "Content-Type",
        "application/json"
      )
      .send(
        '{"email":'
      );

  assert.equal(
    response.status,
    400
  );

  assert.equal(
    response.body.status,
    "error"
  );

  assert.equal(
    response.body.message,
    "Invalid JSON in request body."
  );
});