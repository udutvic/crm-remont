const sequelize = require(
  "../config/database"
);

const {
  DUPLICATE_ACTIONS,
  analyzeImportRows,
  executeImport,
  normalizeSourceName,
  publicRow,
} = require(
  "../services/inventoryImportService"
);

const sendError = (
  res,
  error
) => {
  if (
    error.status &&
    error.code
  ) {
    return res
      .status(
        error.status
      )
      .json({
        code:
          error.code,
        error:
          error.message,
        ...(error.details
          ? {
              details:
                error.details,
            }
          : {}),
      });
  }

  console.error(
    "Inventory import failed:",
    error
  );

  return res
    .status(500)
    .json({
      code:
        "INVENTORY_IMPORT_INTERNAL_ERROR",
      error:
        "Inventory import failed.",
    });
};

exports.preview = async (
  req,
  res
) => {
  try {
    const analysis =
      await analyzeImportRows(
        req.body?.rows
      );

    return res
      .status(200)
      .json({
        sourceName:
          normalizeSourceName(
            req.body
              ?.sourceName
          ),
        summary:
          analysis.summary,
        rows:
          analysis.rows.map(
            publicRow
          ),
      });
  } catch (error) {
    return sendError(
      res,
      error
    );
  }
};

exports.execute = async (
  req,
  res
) => {
  const duplicateAction =
    String(
      req.body
        ?.duplicateAction ??
        "skip"
    )
      .trim()
      .toLowerCase();

  if (
    !DUPLICATE_ACTIONS.has(
      duplicateAction
    )
  ) {
    return res
      .status(400)
      .json({
        code:
          "INVENTORY_IMPORT_INVALID_STRATEGY",
        error:
          "Duplicate strategy must be skip, update, add_quantity or replace.",
      });
  }

  const skipInvalid =
    req.body
      ?.skipInvalid ===
    true;

  const transaction =
    await sequelize
      .transaction();

  try {
    const result =
      await executeImport({
        rows:
          req.body?.rows,
        sourceName:
          req.body
            ?.sourceName,
        duplicateAction,
        skipInvalid,
        userId:
          req.auth.user.id,
        transaction,
      });

    await transaction
      .commit();

    return res
      .status(200)
      .json(result);
  } catch (error) {
    await transaction
      .rollback();

    return sendError(
      res,
      error
    );
  }
};
