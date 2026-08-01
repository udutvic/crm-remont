require("dotenv").config();

const app = require("./app");
const db = require("./config/database");
const {
  assertAccessCodeKey,
} = require(
  "./utils/accessCodeCrypto"
);

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    assertAccessCodeKey();
    await db.authenticate();
    console.log("✅ Database connected...");

    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Unable to start the server:",
      error instanceof Error ? error.message : error
    );

    process.exit(1);
  }
};

void startServer();