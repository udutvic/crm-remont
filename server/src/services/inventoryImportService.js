const {
  Op,
} = require(
  "sequelize"
);

const InventoryItem = require(
  "../models/InventoryItem"
);
const StockMovement = require(
  "../models/StockMovement"
);

const {
  validateItemPayload,
} = require(
  "../validators/inventoryValidator"
);

const MAX_IMPORT_ROWS = 1000;

const DUPLICATE_ACTIONS =
  new Set([
    "skip",
    "update",
    "add_quantity",
    "replace",
  ]);

const ROW_ACTIONS =
  new Set([
    "create",
    ...DUPLICATE_ACTIONS,
  ]);

const IDENTIFIER_FIELDS = [
  "sku",
  "supplierSku",
  "barcode",
];

const UPDATE_FIELDS = [
  "sku",
  "supplierSku",
  "barcode",
  "name",
  "category",
  "brand",
  "compatibility",
  "purchasePrice",
  "salePrice",
  "minStock",
  "supplier",
  "location",
  "note",
  "isActive",
];

const hasProvidedValue = (
  value
) => {
  if (
    value === false ||
    value === 0
  ) {
    return true;
  }

  if (
    value === null ||
    value === undefined
  ) {
    return false;
  }

  return (
    String(value).trim() !==
    ""
  );
};

const normalizeSourceName = (
  value
) => {
  const normalized =
    String(
      value ??
        "Inventory import"
    ).trim();

  return (
    normalized ||
    "Inventory import"
  ).slice(
    0,
    255
  );
};

const normalizeRowNumber = (
  value,
  index
) => {
  const number =
    Number(value);

  return (
    Number.isInteger(
      number
    ) &&
    number > 0
  )
    ? number
    : index + 2;
};

const normalizeRowAction = (
  value
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const normalized =
    String(value)
      .trim()
      .toLowerCase();

  return ROW_ACTIONS.has(
    normalized
  )
    ? normalized
    : null;
};

const makeServiceError = (
  status,
  code,
  message,
  details = null
) => {
  const error =
    new Error(
      message
    );

  error.status =
    status;
  error.code =
    code;
  error.details =
    details;

  return error;
};

const assertRows = (
  rows
) => {
  if (
    !Array.isArray(
      rows
    ) ||
    rows.length === 0
  ) {
    throw makeServiceError(
      400,
      "INVENTORY_IMPORT_ROWS_REQUIRED",
      "Import rows are required."
    );
  }

  if (
    rows.length >
    MAX_IMPORT_ROWS
  ) {
    throw makeServiceError(
      413,
      "INVENTORY_IMPORT_TOO_LARGE",
      `A maximum of ${MAX_IMPORT_ROWS} rows can be imported at once.`
    );
  }
};

const serializeExistingItem = (
  item
) => ({
  id: item.id,
  sku: item.sku,
  supplierSku:
    item.supplierSku,
  barcode:
    item.barcode,
  name: item.name,
  category:
    item.category,
  currentQuantity:
    item.currentQuantity,
  isActive:
    item.isActive,
});

const createCanonicalRow = (
  row,
  index
) => {
  const rowNumber =
    normalizeRowNumber(
      row?.rowNumber,
      index
    );

  if (
    !row ||
    typeof row !==
      "object" ||
    Array.isArray(row)
  ) {
    return {
      index,
      rowNumber,
      requestedAction:
        null,
      normalized: null,
      createPayload:
        null,
      updatePayload:
        null,
      status:
        "invalid",
      matchedBy: [],
      existingItem:
        null,
      errors: {
        row:
          "The row must be an object.",
      },
      warnings: [],
      suggestedAction:
        "skip",
    };
  }

  const rawForValidation = {
    ...row,
    initialQuantity:
      row.quantity ??
      row.initialQuantity,
  };

  const validation =
    validateItemPayload(
      rawForValidation
    );

  const errors = {
    ...validation.errors,
  };

  const requestedAction =
    normalizeRowAction(
      row.action
    );

  if (
    row.action !==
      undefined &&
    row.action !==
      null &&
    row.action !==
      "" &&
    !requestedAction
  ) {
    errors.action =
      "Unsupported import row action.";
  }

  const normalized =
    validation.isValid
      ? {
          ...validation.payload,
          quantity:
            validation.initialQuantity,
        }
      : null;

  const providedFields =
    new Set(
      UPDATE_FIELDS.filter(
        (
          field
        ) =>
          hasProvidedValue(
            row[field]
          )
      )
    );

  const updatePayload = {};

  if (normalized) {
    for (
      const field of
      UPDATE_FIELDS
    ) {
      if (
        providedFields.has(
          field
        ) &&
        normalized[field] !==
          undefined
      ) {
        updatePayload[field] =
          normalized[field];
      }
    }
  }

  return {
    index,
    rowNumber,
    requestedAction,
    normalized,
    createPayload:
      normalized
        ? {
            ...validation.payload,
            currentQuantity:
              0,
          }
        : null,
    updatePayload:
      normalized
        ? updatePayload
        : null,
    status:
      validation.isValid &&
      Object.keys(
        errors
      ).length === 0
        ? "pending"
        : "invalid",
    matchedBy: [],
    existingItem:
      null,
    errors,
    warnings: [],
    suggestedAction:
      validation.isValid
        ? "create"
        : "skip",
  };
};

const markFileDuplicates = (
  rows
) => {
  for (
    const field of
    IDENTIFIER_FIELDS
  ) {
    const occurrences =
      new Map();

    for (
      const row of
      rows
    ) {
      if (
        row.status !==
          "pending" ||
        !row.normalized
      ) {
        continue;
      }

      const value =
        row.normalized[
          field
        ];

      if (!value) {
        continue;
      }

      const key =
        String(value);

      const indexes =
        occurrences.get(
          key
        ) ?? [];

      indexes.push(
        row.index
      );

      occurrences.set(
        key,
        indexes
      );
    }

    for (
      const [
        value,
        indexes,
      ] of occurrences
    ) {
      if (
        indexes.length <
        2
      ) {
        continue;
      }

      const rowNumbers =
        indexes.map(
          (
            index
          ) =>
            rows[index]
              .rowNumber
        );

      for (
        const index of
        indexes
      ) {
        const row =
          rows[index];

        row.status =
          "file_duplicate";

        row.errors[
          field
        ] =
          `${field} "${value}" is repeated in import rows ${rowNumbers.join(", ")}.`;

        row.suggestedAction =
          "skip";
      }
    }
  }
};

const buildDatabaseMaps = (
  items
) => {
  const maps = {
    sku:
      new Map(),
    supplierSku:
      new Map(),
    barcode:
      new Map(),
  };

  for (
    const item of
    items
  ) {
    for (
      const field of
      IDENTIFIER_FIELDS
    ) {
      const value =
        item[field];

      if (value) {
        maps[field].set(
          String(value),
          item
        );
      }
    }
  }

  return maps;
};

const findDatabaseMatches = (
  row,
  databaseMaps
) => {
  const matches =
    new Map();

  const matchedBy =
    [];

  for (
    const field of
    IDENTIFIER_FIELDS
  ) {
    const value =
      row.normalized?.[
        field
      ];

    if (!value) {
      continue;
    }

    const item =
      databaseMaps[
        field
      ].get(
        String(value)
      );

    if (!item) {
      continue;
    }

    matches.set(
      item.id,
      item
    );

    matchedBy.push(
      field
    );
  }

  return {
    matches:
      Array.from(
        matches.values()
      ),
    matchedBy,
  };
};

const buildSearchConditions = (
  rows
) => {
  const conditions =
    [];

  for (
    const field of
    IDENTIFIER_FIELDS
  ) {
    const values =
      Array.from(
        new Set(
          rows
            .filter(
              (
                row
              ) =>
                row.status ===
                  "pending" &&
                row.normalized?.[
                  field
                ]
            )
            .map(
              (
                row
              ) =>
                row.normalized[
                  field
                ]
            )
        )
      );

    if (
      values.length >
      0
    ) {
      conditions.push({
        [field]: {
          [Op.in]:
            values,
        },
      });
    }
  }

  return conditions;
};

const summarizeRows = (
  rows
) => {
  const summary = {
    totalRows:
      rows.length,
    validRows: 0,
    invalidRows: 0,
    newRows: 0,
    duplicateRows: 0,
    conflictRows: 0,
    fileDuplicateRows:
      0,
  };

  for (
    const row of
    rows
  ) {
    switch (
      row.status
    ) {
      case "new":
        summary.validRows +=
          1;
        summary.newRows +=
          1;
        break;

      case "duplicate":
        summary.validRows +=
          1;
        summary.duplicateRows +=
          1;
        break;

      case "conflict":
        summary.conflictRows +=
          1;
        break;

      case "file_duplicate":
        summary.fileDuplicateRows +=
          1;
        break;

      default:
        summary.invalidRows +=
          1;
    }
  }

  return summary;
};

const publicRow = (
  row
) => ({
  rowNumber:
    row.rowNumber,
  status:
    row.status,
  requestedAction:
    row.requestedAction,
  normalized:
    row.normalized,
  matchedBy:
    row.matchedBy,
  existingItem:
    row.existingItem,
  errors:
    row.errors,
  warnings:
    row.warnings,
  suggestedAction:
    row.suggestedAction,
});

const analyzeImportRows =
  async (
    rows,
    {
      transaction =
        null,
    } = {}
  ) => {
    assertRows(
      rows
    );

    const analyzedRows =
      rows.map(
        createCanonicalRow
      );

    markFileDuplicates(
      analyzedRows
    );

    const conditions =
      buildSearchConditions(
        analyzedRows
      );

    const databaseItems =
      conditions.length >
      0
        ? await InventoryItem
            .findAll({
              where: {
                [Op.or]:
                  conditions,
              },
              transaction,
            })
        : [];

    const databaseMaps =
      buildDatabaseMaps(
        databaseItems
      );

    for (
      const row of
      analyzedRows
    ) {
      if (
        row.status !==
          "pending"
      ) {
        continue;
      }

      const {
        matches,
        matchedBy,
      } =
        findDatabaseMatches(
          row,
          databaseMaps
        );

      row.matchedBy =
        matchedBy;

      if (
        matches.length ===
        0
      ) {
        if (
          row.requestedAction &&
          ![
            "create",
            "skip",
          ].includes(
            row.requestedAction
          )
        ) {
          row.status =
            "invalid";
          row.errors.action =
            `Action "${row.requestedAction}" cannot be used for a new row.`;
          row.suggestedAction =
            "skip";
          continue;
        }

        row.status =
          "new";
        row.suggestedAction =
          row.requestedAction ??
          "create";
        continue;
      }

      if (
        matches.length >
        1
      ) {
        row.status =
          "conflict";
        row.errors.identifiers =
          "The row identifiers match different inventory items.";
        row.suggestedAction =
          "skip";
        continue;
      }

      const existingItem =
        matches[0];

      if (
        row.requestedAction ===
        "create"
      ) {
        row.status =
          "invalid";
        row.errors.action =
          "Create cannot be used for a duplicate row.";
        row.existingItem =
          serializeExistingItem(
            existingItem
          );
        row.suggestedAction =
          "skip";
        continue;
      }

      row.status =
        "duplicate";
      row.existingModel =
        existingItem;
      row.existingItem =
        serializeExistingItem(
          existingItem
        );
      row.suggestedAction =
        row.requestedAction ??
        "skip";
    }

    return {
      rows:
        analyzedRows,
      summary:
        summarizeRows(
          analyzedRows
        ),
    };
  };

const makeMovementNote = (
  sourceName,
  rowNumber,
  action
) =>
  [
    "Inventory import",
    sourceName,
    `row ${rowNumber}`,
    action,
  ]
    .filter(Boolean)
    .join(
      " · "
    )
    .slice(
      0,
      4000
    );

const createStockMovement =
  async ({
    item,
    type,
    quantityChange,
    balanceBefore,
    balanceAfter,
    unitCost,
    userId,
    note,
    transaction,
  }) => {
    if (
      quantityChange ===
      0
    ) {
      return null;
    }

    return StockMovement.create(
      {
        inventoryItemId:
          item.id,
        type,
        quantityChange,
        balanceBefore,
        balanceAfter,
        unitCost,
        orderId: null,
        userId,
        note,
      },
      {
        transaction,
      }
    );
  };

const applyNewRow =
  async ({
    row,
    action,
    sourceName,
    userId,
    transaction,
  }) => {
    if (
      action ===
      "skip"
    ) {
      return {
        result:
          "skipped",
        action,
        rowNumber:
          row.rowNumber,
        itemId: null,
        balanceBefore:
          null,
        balanceAfter:
          null,
        movementCreated:
          false,
      };
    }

    if (
      action !==
      "create"
    ) {
      throw makeServiceError(
        400,
        "INVENTORY_IMPORT_INVALID_ACTION",
        `Action "${action}" cannot be used for a new row.`,
        {
          rowNumber:
            row.rowNumber,
        }
      );
    }

    const item =
      await InventoryItem.create(
        row.createPayload,
        {
          transaction,
        }
      );

    const quantity =
      row.normalized
        .quantity;

    let movement =
      null;

    if (
      quantity >
      0
    ) {
      movement =
        await createStockMovement({
          item,
          type:
            "receipt",
          quantityChange:
            quantity,
          balanceBefore:
            0,
          balanceAfter:
            quantity,
          unitCost:
            row.normalized
              .purchasePrice,
          userId,
          note:
            makeMovementNote(
              sourceName,
              row.rowNumber,
              "initial stock"
            ),
          transaction,
        });

      await item.update(
        {
          currentQuantity:
            quantity,
        },
        {
          transaction,
        }
      );
    }

    return {
      result:
        "created",
      action,
      rowNumber:
        row.rowNumber,
      itemId:
        item.id,
      balanceBefore: 0,
      balanceAfter:
        quantity,
      movementCreated:
        Boolean(
          movement
        ),
    };
  };

const applyDuplicateRow =
  async ({
    row,
    item,
    action,
    sourceName,
    userId,
    transaction,
  }) => {
    if (
      action ===
      "create"
    ) {
      throw makeServiceError(
        400,
        "INVENTORY_IMPORT_INVALID_ACTION",
        "Create cannot be used for a duplicate row.",
        {
          rowNumber:
            row.rowNumber,
          itemId:
            item.id,
        }
      );
    }

    if (
      !DUPLICATE_ACTIONS.has(
        action
      )
    ) {
      throw makeServiceError(
        400,
        "INVENTORY_IMPORT_INVALID_ACTION",
        `Unsupported duplicate action "${action}".`,
        {
          rowNumber:
            row.rowNumber,
          itemId:
            item.id,
        }
      );
    }

    const balanceBefore =
      item.currentQuantity;

    if (
      action ===
      "skip"
    ) {
      return {
        result:
          "skipped",
        action,
        rowNumber:
          row.rowNumber,
        itemId:
          item.id,
        balanceBefore,
        balanceAfter:
          balanceBefore,
        movementCreated:
          false,
      };
    }

    if (
      Object.keys(
        row.updatePayload
      ).length >
      0
    ) {
      await item.update(
        row.updatePayload,
        {
          transaction,
        }
      );
    }

    let balanceAfter =
      balanceBefore;

    let movement =
      null;

    if (
      action ===
      "add_quantity"
    ) {
      balanceAfter =
        balanceBefore +
        row.normalized
          .quantity;

      movement =
        await createStockMovement({
          item,
          type:
            "receipt",
          quantityChange:
            row.normalized
              .quantity,
          balanceBefore,
          balanceAfter,
          unitCost:
            row.normalized
              .purchasePrice,
          userId,
          note:
            makeMovementNote(
              sourceName,
              row.rowNumber,
              "add quantity"
            ),
          transaction,
        });
    } else if (
      action ===
      "replace"
    ) {
      balanceAfter =
        row.normalized
          .quantity;

      movement =
        await createStockMovement({
          item,
          type:
            "adjustment",
          quantityChange:
            balanceAfter -
            balanceBefore,
          balanceBefore,
          balanceAfter,
          unitCost:
            row.normalized
              .purchasePrice,
          userId,
          note:
            makeMovementNote(
              sourceName,
              row.rowNumber,
              "replace quantity"
            ),
          transaction,
        });
    }

    if (
      balanceAfter !==
      balanceBefore
    ) {
      await item.update(
        {
          currentQuantity:
            balanceAfter,
        },
        {
          transaction,
        }
      );
    }

    return {
      result:
        action ===
        "update"
          ? "updated"
          : action ===
              "add_quantity"
            ? "quantity_added"
            : "quantity_replaced",
      action,
      rowNumber:
        row.rowNumber,
      itemId:
        item.id,
      balanceBefore,
      balanceAfter,
      movementCreated:
        Boolean(
          movement
        ),
    };
  };

const resolveLockedMatches =
  async (
    row,
    transaction
  ) => {
    const conditions =
      IDENTIFIER_FIELDS
        .filter(
          (
            field
          ) =>
            row.normalized?.[
              field
            ]
        )
        .map(
          (
            field
          ) => ({
            [field]:
              row.normalized[
                field
              ],
          })
        );

    if (
      conditions.length ===
      0
    ) {
      return [];
    }

    return InventoryItem
      .findAll({
        where: {
          [Op.or]:
            conditions,
        },
        transaction,
        lock:
          transaction.LOCK
            .UPDATE,
      });
  };

const executeImport =
  async ({
    rows,
    sourceName,
    duplicateAction,
    skipInvalid,
    userId,
    transaction,
  }) => {
    if (
      !DUPLICATE_ACTIONS.has(
        duplicateAction
      )
    ) {
      throw makeServiceError(
        400,
        "INVENTORY_IMPORT_INVALID_STRATEGY",
        "Duplicate strategy must be skip, update, add_quantity or replace."
      );
    }

    const normalizedSourceName =
      normalizeSourceName(
        sourceName
      );

    const analysis =
      await analyzeImportRows(
        rows,
        {
          transaction,
        }
      );

    const blockedRows =
      analysis.rows.filter(
        (
          row
        ) =>
          ![
            "new",
            "duplicate",
          ].includes(
            row.status
          )
      );

    if (
      blockedRows.length >
        0 &&
      !skipInvalid
    ) {
      throw makeServiceError(
        400,
        "INVENTORY_IMPORT_BLOCKED",
        "The import contains invalid or conflicting rows.",
        {
          summary:
            analysis.summary,
          rows:
            analysis.rows.map(
              publicRow
            ),
        }
      );
    }

    const results =
      [];

    for (
      const row of
      analysis.rows
    ) {
      if (
        ![
          "new",
          "duplicate",
        ].includes(
          row.status
        )
      ) {
        results.push({
          result:
            "skipped_invalid",
          action:
            "skip",
          rowNumber:
            row.rowNumber,
          itemId: null,
          balanceBefore:
            null,
          balanceAfter:
            null,
          movementCreated:
            false,
          status:
            row.status,
          errors:
            row.errors,
        });

        continue;
      }

      const lockedMatches =
        await resolveLockedMatches(
          row,
          transaction
        );

      const uniqueMatches =
        new Map(
          lockedMatches.map(
            (
              item
            ) => [
              item.id,
              item,
            ]
          )
        );

      if (
        uniqueMatches.size >
        1
      ) {
        if (
          skipInvalid
        ) {
          results.push({
            result:
              "skipped_conflict",
            action:
              "skip",
            rowNumber:
              row.rowNumber,
            itemId: null,
            balanceBefore:
              null,
            balanceAfter:
              null,
            movementCreated:
              false,
            status:
              "conflict",
          });

          continue;
        }

        throw makeServiceError(
          409,
          "INVENTORY_IMPORT_CONFLICT",
          "Import identifiers match different inventory items.",
          {
            rowNumber:
              row.rowNumber,
          }
        );
      }

      const existingItem =
        uniqueMatches.size ===
        1
          ? Array.from(
              uniqueMatches
                .values()
            )[0]
          : null;

      const requestedAction =
        row.requestedAction;

      if (!existingItem) {
        const action =
          requestedAction ??
          "create";

        results.push(
          await applyNewRow({
            row,
            action,
            sourceName:
              normalizedSourceName,
            userId,
            transaction,
          })
        );

        continue;
      }

      const action =
        requestedAction ??
        duplicateAction;

      results.push(
        await applyDuplicateRow({
          row,
          item:
            existingItem,
          action,
          sourceName:
            normalizedSourceName,
          userId,
          transaction,
        })
      );
    }

    const report = {
      totalRows:
        results.length,
      created: 0,
      updated: 0,
      quantityAdded: 0,
      quantityReplaced:
        0,
      skipped: 0,
      skippedInvalid:
        0,
      movementsCreated:
        0,
      quantityDelta: 0,
    };

    for (
      const result of
      results
    ) {
      if (
        result.result ===
        "created"
      ) {
        report.created +=
          1;
      } else if (
        result.result ===
        "updated"
      ) {
        report.updated +=
          1;
      } else if (
        result.result ===
        "quantity_added"
      ) {
        report.quantityAdded +=
          1;
      } else if (
        result.result ===
        "quantity_replaced"
      ) {
        report.quantityReplaced +=
          1;
      } else if (
        result.result ===
          "skipped_invalid" ||
        result.result ===
          "skipped_conflict"
      ) {
        report.skippedInvalid +=
          1;
      } else {
        report.skipped +=
          1;
      }

      if (
        result.movementCreated
      ) {
        report.movementsCreated +=
          1;
      }

      if (
        Number.isInteger(
          result.balanceBefore
        ) &&
        Number.isInteger(
          result.balanceAfter
        )
      ) {
        report.quantityDelta +=
          result.balanceAfter -
          result.balanceBefore;
      }
    }

    return {
      sourceName:
        normalizedSourceName,
      duplicateAction,
      skipInvalid,
      previewSummary:
        analysis.summary,
      report,
      rows:
        results,
    };
  };

module.exports = {
  DUPLICATE_ACTIONS,
  MAX_IMPORT_ROWS,
  analyzeImportRows,
  executeImport,
  makeServiceError,
  normalizeSourceName,
  publicRow,
};
