require("dotenv").config();

const localConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  dialect: "postgres",
  logging: false,
};

module.exports = {
  development: localConfig,

  test: {
    ...localConfig,
    database:
      process.env.TEST_DB_NAME ||
      `${process.env.DB_NAME}_test`,
  },

  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
};