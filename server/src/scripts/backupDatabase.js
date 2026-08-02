require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const requiredEnvironmentVariables = [
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
];

const missingEnvironmentVariables =
  requiredEnvironmentVariables.filter(
    (variableName) => !process.env[variableName]
  );

if (missingEnvironmentVariables.length > 0) {
  console.error(
    `Missing environment variables: ${missingEnvironmentVariables.join(", ")}`
  );

  process.exit(1);
}

const databaseHost = process.env.DB_HOST;
const databasePort = process.env.DB_PORT || "5432";
const databaseName = process.env.DB_NAME;
const databaseUser = process.env.DB_USER;
const databasePassword = process.env.DB_PASSWORD || "";

const backupDirectory =
  process.env.DB_BACKUP_DIR ||
  path.resolve(process.cwd(), "..", "crm-remont-backups");

const timestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, "-");

const backupFilePath = path.join(
  backupDirectory,
  `${databaseName}-${timestamp}.backup`
);

const pgDumpCommand =
  process.env.PG_DUMP_PATH || "pg_dump";

fs.mkdirSync(backupDirectory, {
  recursive: true,
});

console.log(`Database: ${databaseName}`);
console.log(`Backup directory: ${backupDirectory}`);
console.log("Creating backup...");

const backupResult = spawnSync(
  pgDumpCommand,
  [
    "--host",
    databaseHost,
    "--port",
    databasePort,
    "--username",
    databaseUser,
    "--dbname",
    databaseName,
    "--format",
    "custom",
    "--no-owner",
    "--no-privileges",
    "--file",
    backupFilePath,
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      PGPASSWORD: databasePassword,
    },
  }
);

if (backupResult.error) {
  console.error(
    "Failed to start pg_dump:",
    backupResult.error.message
  );

  console.error(
    "Make sure pg_dump is installed and available in PATH, or set PG_DUMP_PATH in server/.env."
  );

  process.exit(1);
}

if (backupResult.status !== 0) {
  console.error(
    `pg_dump finished with exit code ${backupResult.status}.`
  );

  process.exit(1);
}

if (!fs.existsSync(backupFilePath)) {
  console.error("Backup file was not created.");

  process.exit(1);
}

const backupStats = fs.statSync(backupFilePath);

if (backupStats.size === 0) {
  console.error("Backup file is empty.");

  process.exit(1);
}

const backupSizeInMegabytes = (
  backupStats.size /
  1024 /
  1024
).toFixed(2);

console.log("Backup created successfully.");
console.log(`File: ${backupFilePath}`);
console.log(`Size: ${backupSizeInMegabytes} MB`);