import {
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ChangeEvent,
} from "react";
import {
  CheckCircleOutline as SuccessIcon,
  DownloadOutlined as DownloadIcon,
  UploadFileOutlined as UploadIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import getInventoryErrorMessage from "features/inventory/getInventoryErrorMessage";
import {
  autoMapInventoryColumns,
  buildInventoryImportRows,
  extractInventorySheet,
  parseInventoryFile,
} from "features/inventory/inventoryFileParser";
import type {
  InventorySheetData,
  ParsedInventoryWorkbook,
} from "features/inventory/inventoryFileParser";
import {
  executeInventoryImport,
  previewInventoryImport,
} from "index";
import type {
  InventoryColumnMapping,
  InventoryImportDuplicateAction,
  InventoryImportExecuteResponse,
  InventoryImportField,
  InventoryImportInputRow,
  InventoryImportPreviewResponse,
  InventoryImportPreviewRow,
  InventoryImportRowStatus,
} from "types";

interface InventoryImportDialogProps {
  open: boolean;
  onClose: () => void;

  onImported: (
    response:
      InventoryImportExecuteResponse
  ) => void;
}

interface ImportFieldDefinition {
  field: InventoryImportField;
  required?: boolean;
}

const IMPORT_FIELDS:
  ImportFieldDefinition[] = [
    {
      field: "sku",
      required: true,
    },
    {
      field: "name",
      required: true,
    },
    {
      field: "category",
      required: true,
    },
    {
      field: "supplierSku",
    },
    {
      field: "barcode",
    },
    {
      field: "brand",
    },
    {
      field: "compatibility",
    },
    {
      field: "purchasePrice",
    },
    {
      field: "salePrice",
    },
    {
      field: "quantity",
    },
    {
      field: "minStock",
    },
    {
      field: "supplier",
    },
    {
      field: "location",
    },
    {
      field: "note",
    },
    {
      field: "isActive",
    },
    {
      field: "action",
    },
  ];

const DUPLICATE_ACTIONS:
  InventoryImportDuplicateAction[] =
  [
    "skip",
    "update",
    "add_quantity",
    "replace",
  ];

const statusColor = (
  status:
    InventoryImportRowStatus
):
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default" => {
  switch (status) {
    case "new":
      return "success";

    case "duplicate":
      return "warning";

    case "invalid":
    case "conflict":
    case "file_duplicate":
      return "error";

    default:
      return "default";
  }
};

const rowProblems = (
  row:
    InventoryImportPreviewRow
): string => {
  const errors =
    Object.values(
      row.errors ?? {}
    );

  const warnings =
    row.warnings ?? [];

  return [
    ...errors,
    ...warnings,
  ].join(" · ");
};

const downloadTemplate =
  (): void => {
    const rows = [
      [
        "SKU",
        "Supplier SKU",
        "Barcode",
        "Name",
        "Category",
        "Brand",
        "Compatibility",
        "Purchase Price",
        "Sale Price",
        "Quantity",
        "Minimum Stock",
        "Supplier",
        "Location",
        "Note",
        "Active",
      ],
      [
        "DISPLAY-IP15-OLED",
        "SUP-001",
        "859999000001",
        "iPhone 15 OLED display",
        "Displays",
        "Example",
        "iPhone 15",
        "1200",
        "1800",
        "5",
        "2",
        "Supplier name",
        "A-01",
        "Example row",
        "yes",
      ],
    ];

    const escapeCell = (
      value: string
    ): string =>
      `"${value.replace(
        /"/g,
        "\"\""
      )}"`;

    const csv =
      "\uFEFF" +
      rows
        .map(
          (
            row
          ) =>
            row
              .map(
                escapeCell
              )
              .join(",")
        )
        .join("\r\n");

    const url =
      URL.createObjectURL(
        new Blob(
          [
            csv,
          ],
          {
            type:
              "text/csv;charset=utf-8",
          }
        )
      );

    const anchor =
      document.createElement(
        "a"
      );

    anchor.href = url;
    anchor.download =
      "inventory-import-template.csv";

    document.body.appendChild(
      anchor
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(
      url
    );
  };

const InventoryImportDialog = ({
  open,
  onClose,
  onImported,
}: InventoryImportDialogProps) => {
  const {
    t,
  } = useTranslation();

  const theme =
    useTheme();

  const fullScreen =
    useMediaQuery(
      theme.breakpoints.down(
        "md"
      )
    );

  const fileInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    parsedWorkbook,
    setParsedWorkbook,
  ] = useState<
    ParsedInventoryWorkbook | null
  >(null);

  const [
    sheetName,
    setSheetName,
  ] = useState("");

  const [
    sheetData,
    setSheetData,
  ] = useState<
    InventorySheetData | null
  >(null);

  const [
    mapping,
    setMapping,
  ] = useState<
    InventoryColumnMapping
  >({});

  const [
    importRows,
    setImportRows,
  ] = useState<
    InventoryImportInputRow[]
  >([]);

  const [
    preview,
    setPreview,
  ] = useState<
    InventoryImportPreviewResponse | null
  >(null);

  const [
    duplicateAction,
    setDuplicateAction,
  ] =
    useState<InventoryImportDuplicateAction>(
      "skip"
    );

  const [
    skipInvalid,
    setSkipInvalid,
  ] = useState(false);

  const [
    report,
    setReport,
  ] = useState<
    InventoryImportExecuteResponse | null
  >(null);

  const [
    readingFile,
    setReadingFile,
  ] = useState(false);

  const [
    previewing,
    setPreviewing,
  ] = useState(false);

  const [
    importing,
    setImporting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<
    string | null
  >(null);

  const resetResults =
    (): void => {
      setImportRows([]);
      setPreview(null);
      setReport(null);
      setErrorMessage(null);
    };

  const resetAll =
    (): void => {
      setParsedWorkbook(null);
      setSheetName("");
      setSheetData(null);
      setMapping({});
      setImportRows([]);
      setPreview(null);
      setReport(null);
      setDuplicateAction(
        "skip"
      );
      setSkipInvalid(false);
      setErrorMessage(null);

      if (
        fileInputRef.current
      ) {
        fileInputRef.current
          .value = "";
      }
    };

  const close =
    (): void => {
      if (
        readingFile ||
        previewing ||
        importing
      ) {
        return;
      }

      resetAll();
      onClose();
    };

  const loadSheet =
    async (
      workbook:
        ParsedInventoryWorkbook,
      nextSheetName: string
    ): Promise<void> => {
      const data =
        await extractInventorySheet(
          workbook.workbook,
          nextSheetName
        );

      setSheetName(
        nextSheetName
      );

      setSheetData(
        data
      );

      setMapping(
        autoMapInventoryColumns(
          data.columns
        )
      );

      resetResults();
    };

  const handleFile = async (
    event:
      ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    try {
      setReadingFile(true);
      resetAll();

      const workbook =
        await parseInventoryFile(
          file
        );

      setParsedWorkbook(
        workbook
      );

      await loadSheet(
        workbook,
        workbook.sheetNames[0]
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Inventory file read failed:",
        error
      );

      const code =
        error instanceof Error
          ? error.message
          : "";

      setErrorMessage(
        t(
          code ===
            "UNSUPPORTED_FILE"
            ? "inventoryPage.import.errors.unsupportedFile"
            : code ===
                "EMPTY_WORKBOOK" ||
              code ===
                "EMPTY_SHEET"
              ? "inventoryPage.import.errors.emptyFile"
              : "inventoryPage.import.errors.fileRead"
        )
      );
    } finally {
      setReadingFile(false);
    }
  };

  const handleSheetChange =
    async (
      nextSheetName: string
    ): Promise<void> => {
      if (
        !parsedWorkbook
      ) {
        return;
      }

      try {
        setReadingFile(true);
        setErrorMessage(null);

        await loadSheet(
          parsedWorkbook,
          nextSheetName
        );
      } catch (
        error: unknown
      ) {
        console.error(
          "Inventory sheet read failed:",
          error
        );

        setErrorMessage(
          t(
            "inventoryPage.import.errors.fileRead"
          )
        );
      } finally {
        setReadingFile(false);
      }
    };

  const updateMapping = (
    field:
      InventoryImportField,
    columnId: string
  ): void => {
    setMapping(
      (
        current
      ) => {
        const next = {
          ...current,
        };

        if (columnId) {
          next[field] =
            columnId;
        } else {
          delete next[
            field
          ];
        }

        return next;
      }
    );

    resetResults();
  };

  const missingRequired =
    IMPORT_FIELDS.filter(
      (
        definition
      ) =>
        definition.required &&
        !mapping[
          definition.field
        ]
    ).map(
      (
        definition
      ) =>
        definition.field
    );

  const rowCount =
    sheetData?.rows
      .length ?? 0;

  const tooManyRows =
    rowCount > 1000;

  const canPreview =
    Boolean(
      parsedWorkbook &&
      sheetData &&
      rowCount > 0 &&
      !tooManyRows &&
      missingRequired
        .length === 0 &&
      !readingFile &&
      !previewing &&
      !importing
    );

  const blockingRows =
    preview
      ? preview.summary
          .invalidRows +
        preview.summary
          .conflictRows +
        preview.summary
          .fileDuplicateRows
      : 0;

  const quantityRequired =
    duplicateAction ===
      "add_quantity" ||
    duplicateAction ===
      "replace";

  const canExecute =
    Boolean(
      preview &&
      importRows.length > 0 &&
      (
        blockingRows === 0 ||
        skipInvalid
      ) &&
      (
        !quantityRequired ||
        mapping.quantity
      ) &&
      !previewing &&
      !importing
    );

  const runPreview =
    async (): Promise<void> => {
      if (
        !canPreview ||
        !sheetData ||
        !parsedWorkbook
      ) {
        return;
      }

      const rows =
        buildInventoryImportRows(
          sheetData.rows,
          mapping
        );

      try {
        setPreviewing(true);
        setErrorMessage(null);
        setReport(null);

        const response =
          await previewInventoryImport({
            sourceName:
              `${parsedWorkbook.fileName} · ${sheetName}`,

            rows,
          });

        setImportRows(
          rows
        );

        setPreview(
          response
        );
      } catch (
        error: unknown
      ) {
        console.error(
          "Inventory import preview failed:",
          error
        );

        setErrorMessage(
          getInventoryErrorMessage(
            error,
            t,
            "previewFailed"
          )
        );
      } finally {
        setPreviewing(false);
      }
    };

  const runImport =
    async (): Promise<void> => {
      if (
        !canExecute ||
        !parsedWorkbook
      ) {
        return;
      }

      try {
        setImporting(true);
        setErrorMessage(null);

        const response =
          await executeInventoryImport({
            sourceName:
              `${parsedWorkbook.fileName} · ${sheetName}`,

            duplicateAction,
            skipInvalid,
            rows:
              importRows,
          });

        setReport(
          response
        );

        onImported(
          response
        );
      } catch (
        error: unknown
      ) {
        console.error(
          "Inventory import failed:",
          error
        );

        setErrorMessage(
          getInventoryErrorMessage(
            error,
            t,
            "importFailed"
          )
        );
      } finally {
        setImporting(false);
      }
    };

  const usedColumns =
    useMemo(
      () =>
        new Set(
          Object.values(
            mapping
          ).filter(
            (
              value
            ): value is string =>
              Boolean(
                value
              )
          )
        ),
      [
        mapping,
      ]
    );

  const previewSummary =
    preview
      ? [
          [
            "totalRows",
            preview.summary
              .totalRows,
          ],
          [
            "newRows",
            preview.summary
              .newRows,
          ],
          [
            "duplicateRows",
            preview.summary
              .duplicateRows,
          ],
          [
            "invalidRows",
            preview.summary
              .invalidRows,
          ],
          [
            "conflictRows",
            preview.summary
              .conflictRows,
          ],
          [
            "fileDuplicateRows",
            preview.summary
              .fileDuplicateRows,
          ],
        ] as const
      : [];

  const reportSummary =
    report
      ? [
          [
            "created",
            report.report
              .created,
          ],
          [
            "updated",
            report.report
              .updated,
          ],
          [
            "quantityAdded",
            report.report
              .quantityAdded,
          ],
          [
            "quantityReplaced",
            report.report
              .quantityReplaced,
          ],
          [
            "skipped",
            report.report
              .skipped,
          ],
          [
            "skippedInvalid",
            report.report
              .skippedInvalid,
          ],
          [
            "movementsCreated",
            report.report
              .movementsCreated,
          ],
          [
            "quantityDelta",
            report.report
              .quantityDelta,
          ],
        ] as const
      : [];

  return (
    <Dialog
      open={open}
      onClose={
        close
      }
      maxWidth="xl"
      fullWidth
      fullScreen={
        fullScreen
      }
    >
      <DialogTitle>
        {t(
          "inventoryPage.import.title"
        )}
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={3}
          sx={{
            pt: 1,
          }}
        >
          {errorMessage && (
            <Alert severity="error">
              {errorMessage}
            </Alert>
          )}

          <Paper
            variant="outlined"
            sx={{
              p: 2,
            }}
          >
            <Stack spacing={2}>
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1.5}
                alignItems={{
                  sm: "center",
                }}
              >
                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  hidden
                  onChange={(
                    event
                  ) => {
                    void handleFile(
                      event
                    );
                  }}
                />

                <Button
                  variant="contained"
                  startIcon={
                    readingFile
                      ? (
                          <CircularProgress
                            size={18}
                            color="inherit"
                          />
                        )
                      : (
                          <UploadIcon />
                        )
                  }
                  onClick={() => {
                    fileInputRef
                      .current
                      ?.click();
                  }}
                  disabled={
                    readingFile ||
                    previewing ||
                    importing
                  }
                >
                  {t(
                    parsedWorkbook
                      ? "inventoryPage.import.changeFile"
                      : "inventoryPage.import.chooseFile"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={
                    <DownloadIcon />
                  }
                  onClick={
                    downloadTemplate
                  }
                >
                  {t(
                    "inventoryPage.import.downloadTemplate"
                  )}
                </Button>

                {parsedWorkbook && (
                  <Typography
                    fontWeight={600}
                    sx={{
                      overflowWrap:
                        "anywhere",
                    }}
                  >
                    {
                      parsedWorkbook.fileName
                    }
                  </Typography>
                )}
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {t(
                  "inventoryPage.import.fileHint"
                )}
              </Typography>

              {parsedWorkbook &&
                parsedWorkbook
                  .sheetNames
                  .length > 1 && (
                  <FormControl
                    fullWidth
                    sx={{
                      maxWidth: 420,
                    }}
                  >
                    <InputLabel id="inventory-import-sheet-label">
                      {t(
                        "inventoryPage.import.sheet"
                      )}
                    </InputLabel>

                    <Select
                      labelId="inventory-import-sheet-label"
                      label={t(
                        "inventoryPage.import.sheet"
                      )}
                      value={
                        sheetName
                      }
                      onChange={(
                        event
                      ) => {
                        void handleSheetChange(
                          String(
                            event.target
                              .value
                          )
                        );
                      }}
                    >
                      {parsedWorkbook
                        .sheetNames
                        .map(
                          (
                            name
                          ) => (
                            <MenuItem
                              key={
                                name
                              }
                              value={
                                name
                              }
                            >
                              {
                                name
                              }
                            </MenuItem>
                          )
                        )}
                    </Select>
                  </FormControl>
                )}

              {sheetData && (
                <Alert
                  severity={
                    tooManyRows
                      ? "error"
                      : "info"
                  }
                >
                  {t(
                    "inventoryPage.import.sheetInfo",
                    {
                      header:
                        sheetData.headerRowNumber,
                      rows:
                        rowCount,
                    }
                  )}

                  {tooManyRows &&
                    ` ${t(
                      "inventoryPage.import.errors.tooManyRows"
                    )}`}
                </Alert>
              )}
            </Stack>
          </Paper>

          {sheetData && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
              }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="h6"
                  >
                    {t(
                      "inventoryPage.import.mappingTitle"
                    )}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {t(
                      "inventoryPage.import.mappingHint"
                    )}
                  </Typography>
                </Box>

                {missingRequired
                  .length > 0 && (
                  <Alert severity="warning">
                    {t(
                      "inventoryPage.import.errors.requiredMapping"
                    )}
                  </Alert>
                )}

                <Grid
                  container
                  spacing={2}
                >
                  {IMPORT_FIELDS.map(
                    (
                      definition
                    ) => {
                      const current =
                        mapping[
                          definition.field
                        ] ?? "";

                      return (
                        <Grid
                          key={
                            definition.field
                          }
                          size={{
                            xs: 12,
                            sm: 6,
                            lg: 4,
                          }}
                        >
                          <FormControl
                            fullWidth
                            required={
                              definition.required
                            }
                          >
                            <InputLabel
                              id={`inventory-import-${definition.field}`}
                            >
                              {t(
                                `inventoryPage.import.fields.${definition.field}`
                              )}
                            </InputLabel>

                            <Select
                              labelId={`inventory-import-${definition.field}`}
                              label={t(
                                `inventoryPage.import.fields.${definition.field}`
                              )}
                              value={
                                current
                              }
                              onChange={(
                                event
                              ) => {
                                updateMapping(
                                  definition.field,
                                  String(
                                    event.target
                                      .value
                                  )
                                );
                              }}
                            >
                              <MenuItem value="">
                                {t(
                                  "inventoryPage.import.notMapped"
                                )}
                              </MenuItem>

                              {sheetData.columns.map(
                                (
                                  column
                                ) => (
                                  <MenuItem
                                    key={
                                      column.id
                                    }
                                    value={
                                      column.id
                                    }
                                    disabled={
                                      usedColumns.has(
                                        column.id
                                      ) &&
                                      current !==
                                        column.id
                                    }
                                  >
                                    {
                                      column.label
                                    }
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Grid>
                      );
                    }
                  )}
                </Grid>

                <Box>
                  <Button
                    variant="contained"
                    onClick={() => {
                      void runPreview();
                    }}
                    disabled={
                      !canPreview
                    }
                    startIcon={
                      previewing
                        ? (
                            <CircularProgress
                              size={18}
                              color="inherit"
                            />
                          )
                        : undefined
                    }
                  >
                    {t(
                      previewing
                        ? "inventoryPage.import.previewing"
                        : "inventoryPage.import.preview"
                    )}
                  </Button>
                </Box>
              </Stack>
            </Paper>
          )}

          {preview && (
            <>
              <Divider />

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                  }}
                >
                  {t(
                    "inventoryPage.import.previewTitle"
                  )}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0, 1fr))",
                      md: "repeat(3, minmax(0, 1fr))",
                      xl: "repeat(6, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                  }}
                >
                  {previewSummary.map(
                    (
                      [
                        key,
                        value,
                      ]
                    ) => (
                      <Paper
                        key={
                          key
                        }
                        variant="outlined"
                        sx={{
                          p: 1.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {t(
                            `inventoryPage.import.previewSummary.${key}`
                          )}
                        </Typography>

                        <Typography
                          variant="h6"
                        >
                          {value}
                        </Typography>
                      </Paper>
                    )
                  )}
                </Box>
              </Box>

              <Paper
                variant="outlined"
              >
                <TableContainer
                  sx={{
                    maxHeight: 430,
                  }}
                >
                  <Table
                  stickyHeader
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {t(
                          "inventoryPage.import.columns.row"
                        )}
                      </TableCell>

                      <TableCell>
                        {t(
                          "inventoryPage.import.columns.status"
                        )}
                      </TableCell>

                      <TableCell>
                        SKU
                      </TableCell>

                      <TableCell>
                        {t(
                          "inventoryPage.fields.name"
                        )}
                      </TableCell>

                      <TableCell>
                        {t(
                          "inventoryPage.fields.category"
                        )}
                      </TableCell>

                      <TableCell
                        align="right"
                      >
                        {t(
                          "inventoryPage.import.fields.quantity"
                        )}
                      </TableCell>

                      <TableCell>
                        {t(
                          "inventoryPage.import.columns.match"
                        )}
                      </TableCell>

                      <TableCell>
                        {t(
                          "inventoryPage.import.columns.problems"
                        )}
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {preview.rows.map(
                      (
                        row
                      ) => (
                        <TableRow
                          key={
                            row.rowNumber
                          }
                          hover
                        >
                          <TableCell>
                            {
                              row.rowNumber
                            }
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              color={statusColor(
                                row.status
                              )}
                              label={t(
                                `inventoryPage.import.status.${row.status}`
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            {row.normalized
                              ?.sku ??
                              "-"}
                          </TableCell>

                          <TableCell>
                            {row.normalized
                              ?.name ??
                              "-"}
                          </TableCell>

                          <TableCell>
                            {row.normalized
                              ?.category ??
                              "-"}
                          </TableCell>

                          <TableCell
                            align="right"
                          >
                            {row.normalized
                              ?.quantity ??
                              "-"}
                          </TableCell>

                          <TableCell>
                            {row.existingItem
                              ? `#${row.existingItem.id} — ${row.existingItem.name}`
                              : row.matchedBy
                                  .length > 0
                                ? row.matchedBy.join(
                                    ", "
                                  )
                                : "-"}
                          </TableCell>

                          <TableCell
                            sx={{
                              minWidth: 240,
                              whiteSpace:
                                "normal",
                              overflowWrap:
                                "anywhere",
                            }}
                          >
                            {rowProblems(
                              row
                            ) ||
                              "-"}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                }}
              >
                <Stack spacing={2}>
                  <Typography
                    variant="h6"
                  >
                    {t(
                      "inventoryPage.import.executionTitle"
                    )}
                  </Typography>

                  <FormControl
                    fullWidth
                    sx={{
                      maxWidth: 480,
                    }}
                  >
                    <InputLabel id="inventory-import-duplicate-action">
                      {t(
                        "inventoryPage.import.duplicateAction"
                      )}
                    </InputLabel>

                    <Select
                      labelId="inventory-import-duplicate-action"
                      label={t(
                        "inventoryPage.import.duplicateAction"
                      )}
                      value={
                        duplicateAction
                      }
                      onChange={(
                        event
                      ) => {
                        setDuplicateAction(
                          event.target
                            .value as InventoryImportDuplicateAction
                        );
                      }}
                    >
                      {DUPLICATE_ACTIONS.map(
                        (
                          action
                        ) => (
                          <MenuItem
                            key={
                              action
                            }
                            value={
                              action
                            }
                          >
                            {t(
                              `inventoryPage.import.duplicateActions.${action}`
                            )}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {t(
                      `inventoryPage.import.duplicateHelp.${duplicateAction}`
                    )}
                  </Typography>

                  {quantityRequired &&
                    !mapping.quantity && (
                    <Alert severity="warning">
                      {t(
                        "inventoryPage.import.errors.quantityMappingRequired"
                      )}
                    </Alert>
                  )}

                  {blockingRows > 0 && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            skipInvalid
                          }
                          onChange={(
                            event
                          ) => {
                            setSkipInvalid(
                              event.target
                                .checked
                            );
                          }}
                        />
                      }
                      label={t(
                        "inventoryPage.import.skipInvalid",
                        {
                          count:
                            blockingRows,
                        }
                      )}
                    />
                  )}

                  {blockingRows > 0 &&
                    !skipInvalid && (
                    <Alert severity="warning">
                      {t(
                        "inventoryPage.import.errors.blocked"
                      )}
                    </Alert>
                  )}

                  <Box>
                    <Button
                      variant="contained"
                      color="success"
                      disabled={
                        !canExecute
                      }
                      onClick={() => {
                        void runImport();
                      }}
                      startIcon={
                        importing
                          ? (
                              <CircularProgress
                                size={18}
                                color="inherit"
                              />
                            )
                          : (
                              <UploadIcon />
                            )
                      }
                    >
                      {t(
                        importing
                          ? "inventoryPage.import.importing"
                          : "inventoryPage.import.execute"
                      )}
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            </>
          )}

          {report && (
            <Alert
              severity="success"
              icon={
                <SuccessIcon />
              }
            >
              <Stack spacing={2}>
                <Typography
                  variant="h6"
                >
                  {t(
                    "inventoryPage.import.reportTitle"
                  )}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0, 1fr))",
                      md: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                  }}
                >
                  {reportSummary.map(
                    (
                      [
                        key,
                        value,
                      ]
                    ) => (
                      <Box
                        key={
                          key
                        }
                      >
                        <Typography
                          variant="caption"
                        >
                          {t(
                            `inventoryPage.import.report.${key}`
                          )}
                        </Typography>

                        <Typography
                          variant="h6"
                        >
                          {value}
                        </Typography>
                      </Box>
                    )
                  )}
                </Box>

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={
                    resetAll
                  }
                  sx={{
                    alignSelf:
                      "flex-start",
                  }}
                >
                  {t(
                    "inventoryPage.import.importAnother"
                  )}
                </Button>
              </Stack>
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={
            close
          }
          disabled={
            readingFile ||
            previewing ||
            importing
          }
        >
          {t(
            "common.close"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryImportDialog;
