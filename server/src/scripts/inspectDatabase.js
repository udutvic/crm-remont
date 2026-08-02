require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { QueryTypes } = require("sequelize");

const database = require("../config/database");

const getTableName = (table) => {
  if (typeof table === "string") {
    return table;
  }

  return table.tableName;
};

const simplifyColumns = (columns) => {
  return Object.entries(columns).map(
    ([columnName, definition]) => ({
      name: columnName,
      type: definition.type,
      allowNull: definition.allowNull,
      primaryKey: definition.primaryKey,
      autoIncrement: definition.autoIncrement,
      defaultValue: definition.defaultValue,
    })
  );
};

const simplifyIndexes = (indexes) => {
  return indexes.map((index) => ({
    name: index.name,
    unique: index.unique,
    primary: index.primary,
    fields: index.fields.map(
      (field) =>
        field.attribute ||
        field.name ||
        String(field)
    ),
  }));
};

const simplifyForeignKeys = (foreignKeys) => {
  return foreignKeys.map((foreignKey) => ({
    columnName: foreignKey.columnName,
    referencedTableName:
      foreignKey.referencedTableName,
    referencedColumnName:
      foreignKey.referencedColumnName,
  }));
};

const inspectDatabase = async () => {
  try {
    await database.authenticate();

    const [databaseInformation] = await database.query(
      `
        SELECT
          current_database() AS "databaseName",
          current_schema() AS "schemaName",
          version() AS "version";
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    const queryInterface =
      database.getQueryInterface();

    const rawTables =
      await queryInterface.showAllTables();

    const tableNames = rawTables
      .map(getTableName)
      .sort((firstTable, secondTable) =>
        firstTable.localeCompare(secondTable)
      );

    const tables = [];

    for (const tableName of tableNames) {
      const columns =
        await queryInterface.describeTable(tableName);

      const indexes =
        await queryInterface.showIndex(tableName);

      const foreignKeys =
        await queryInterface.getForeignKeyReferencesForTable(
          tableName
        );

      const quotedTableName =
        queryInterface.queryGenerator.quoteTable(
          tableName
        );

      const [countResult] = await database.query(
        `
          SELECT COUNT(*)::integer AS "rowCount"
          FROM ${quotedTableName};
        `,
        {
          type: QueryTypes.SELECT,
        }
      );

      tables.push({
        name: tableName,
        rowCount: Number(countResult.rowCount),
        columns: simplifyColumns(columns),
        indexes: simplifyIndexes(indexes),
        foreignKeys:
          simplifyForeignKeys(foreignKeys),
      });
    }

    const report = {
      generatedAt: new Date().toISOString(),
      database: databaseInformation,
      tables,
    };

    const reportDirectory =
      process.env.DB_BACKUP_DIR ||
      path.resolve(
        process.cwd(),
        "..",
        "crm-remont-backups"
      );

    fs.mkdirSync(reportDirectory, {
      recursive: true,
    });

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-");

    const reportFilePath = path.join(
      reportDirectory,
      `database-structure-${timestamp}.json`
    );

    fs.writeFileSync(
      reportFilePath,
      JSON.stringify(report, null, 2),
      "utf8"
    );

    console.log("Database inspection completed.");
    console.log(`Database: ${report.database.databaseName}`);
    console.log(`Schema: ${report.database.schemaName}`);
    console.log(`Tables found: ${tables.length}`);
    console.log("");

    for (const table of tables) {
      console.log(
        `${table.name}: ${table.rowCount} rows, ${table.columns.length} columns`
      );
    }

    console.log("");
    console.log(`Report: ${reportFilePath}`);
  } catch (error) {
    console.error(
      "Database inspection failed:",
      error instanceof Error
        ? error.message
        : error
    );

    process.exitCode = 1;
  } finally {
    await database.close();
  }
};

void inspectDatabase();