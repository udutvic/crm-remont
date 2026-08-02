import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  FormEvent,
} from "react";
import {
  EditOutlined as EditIcon,
  HistoryOutlined as HistoryIcon,
  Inventory2Outlined as InventoryIcon,
  RefreshOutlined as RefreshIcon,
  SearchOutlined as SearchIcon,
  SwapVertOutlined as MovementIcon,
  UploadFileOutlined as ImportIcon,
  WarningAmberOutlined as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";
import {
  Link,
} from "react-router";

import PageHeader from "common/components/PageHeader";
import useAuth from "features/auth/context/useAuth";
import getInventoryErrorMessage from "features/inventory/getInventoryErrorMessage";
import InventoryImportDialog from "features/inventory/InventoryImportDialog";
import useAppFormatters from "hooks/useAppFormatters";
import {
  createInventoryItem,
  createInventoryMovement,
  getInventoryItems,
  getInventoryMovements,
  getInventorySummary,
  getOrders,
  updateInventoryItem,
} from "index";
import type {
  InventoryActiveFilter,
  InventoryItem,
  InventoryItemPayload,
  InventoryMovementResponse,
  InventorySummary,
  Order,
  StockMovement,
  StockMovementType,
} from "types";

interface ItemFormState {
  sku: string;
  supplierSku: string;
  barcode: string;
  name: string;
  category: string;
  brand: string;
  compatibility: string;
  purchasePrice: string;
  salePrice: string;
  initialQuantity: string;
  minStock: string;
  supplier: string;
  location: string;
  note: string;
  isActive: boolean;
}

const EMPTY_ITEM_FORM: ItemFormState = {
  sku: "",
  supplierSku: "",
  barcode: "",
  name: "",
  category: "",
  brand: "",
  compatibility: "",
  purchasePrice: "0",
  salePrice: "0",
  initialQuantity: "0",
  minStock: "0",
  supplier: "",
  location: "",
  note: "",
  isActive: true,
};

const EMPTY_SUMMARY: InventorySummary = {
  activeItems: 0,
  totalUnits: 0,
  lowStockItems: 0,
  outOfStockItems: 0,
  purchaseValue: 0,
  saleValue: 0,
};

const movementTypes: StockMovementType[] = [
  "receipt",
  "issue",
  "return",
  "adjustment",
];

const optionalText = (
  value: string
): string | null => {
  const normalized = value.trim();
  return normalized || null;
};

interface ItemDialogProps {
  open: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (
    payload: InventoryItemPayload
  ) => Promise<void>;
}

const ItemDialog = ({
  open,
  item,
  onClose,
  onSave,
}: ItemDialogProps) => {
  const {
    t,
  } = useTranslation();

  const [
    form,
    setForm,
  ] = useState<ItemFormState>(
    EMPTY_ITEM_FORM
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null
  );

  const [
    errors,
    setErrors,
  ] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (!open) {
      return;
    }

    setErrorMessage(null);
    setErrors({});

    if (!item) {
      setForm(
        EMPTY_ITEM_FORM
      );
      return;
    }

    setForm({
      sku: item.sku,
      supplierSku:
        item.supplierSku ?? "",
      barcode:
        item.barcode ?? "",
      name: item.name,
      category: item.category,
      brand:
        item.brand ?? "",
      compatibility:
        item.compatibility ?? "",
      purchasePrice:
        String(
          item.purchasePrice
        ),
      salePrice:
        String(
          item.salePrice
        ),
      initialQuantity: "0",
      minStock:
        String(
          item.minStock
        ),
      supplier:
        item.supplier ?? "",
      location:
        item.location ?? "",
      note:
        item.note ?? "",
      isActive:
        item.isActive,
    });
  }, [
    item,
    open,
  ]);

  const update = (
    field: keyof ItemFormState,
    value: string | boolean
  ): void => {
    setForm(
      (
        current
      ) => ({
        ...current,
        [field]: value,
      })
    );

    setErrors(
      (
        current
      ) => {
        if (
          !current[field]
        ) {
          return current;
        }

        const next = {
          ...current,
        };

        delete next[field];
        return next;
      }
    );
  };

  const validate =
    (): boolean => {
      const next:
        Record<string, string> =
        {};

      if (
        !form.sku.trim()
      ) {
        next.sku =
          t(
            "inventoryPage.validation.required"
          );
      }

      if (
        !form.name.trim()
      ) {
        next.name =
          t(
            "inventoryPage.validation.required"
          );
      }

      if (
        !form.category.trim()
      ) {
        next.category =
          t(
            "inventoryPage.validation.required"
          );
      }

      for (
        const field of [
          "purchasePrice",
          "salePrice",
        ] as const
      ) {
        const value =
          Number(
            form[field]
          );

        if (
          !Number.isFinite(
            value
          ) ||
          value < 0
        ) {
          next[field] =
            t(
              "inventoryPage.validation.price"
            );
        }
      }

      const integerFields:
        Array<
          keyof ItemFormState
        > = [
          "minStock",
          ...(!item
            ? [
                "initialQuantity" as const,
              ]
            : []),
        ];

      for (
        const field of
        integerFields
      ) {
        const value =
          Number(
            form[field]
          );

        if (
          !Number.isInteger(
            value
          ) ||
          value < 0
        ) {
          next[field] =
            t(
              "inventoryPage.validation.quantity"
            );
        }
      }

      setErrors(next);

      return (
        Object.keys(
          next
        ).length === 0
      );
    };

  const submit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (
      saving ||
      !validate()
    ) {
      return;
    }

    const payload:
      InventoryItemPayload = {
      sku:
        form.sku.trim(),
      supplierSku:
        optionalText(
          form.supplierSku
        ),
      barcode:
        optionalText(
          form.barcode
        ),
      name:
        form.name.trim(),
      category:
        form.category.trim(),
      brand:
        optionalText(
          form.brand
        ),
      compatibility:
        optionalText(
          form.compatibility
        ),
      purchasePrice:
        Number(
          form.purchasePrice
        ),
      salePrice:
        Number(
          form.salePrice
        ),
      minStock:
        Number(
          form.minStock
        ),
      supplier:
        optionalText(
          form.supplier
        ),
      location:
        optionalText(
          form.location
        ),
      note:
        optionalText(
          form.note
        ),
      isActive:
        form.isActive,
      ...(!item
        ? {
            initialQuantity:
              Number(
                form.initialQuantity
              ),
          }
        : {}),
    };

    try {
      setSaving(true);
      setErrorMessage(null);
      await onSave(payload);
    } catch (
      error: unknown
    ) {
      console.error(
        "Inventory item save failed:",
        error
      );

      setErrorMessage(
        getInventoryErrorMessage(
          error,
          t,
          "saveFailed"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const field = (
    key: keyof ItemFormState,
    label: string,
    options?: {
      type?: string;
      multiline?: boolean;
      minRows?: number;
      required?: boolean;
    }
  ) => (
    <TextField
      label={label}
      value={
        String(
          form[key]
        )
      }
      onChange={(
        event
      ) => {
        update(
          key,
          event.target.value
        );
      }}
      type={
        options?.type
      }
      multiline={
        options?.multiline
      }
      minRows={
        options?.minRows
      }
      required={
        options?.required
      }
      error={Boolean(
        errors[key]
      )}
      helperText={
        errors[key]
      }
      inputProps={
        options?.type ===
        "number"
          ? {
              min: 0,
              step:
                key ===
                  "purchasePrice" ||
                key ===
                  "salePrice"
                  ? "0.01"
                  : 1,
            }
          : undefined
      }
      fullWidth
    />
  );

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!saving) {
          onClose();
        }
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {t(
          item
            ? "inventoryPage.itemDialog.edit"
            : "inventoryPage.itemDialog.add"
        )}
      </DialogTitle>

      <form
        onSubmit={
          submit
        }
        noValidate
      >
        <DialogContent>
          <Stack spacing={2}>
            {errorMessage && (
              <Alert severity="error">
                {errorMessage}
              </Alert>
            )}

            {item && (
              <Alert severity="info">
                {t(
                  "inventoryPage.itemDialog.current",
                  {
                    quantity:
                      item.currentQuantity,
                  }
                )}
              </Alert>
            )}

            <Grid
              container
              spacing={2}
            >
              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                {field(
                  "sku",
                  t(
                    "inventoryPage.fields.sku"
                  ),
                  {
                    required: true,
                  }
                )}
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                {field(
                  "supplierSku",
                  t(
                    "inventoryPage.fields.supplierSku"
                  )
                )}
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                {field(
                  "barcode",
                  t(
                    "inventoryPage.fields.barcode"
                  )
                )}
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 8,
                }}
              >
                {field(
                  "name",
                  t(
                    "inventoryPage.fields.name"
                  ),
                  {
                    required: true,
                  }
                )}
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                {field(
                  "category",
                  t(
                    "inventoryPage.fields.category"
                  ),
                  {
                    required: true,
                  }
                )}
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                {field(
                  "brand",
                  t(
                    "inventoryPage.fields.brand"
                  )
                )}
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 8,
                }}
              >
                {field(
                  "compatibility",
                  t(
                    "inventoryPage.fields.compatibility"
                  ),
                  {
                    multiline: true,
                    minRows: 2,
                  }
                )}
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                {field(
                  "purchasePrice",
                  t(
                    "inventoryPage.fields.purchasePrice"
                  ),
                  {
                    type: "number",
                  }
                )}
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                {field(
                  "salePrice",
                  t(
                    "inventoryPage.fields.salePrice"
                  ),
                  {
                    type: "number",
                  }
                )}
              </Grid>

              {!item && (
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3,
                  }}
                >
                  {field(
                    "initialQuantity",
                    t(
                      "inventoryPage.fields.initialQuantity"
                    ),
                    {
                      type: "number",
                    }
                  )}
                </Grid>
              )}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                {field(
                  "minStock",
                  t(
                    "inventoryPage.fields.minStock"
                  ),
                  {
                    type: "number",
                  }
                )}
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                {field(
                  "supplier",
                  t(
                    "inventoryPage.fields.supplier"
                  )
                )}
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                {field(
                  "location",
                  t(
                    "inventoryPage.fields.location"
                  )
                )}
              </Grid>

              <Grid
                size={{
                  xs: 12,
                }}
              >
                {field(
                  "note",
                  t(
                    "inventoryPage.fields.note"
                  ),
                  {
                    multiline: true,
                    minRows: 3,
                  }
                )}
              </Grid>

              <Grid
                size={{
                  xs: 12,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        form.isActive
                      }
                      onChange={(
                        event
                      ) => {
                        update(
                          "isActive",
                          event.target.checked
                        );
                      }}
                    />
                  }
                  label={t(
                    "inventoryPage.fields.active"
                  )}
                />
              </Grid>
            </Grid>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {t(
                "inventoryPage.itemDialog.quantityHint"
              )}
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              onClose
            }
            disabled={
              saving
            }
          >
            {t(
              "common.cancel"
            )}
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={
              saving
            }
          >
            {t(
              saving
                ? "inventoryPage.saving"
                : "common.save"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

interface MovementDialogProps {
  item: InventoryItem | null;
  onClose: () => void;
  onSaved: (
    response:
      InventoryMovementResponse
  ) => void;
}

const MovementDialog = ({
  item,
  onClose,
  onSaved,
}: MovementDialogProps) => {
  const {
    t,
  } = useTranslation();

  const [
    type,
    setType,
  ] = useState<StockMovementType>(
    "receipt"
  );

  const [
    quantity,
    setQuantity,
  ] = useState("1");

  const [
    unitCost,
    setUnitCost,
  ] = useState("");

  const [
    orderId,
    setOrderId,
  ] = useState("");

  const [
    note,
    setNote,
  ] = useState("");

  const [
    orders,
    setOrders,
  ] = useState<Order[]>([]);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    loadingOrders,
    setLoadingOrders,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!item) {
      return;
    }

    setType("receipt");
    setQuantity("1");
    setUnitCost(
      item.purchasePrice
        ? String(
            item.purchasePrice
          )
        : ""
    );
    setOrderId("");
    setNote("");
    setErrorMessage(null);

    let active = true;

    const load =
      async (): Promise<void> => {
        try {
          setLoadingOrders(
            true
          );

          const data =
            await getOrders();

          if (active) {
            setOrders(data);
          }
        } catch (
          error: unknown
        ) {
          if (active) {
            setErrorMessage(
              getInventoryErrorMessage(
                error,
                t,
                "ordersFailed"
              )
            );
          }
        } finally {
          if (active) {
            setLoadingOrders(
              false
            );
          }
        }
      };

    void load();

    return () => {
      active = false;
    };
  }, [
    item,
    t,
  ]);

  const numericQuantity =
    Number(quantity);

  const delta =
    useMemo(() => {
      if (
        !Number.isInteger(
          numericQuantity
        ) ||
        numericQuantity === 0
      ) {
        return 0;
      }

      if (
        type === "issue"
      ) {
        return -Math.abs(
          numericQuantity
        );
      }

      if (
        type ===
        "adjustment"
      ) {
        return numericQuantity;
      }

      return Math.abs(
        numericQuantity
      );
    }, [
      numericQuantity,
      type,
    ]);

  const projected =
    item
      ? item.currentQuantity +
        delta
      : 0;

  const orderRequired =
    type === "issue" ||
    type === "return";

  const validQuantity =
    Number.isInteger(
      numericQuantity
    ) &&
    numericQuantity !== 0 &&
    (
      type ===
        "adjustment" ||
      numericQuantity > 0
    );

  const canSave =
    Boolean(
      item?.id &&
      item.isActive &&
      validQuantity &&
      projected >= 0 &&
      (
        !orderRequired ||
        orderId
      ) &&
      !saving
    );

  const save =
    async (): Promise<void> => {
      if (
        !item?.id ||
        !canSave
      ) {
        return;
      }

      try {
        setSaving(true);
        setErrorMessage(null);

        const response =
          await createInventoryMovement(
            item.id,
            {
              type,
              quantity:
                numericQuantity,
              unitCost:
                unitCost.trim()
                  ? Number(
                      unitCost
                    )
                  : null,
              orderId:
                orderId
                  ? Number(
                      orderId
                    )
                  : null,
              note:
                optionalText(
                  note
                ),
            }
          );

        onSaved(response);
      } catch (
        error: unknown
      ) {
        setErrorMessage(
          getInventoryErrorMessage(
            error,
            t,
            "movementFailed"
          )
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <Dialog
      open={Boolean(
        item
      )}
      onClose={() => {
        if (!saving) {
          onClose();
        }
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {t(
          "inventoryPage.movement.title"
        )}
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={2}
          sx={{
            pt: 1,
          }}
        >
          {errorMessage && (
            <Alert severity="error">
              {errorMessage}
            </Alert>
          )}

          {item && (
            <Alert
              severity={
                projected >= 0
                  ? "info"
                  : "error"
              }
            >
              <Typography
                fontWeight={700}
              >
                {item.name}
              </Typography>

              {t(
                "inventoryPage.movement.balance",
                {
                  current:
                    item.currentQuantity,
                  projected,
                }
              )}
            </Alert>
          )}

          <FormControl
            fullWidth
          >
            <InputLabel id="stock-movement-type">
              {t(
                "inventoryPage.movement.type"
              )}
            </InputLabel>

            <Select
              labelId="stock-movement-type"
              label={t(
                "inventoryPage.movement.type"
              )}
              value={type}
              onChange={(
                event
              ) => {
                const next =
                  event.target
                    .value as StockMovementType;

                setType(next);

                if (
                  next !== "issue" &&
                  next !== "return"
                ) {
                  setOrderId("");
                }
              }}
            >
              {movementTypes.map(
                (
                  value
                ) => (
                  <MenuItem
                    key={value}
                    value={value}
                  >
                    {t(
                      `inventoryPage.movementTypes.${value}`
                    )}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <TextField
            label={t(
              "inventoryPage.movement.quantity"
            )}
            value={
              quantity
            }
            onChange={(
              event
            ) => {
              setQuantity(
                event.target.value
              );
            }}
            type="number"
            error={
              !validQuantity ||
              projected < 0
            }
            helperText={
              projected < 0
                ? t(
                    "inventoryPage.validation.stock"
                  )
                : type ===
                    "adjustment"
                  ? t(
                      "inventoryPage.movement.adjustmentHint"
                    )
                  : undefined
            }
            fullWidth
          />

          {(type ===
            "receipt" ||
            type ===
              "adjustment") && (
            <TextField
              label={t(
                "inventoryPage.movement.unitCost"
              )}
              value={
                unitCost
              }
              onChange={(
                event
              ) => {
                setUnitCost(
                  event.target.value
                );
              }}
              type="number"
              inputProps={{
                min: 0,
                step: "0.01",
              }}
              fullWidth
            />
          )}

          {orderRequired && (
            <FormControl
              fullWidth
            >
              <InputLabel id="stock-movement-order">
                {t(
                  "inventoryPage.movement.order"
                )}
              </InputLabel>

              <Select
                labelId="stock-movement-order"
                label={t(
                  "inventoryPage.movement.order"
                )}
                value={
                  orderId
                }
                onChange={(
                  event
                ) => {
                  setOrderId(
                    String(
                      event.target.value
                    )
                  );
                }}
                disabled={
                  loadingOrders
                }
              >
                {orders.length ===
                0 ? (
                  <MenuItem
                    disabled
                  >
                    {t(
                      loadingOrders
                        ? "inventoryPage.movement.loadingOrders"
                        : "inventoryPage.movement.noOrders"
                    )}
                  </MenuItem>
                ) : (
                  orders.map(
                    (
                      order
                    ) => (
                      <MenuItem
                        key={
                          order.id
                        }
                        value={
                          String(
                            order.id
                          )
                        }
                      >
                        #
                        {String(
                          order.id
                        ).padStart(
                          6,
                          "0"
                        )}
                        {" — "}
                        {order.device
                          ?.brand}
                        {" "}
                        {order.device
                          ?.model}
                      </MenuItem>
                    )
                  )
                )}
              </Select>
            </FormControl>
          )}

          <TextField
            label={t(
              "inventoryPage.fields.note"
            )}
            value={note}
            onChange={(
              event
            ) => {
              setNote(
                event.target.value
              );
            }}
            multiline
            minRows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={
            onClose
          }
          disabled={
            saving
          }
        >
          {t(
            "common.cancel"
          )}
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            void save();
          }}
          disabled={
            !canSave
          }
        >
          {t(
            saving
              ? "inventoryPage.saving"
              : "inventoryPage.movement.save"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


interface HistoryDialogProps {
  item: InventoryItem | null;
  onClose: () => void;
}

const HistoryDialog = ({
  item,
  onClose,
}: HistoryDialogProps) => {
  const {
    t,
  } = useTranslation();

  const {
    formatDateTime,
  } = useAppFormatters();

  const [
    movements,
    setMovements,
  ] = useState<
    StockMovement[]
  >([]);

  const [
    page,
    setPage,
  ] = useState(0);

  const [
    pageSize,
    setPageSize,
  ] = useState(10);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null
  );

  const load =
    useCallback(
      async (): Promise<void> => {
        if (!item?.id) {
          return;
        }

        try {
          setLoading(true);
          setErrorMessage(null);

          const response =
            await getInventoryMovements(
              item.id,
              {
                page:
                  page + 1,
                pageSize,
              }
            );

          setMovements(
            response.movements
          );

          setTotal(
            response.pagination
              .total
          );
        } catch (
          error: unknown
        ) {
          setErrorMessage(
            getInventoryErrorMessage(
              error,
              t,
              "historyFailed"
            )
          );
        } finally {
          setLoading(false);
        }
      },
      [
        item?.id,
        page,
        pageSize,
        t,
      ]
    );

  useEffect(() => {
    if (item) {
      setPage(0);
    }
  }, [
    item,
  ]);

  useEffect(() => {
    void load();
  }, [
    load,
  ]);

  const movementColor = (
    type: StockMovementType
  ):
    | "success"
    | "error"
    | "info"
    | "warning" => {
    switch (type) {
      case "receipt":
        return "success";
      case "issue":
        return "error";
      case "return":
        return "info";
      case "adjustment":
        return "warning";
    }
  };

  return (
    <Dialog
      open={Boolean(
        item
      )}
      onClose={
        onClose
      }
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        {t(
          "inventoryPage.history.title",
          {
            name:
              item?.name ??
              "",
          }
        )}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {errorMessage && (
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    void load();
                  }}
                >
                  {t(
                    "inventoryPage.refresh"
                  )}
                </Button>
              }
            >
              {errorMessage}
            </Alert>
          )}

          {loading ? (
            <Box
              sx={{
                minHeight: 220,
                display: "grid",
                placeItems:
                  "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : movements.length ===
            0 ? (
            <Typography
              color="text.secondary"
              sx={{
                py: 4,
                textAlign:
                  "center",
              }}
            >
              {t(
                "inventoryPage.history.empty"
              )}
            </Typography>
          ) : (
            <TableContainer>
              <Table
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t(
                        "inventoryPage.history.date"
                      )}
                    </TableCell>

                    <TableCell>
                      {t(
                        "inventoryPage.history.type"
                      )}
                    </TableCell>

                    <TableCell
                      align="right"
                    >
                      {t(
                        "inventoryPage.history.change"
                      )}
                    </TableCell>

                    <TableCell>
                      {t(
                        "inventoryPage.history.balance"
                      )}
                    </TableCell>

                    <TableCell>
                      {t(
                        "inventoryPage.history.order"
                      )}
                    </TableCell>

                    <TableCell>
                      {t(
                        "inventoryPage.history.user"
                      )}
                    </TableCell>

                    <TableCell>
                      {t(
                        "inventoryPage.fields.note"
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {movements.map(
                    (
                      movement
                    ) => (
                      <TableRow
                        key={
                          movement.id
                        }
                        hover
                      >
                        <TableCell>
                          {formatDateTime(
                            movement.createdAt
                          )}
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            color={movementColor(
                              movement.type
                            )}
                            label={t(
                              `inventoryPage.movementTypes.${movement.type}`
                            )}
                          />
                        </TableCell>

                        <TableCell
                          align="right"
                        >
                          <Typography
                            fontWeight={700}
                            color={
                              movement.quantityChange >
                              0
                                ? "success.main"
                                : "error.main"
                            }
                          >
                            {movement.quantityChange >
                            0
                              ? `+${movement.quantityChange}`
                              : movement.quantityChange}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {
                            movement.balanceBefore
                          }
                          {" → "}
                          {
                            movement.balanceAfter
                          }
                        </TableCell>

                        <TableCell>
                          {movement.orderId ? (
                            <Button
                              component={
                                Link
                              }
                              to={`/orders/${movement.orderId}`}
                              size="small"
                            >
                              #
                              {String(
                                movement.orderId
                              ).padStart(
                                6,
                                "0"
                              )}
                            </Button>
                          ) : (
                            "-"
                          )}
                        </TableCell>

                        <TableCell>
                          {movement.createdBy
                            ?.name ??
                            "-"}
                        </TableCell>

                        <TableCell
                          sx={{
                            maxWidth: 260,
                            whiteSpace:
                              "pre-wrap",
                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          {movement.note ??
                            "-"}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(
              _event,
              nextPage
            ) => {
              setPage(
                nextPage
              );
            }}
            rowsPerPage={
              pageSize
            }
            onRowsPerPageChange={(
              event
            ) => {
              setPageSize(
                Number(
                  event.target.value
                )
              );
              setPage(0);
            }}
            rowsPerPageOptions={[
              10,
              25,
              50,
            ]}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={
            onClose
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

const InventoryPage = () => {
  const {
    t,
  } = useTranslation();

  const {
    user,
  } = useAuth();

  const {
    formatPrice,
  } = useAppFormatters();

  const theme =
    useTheme();

  const desktop =
    useMediaQuery(
      theme.breakpoints.up(
        "md"
      )
    );

  const [
    summary,
    setSummary,
  ] = useState<
    InventorySummary
  >(
    EMPTY_SUMMARY
  );

  const [
    items,
    setItems,
  ] = useState<
    InventoryItem[]
  >([]);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    page,
    setPage,
  ] = useState(0);

  const [
    pageSize,
    setPageSize,
  ] = useState(25);

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    categoryInput,
    setCategoryInput,
  ] = useState("");

  const [
    categoryQuery,
    setCategoryQuery,
  ] = useState("");

  const [
    lowStock,
    setLowStock,
  ] = useState(false);

  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<InventoryActiveFilter>(
      "active"
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null
  );

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(
    null
  );

  const [
    reloadKey,
    setReloadKey,
  ] = useState(0);

  const [
    itemOpen,
    setItemOpen,
  ] = useState(false);

  const [
    importOpen,
    setImportOpen,
  ] = useState(false);

  const [
    editTarget,
    setEditTarget,
  ] = useState<
    InventoryItem | null
  >(null);

  const [
    movementTarget,
    setMovementTarget,
  ] = useState<
    InventoryItem | null
  >(null);

  const [
    historyTarget,
    setHistoryTarget,
  ] = useState<
    InventoryItem | null
  >(null);

  const isAdmin =
    user?.role === "admin";

  useEffect(() => {
    const timeout =
      window.setTimeout(
        () => {
          setSearchQuery(
            searchInput.trim()
          );

          setCategoryQuery(
            categoryInput.trim()
          );

          setPage(0);
        },
        350
      );

    return () => {
      window.clearTimeout(
        timeout
      );
    };
  }, [
    categoryInput,
    searchInput,
  ]);

  const load =
    useCallback(
      async (): Promise<void> => {
        void reloadKey;

        try {
          setLoading(true);
          setErrorMessage(null);

          const [
            nextSummary,
            response,
          ] =
            await Promise.all([
              getInventorySummary(),
              getInventoryItems({
                page:
                  page + 1,
                pageSize,
                q:
                  searchQuery ||
                  undefined,
                category:
                  categoryQuery ||
                  undefined,
                lowStock:
                  lowStock ||
                  undefined,
                active:
                  activeFilter ===
                  "all"
                    ? undefined
                    : activeFilter ===
                      "active",
              }),
            ]);

          const maxPage =
            Math.max(
              0,
              response.pagination
                .totalPages - 1
            );

          if (
            page >
            maxPage
          ) {
            setPage(
              maxPage
            );
            return;
          }

          setSummary(
            nextSummary
          );
          setItems(
            response.items
          );
          setTotal(
            response.pagination
              .total
          );
        } catch (
          error: unknown
        ) {
          setErrorMessage(
            getInventoryErrorMessage(
              error,
              t,
              "loadFailed"
            )
          );
        } finally {
          setLoading(false);
        }
      },
      [
        activeFilter,
        categoryQuery,
        lowStock,
        page,
        pageSize,
        reloadKey,
        searchQuery,
        t,
      ]
    );

  useEffect(() => {
    void load();
  }, [
    load,
  ]);

  const reload =
    (): void => {
      setReloadKey(
        (
          current
        ) =>
          current + 1
      );
    };

  const saveItem =
    async (
      payload:
        InventoryItemPayload
    ): Promise<void> => {
      if (
        editTarget?.id
      ) {
        await updateInventoryItem(
          editTarget.id,
          payload
        );

        setSuccessMessage(
          t(
            "inventoryPage.messages.updated"
          )
        );
      } else {
        await createInventoryItem(
          payload
        );

        setSuccessMessage(
          t(
            "inventoryPage.messages.created"
          )
        );
      }

      setItemOpen(false);
      setEditTarget(null);
      reload();
    };

  const movementSaved = (
    response:
      InventoryMovementResponse
  ): void => {
    setMovementTarget(null);

    setSuccessMessage(
      t(
        "inventoryPage.messages.movement",
        {
          type:
            t(
              `inventoryPage.movementTypes.${response.movement.type}`
            ),
        }
      )
    );

    reload();
  };

  const clearFilters =
    (): void => {
      setSearchInput("");
      setSearchQuery("");
      setCategoryInput("");
      setCategoryQuery("");
      setLowStock(false);
      setActiveFilter(
        "active"
      );
      setPage(0);
    };

  const stockState = (
    item: InventoryItem
  ): {
    label: string;
    color:
      | "default"
      | "success"
      | "warning"
      | "error";
  } => {
    if (!item.isActive) {
      return {
        label:
          t(
            "inventoryPage.stock.inactive"
          ),
        color: "default",
      };
    }

    if (
      item.currentQuantity ===
      0
    ) {
      return {
        label:
          t(
            "inventoryPage.stock.out"
          ),
        color: "error",
      };
    }

    if (
      item.isLowStock
    ) {
      return {
        label:
          t(
            "inventoryPage.stock.low"
          ),
        color: "warning",
      };
    }

    return {
      label:
        t(
          "inventoryPage.stock.ok"
        ),
      color: "success",
    };
  };

  const actions = (
    item: InventoryItem
  ) => (
    <Stack
      direction="row"
      spacing={0.5}
      justifyContent="flex-end"
    >
      <Tooltip
        title={t(
          "inventoryPage.actions.movement"
        )}
      >
        <span>
          <IconButton
            color="primary"
            disabled={
              !item.isActive
            }
            onClick={() => {
              setMovementTarget(
                item
              );
            }}
          >
            <MovementIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip
        title={t(
          "inventoryPage.actions.history"
        )}
      >
        <IconButton
          onClick={() => {
            setHistoryTarget(
              item
            );
          }}
        >
          <HistoryIcon />
        </IconButton>
      </Tooltip>

      {isAdmin && (
        <Tooltip
          title={t(
            "inventoryPage.actions.edit"
          )}
        >
          <IconButton
            color="success"
            onClick={() => {
              setEditTarget(
                item
              );
              setItemOpen(
                true
              );
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );

  const summaryCards = [
    [
      t(
        "inventoryPage.summary.active"
      ),
      summary.activeItems,
      "active",
    ],
    [
      t(
        "inventoryPage.summary.units"
      ),
      summary.totalUnits,
      "units",
    ],
    [
      t(
        "inventoryPage.summary.low"
      ),
      summary.lowStockItems,
      "low",
    ],
    [
      t(
        "inventoryPage.summary.out"
      ),
      summary.outOfStockItems,
      "out",
    ],
    [
      t(
        "inventoryPage.summary.purchase"
      ),
      formatPrice(
        summary.purchaseValue
      ),
      "purchase",
    ],
    [
      t(
        "inventoryPage.summary.sale"
      ),
      formatPrice(
        summary.saleValue
      ),
      "sale",
    ],
  ] as const;

  return (
    <Container
      maxWidth="xl"
      sx={{
        pb: 4,
      }}
    >
      <PageHeader
        title={t(
          "inventoryPage.title"
        )}
        onAddClick={
          isAdmin
            ? () => {
                setEditTarget(
                  null
                );
                setItemOpen(
                  true
                );
              }
            : undefined
        }
        addButtonText={
          isAdmin
            ? t(
                "inventoryPage.add"
              )
            : undefined
        }
      />

      {isAdmin && (
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "flex-end",
            mb: 3,
            mt: {
              xs: -1,
              sm: -2,
            },
          }}
        >
          <Button
            variant="outlined"
            startIcon={
              <ImportIcon />
            }
            fullWidth={
              !desktop
            }
            onClick={() => {
              setImportOpen(
                true
              );
            }}
          >
            {t(
              "inventoryPage.import.open"
            )}
          </Button>
        </Box>
      )}

      <Stack spacing={3}>
        {errorMessage && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={
                  reload
                }
              >
                {t(
                  "inventoryPage.refresh"
                )}
              </Button>
            }
          >
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert
            severity="success"
            onClose={() => {
              setSuccessMessage(
                null
              );
            }}
          >
            {successMessage}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm:
                "repeat(2, minmax(0, 1fr))",
              lg:
                "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {summaryCards.map(
            (
              [
                label,
                value,
                key,
              ]
            ) => (
              <Card
                key={key}
                variant="outlined"
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {label}
                      </Typography>

                      <Typography
                        variant="h5"
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        {value}
                      </Typography>
                    </Box>

                    {key ===
                      "active" && (
                      <InventoryIcon
                        color="primary"
                      />
                    )}

                    {key ===
                      "low" &&
                      summary.lowStockItems >
                        0 && (
                        <WarningIcon
                          color="warning"
                        />
                      )}
                  </Stack>
                </CardContent>
              </Card>
            )
          )}
        </Box>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md:
                  "minmax(260px, 2fr) minmax(180px, 1fr) minmax(170px, .8fr) minmax(170px, .8fr) auto",
              },
              gap: 2,
              alignItems:
                "center",
            }}
          >
            <TextField
              label={t(
                "inventoryPage.filters.search"
              )}
              value={
                searchInput
              }
              onChange={(
                event
              ) => {
                setSearchInput(
                  event.target.value
                );
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />

            <TextField
              label={t(
                "inventoryPage.fields.category"
              )}
              value={
                categoryInput
              }
              onChange={(
                event
              ) => {
                setCategoryInput(
                  event.target.value
                );
              }}
              fullWidth
            />

            <FormControl
              fullWidth
            >
              <InputLabel id="inventory-stock-filter">
                {t(
                  "inventoryPage.filters.stock"
                )}
              </InputLabel>

              <Select
                labelId="inventory-stock-filter"
                label={t(
                  "inventoryPage.filters.stock"
                )}
                value={
                  lowStock
                    ? "low"
                    : "all"
                }
                onChange={(
                  event
                ) => {
                  setLowStock(
                    event.target.value ===
                      "low"
                  );
                  setPage(0);
                }}
              >
                <MenuItem value="all">
                  {t(
                    "inventoryPage.filters.allStock"
                  )}
                </MenuItem>

                <MenuItem value="low">
                  {t(
                    "inventoryPage.filters.lowOnly"
                  )}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
            >
              <InputLabel id="inventory-active-filter">
                {t(
                  "inventoryPage.filters.status"
                )}
              </InputLabel>

              <Select
                labelId="inventory-active-filter"
                label={t(
                  "inventoryPage.filters.status"
                )}
                value={
                  activeFilter
                }
                onChange={(
                  event
                ) => {
                  setActiveFilter(
                    event.target.value as InventoryActiveFilter
                  );
                  setPage(0);
                }}
              >
                <MenuItem value="active">
                  {t(
                    "inventoryPage.filters.active"
                  )}
                </MenuItem>

                <MenuItem value="inactive">
                  {t(
                    "inventoryPage.filters.inactive"
                  )}
                </MenuItem>

                <MenuItem value="all">
                  {t(
                    "inventoryPage.filters.all"
                  )}
                </MenuItem>
              </Select>
            </FormControl>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1}
            >
              <Button
                variant="outlined"
                startIcon={
                  <RefreshIcon />
                }
                onClick={
                  reload
                }
              >
                {t(
                  "inventoryPage.refresh"
                )}
              </Button>

              <Button
                onClick={
                  clearFilters
                }
              >
                {t(
                  "inventoryPage.clear"
                )}
              </Button>
            </Stack>
          </Box>
        </Paper>

        {loading ? (
          <Box
            sx={{
              minHeight: 320,
              display: "grid",
              placeItems:
                "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : items.length ===
          0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 5,
              textAlign:
                "center",
            }}
          >
            <Typography
              color="text.secondary"
            >
              {t(
                "inventoryPage.empty"
              )}
            </Typography>
          </Paper>
        ) : desktop ? (
          <Paper
            variant="outlined"
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t(
                        "inventoryPage.table.item"
                      )}
                    </TableCell>

                    <TableCell>
                      {t(
                        "inventoryPage.fields.sku"
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
                        "inventoryPage.fields.purchasePrice"
                      )}
                    </TableCell>

                    <TableCell
                      align="right"
                    >
                      {t(
                        "inventoryPage.fields.salePrice"
                      )}
                    </TableCell>

                    <TableCell>
                      {t(
                        "inventoryPage.table.stock"
                      )}
                    </TableCell>

                    <TableCell>
                      {t(
                        "inventoryPage.fields.location"
                      )}
                    </TableCell>

                    <TableCell
                      align="right"
                    >
                      {t(
                        "inventoryPage.table.actions"
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map(
                    (
                      item
                    ) => {
                      const state =
                        stockState(
                          item
                        );

                      return (
                        <TableRow
                          key={
                            item.id
                          }
                          hover
                        >
                          <TableCell>
                            <Typography
                              fontWeight={600}
                            >
                              {item.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                maxWidth: 320,
                                overflowWrap:
                                  "anywhere",
                              }}
                            >
                              {[
                                item.brand,
                                item.compatibility,
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  " • "
                                ) ||
                                "-"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              component="code"
                            >
                              {item.sku}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            {item.category}
                          </TableCell>

                          <TableCell
                            align="right"
                          >
                            {formatPrice(
                              item.purchasePrice
                            )}
                          </TableCell>

                          <TableCell
                            align="right"
                          >
                            {formatPrice(
                              item.salePrice
                            )}
                          </TableCell>

                          <TableCell>
                            <Stack
                              spacing={0.5}
                              alignItems="flex-start"
                            >
                              <Typography
                                fontWeight={700}
                              >
                                {
                                  item.currentQuantity
                                }
                                {" / "}
                                {
                                  item.minStock
                                }
                              </Typography>

                              <Chip
                                size="small"
                                color={
                                  state.color
                                }
                                label={
                                  state.label
                                }
                              />
                            </Stack>
                          </TableCell>

                          <TableCell>
                            {item.location ??
                              "-"}
                          </TableCell>

                          <TableCell
                            align="right"
                          >
                            {actions(
                              item
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {items.map(
              (
                item
              ) => {
                const state =
                  stockState(
                    item
                  );

                return (
                  <Card
                    key={
                      item.id
                    }
                    variant="outlined"
                  >
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={1}
                        >
                          <Box>
                            <Typography
                              fontWeight={700}
                            >
                              {item.name}
                            </Typography>

                            <Typography
                              component="code"
                              variant="body2"
                              color="text.secondary"
                            >
                              {item.sku}
                            </Typography>
                          </Box>

                          <Chip
                            size="small"
                            color={
                              state.color
                            }
                            label={
                              state.label
                            }
                          />
                        </Stack>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {[
                            item.category,
                            item.brand,
                            item.compatibility,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              " • "
                            )}
                        </Typography>

                        <Box
                          sx={{
                            display:
                              "grid",
                            gridTemplateColumns:
                              "repeat(2, minmax(0, 1fr))",
                            gap: 1.5,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {t(
                                "inventoryPage.table.stock"
                              )}
                            </Typography>

                            <Typography
                              fontWeight={700}
                            >
                              {
                                item.currentQuantity
                              }
                              {" / "}
                              {
                                item.minStock
                              }
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {t(
                                "inventoryPage.fields.salePrice"
                              )}
                            </Typography>

                            <Typography
                              fontWeight={700}
                            >
                              {formatPrice(
                                item.salePrice
                              )}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {t(
                                "inventoryPage.fields.location"
                              )}
                            </Typography>

                            <Typography>
                              {item.location ??
                                "-"}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {t(
                                "inventoryPage.fields.supplier"
                              )}
                            </Typography>

                            <Typography>
                              {item.supplier ??
                                "-"}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>

                    <CardActions
                      sx={{
                        justifyContent:
                          "flex-end",
                      }}
                    >
                      {actions(
                        item
                      )}
                    </CardActions>
                  </Card>
                );
              }
            )}
          </Stack>
        )}

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(
            _event,
            nextPage
          ) => {
            setPage(
              nextPage
            );
          }}
          rowsPerPage={
            pageSize
          }
          onRowsPerPageChange={(
            event
          ) => {
            setPageSize(
              Number(
                event.target.value
              )
            );
            setPage(0);
          }}
          rowsPerPageOptions={[
            10,
            25,
            50,
            100,
          ]}
        />
      </Stack>

      <InventoryImportDialog
        open={importOpen}
        onClose={() => {
          setImportOpen(
            false
          );
        }}
        onImported={(
          response
        ) => {
          setSuccessMessage(
            t(
              "inventoryPage.import.completedMessage",
              {
                created:
                  response.report
                    .created,
                updated:
                  response.report
                    .updated +
                  response.report
                    .quantityAdded +
                  response.report
                    .quantityReplaced,
              }
            )
          );

          reload();
        }}
      />

      <ItemDialog
        open={itemOpen}
        item={editTarget}
        onClose={() => {
          setItemOpen(false);
          setEditTarget(null);
        }}
        onSave={
          saveItem
        }
      />

      <MovementDialog
        item={
          movementTarget
        }
        onClose={() => {
          setMovementTarget(
            null
          );
        }}
        onSaved={
          movementSaved
        }
      />

      <HistoryDialog
        item={
          historyTarget
        }
        onClose={() => {
          setHistoryTarget(
            null
          );
        }}
      />
    </Container>
  );
};

export default InventoryPage;
