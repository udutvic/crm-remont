import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AddOutlined as AddIcon,
  Inventory2Outlined as InventoryIcon,
  SearchOutlined as SearchIcon,
  UndoOutlined as ReturnIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import getInventoryErrorMessage from "features/inventory/getInventoryErrorMessage";
import useAppFormatters from "hooks/useAppFormatters";
import {
  createInventoryMovement,
  getInventoryItems,
} from "index";
import type {
  InventoryItem,
  Order,
  StockMovement,
} from "types";

interface OrderPartsSectionProps {
  order: Order;
  onChanged:
    () => Promise<void> | void;
}

interface PartUsageSummary {
  item: InventoryItem;
  issuedQuantity: number;
  returnedQuantity: number;
  netQuantity: number;
  netCost: number;
  averageUnitCost: number;
}

const movementUnitCost = (
  movement: StockMovement
): number =>
  movement.unitCost ??
  movement.inventoryItem
    ?.purchasePrice ??
  0;

const OrderPartsSection = ({
  order,
  onChanged,
}: OrderPartsSectionProps) => {
  const {
    t,
  } = useTranslation();

  const {
    formatDateTime,
    formatPrice,
  } = useAppFormatters();

  const [
    addOpen,
    setAddOpen,
  ] = useState(false);

  const [
    returnTarget,
    setReturnTarget,
  ] = useState<
    PartUsageSummary | null
  >(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    searchResults,
    setSearchResults,
  ] = useState<
    InventoryItem[]
  >([]);

  const [
    selectedItem,
    setSelectedItem,
  ] = useState<
    InventoryItem | null
  >(null);

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    quantity,
    setQuantity,
  ] = useState("1");

  const [
    unitCost,
    setUnitCost,
  ] = useState("0");

  const [
    note,
    setNote,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<
    string | null
  >(null);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<
    string | null
  >(null);

  const orderId =
    order.id ?? null;

  const movements =
    useMemo(
      () =>
        (
          order.stockMovements ??
          []
        )
          .filter(
            (
              movement
            ) =>
              (
                movement.type ===
                  "issue" ||
                movement.type ===
                  "return"
              ) &&
              Boolean(
                movement.inventoryItem
              )
          )
          .sort(
            (
              left,
              right
            ) =>
              new Date(
                right.createdAt
              ).getTime() -
              new Date(
                left.createdAt
              ).getTime()
          ),
      [
        order.stockMovements,
      ]
    );

  const summaries =
    useMemo(
      () => {
        const grouped =
          new Map<
            number,
            {
              item: InventoryItem;
              issuedQuantity: number;
              returnedQuantity: number;
              issuedCost: number;
              returnedCost: number;
            }
          >();

        for (
          const movement of
          movements
        ) {
          const item =
            movement.inventoryItem;

          if (!item) {
            continue;
          }

          const current =
            grouped.get(
              item.id
            ) ?? {
              item,
              issuedQuantity: 0,
              returnedQuantity: 0,
              issuedCost: 0,
              returnedCost: 0,
            };

          const movementQuantity =
            Math.abs(
              movement.quantityChange
            );

          const movementCost =
            movementQuantity *
            movementUnitCost(
              movement
            );

          if (
            movement.type ===
            "issue"
          ) {
            current.issuedQuantity +=
              movementQuantity;
            current.issuedCost +=
              movementCost;
          } else {
            current.returnedQuantity +=
              movementQuantity;
            current.returnedCost +=
              movementCost;
          }

          grouped.set(
            item.id,
            current
          );
        }

        return Array.from(
          grouped.values()
        )
          .map(
            (
              current
            ): PartUsageSummary => {
              const netQuantity =
                current.issuedQuantity -
                current.returnedQuantity;

              const netCost =
                current.issuedCost -
                current.returnedCost;

              return {
                item: current.item,
                issuedQuantity:
                  current.issuedQuantity,
                returnedQuantity:
                  current.returnedQuantity,
                netQuantity,
                netCost,
                averageUnitCost:
                  netQuantity > 0
                    ? netCost /
                      netQuantity
                    : 0,
              };
            }
          )
          .sort(
            (
              left,
              right
            ) =>
              left.item.name.localeCompare(
                right.item.name
              )
          );
      },
      [
        movements,
      ]
    );

  const totalCost =
    summaries.reduce(
      (
        total,
        summary
      ) =>
        total +
        summary.netCost,
      0
    );

  useEffect(() => {
    if (!addOpen) {
      return;
    }

    const query =
      search.trim();

    if (
      query.length < 2
    ) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    let active = true;

    const timeout =
      window.setTimeout(
        () => {
          const load =
            async (): Promise<void> => {
              try {
                setSearching(true);
                setErrorMessage(null);

                const response =
                  await getInventoryItems(
                    {
                      page: 1,
                      pageSize: 20,
                      q: query,
                      active: true,
                    }
                  );

                if (active) {
                  setSearchResults(
                    response.items
                  );
                }
              } catch (
                error: unknown
              ) {
                if (active) {
                  setErrorMessage(
                    getInventoryErrorMessage(
                      error,
                      t,
                      "loadFailed"
                    )
                  );
                }
              } finally {
                if (active) {
                  setSearching(false);
                }
              }
            };

          void load();
        },
        350
      );

    return () => {
      active = false;
      window.clearTimeout(
        timeout
      );
    };
  }, [
    addOpen,
    search,
    t,
  ]);

  const resetDialog =
    (): void => {
      setSearch("");
      setSearchResults([]);
      setSelectedItem(null);
      setReturnTarget(null);
      setQuantity("1");
      setUnitCost("0");
      setNote("");
      setErrorMessage(null);
    };

  const closeDialogs =
    (): void => {
      if (saving) {
        return;
      }

      setAddOpen(false);
      resetDialog();
    };

  const selectItem = (
    item: InventoryItem
  ): void => {
    setSelectedItem(item);
    setQuantity("1");
    setUnitCost(
      String(
        item.purchasePrice ??
          0
      )
    );
    setErrorMessage(null);
  };

  const openReturn = (
    summary:
      PartUsageSummary
  ): void => {
    setReturnTarget(summary);
    setSelectedItem(
      summary.item
    );
    setQuantity("1");
    setUnitCost(
      String(
        Math.max(
          summary.averageUnitCost,
          0
        )
      )
    );
    setNote("");
    setErrorMessage(null);
  };

  const numericQuantity =
    Number(quantity);

  const numericUnitCost =
    Number(unitCost);

  const quantityValid =
    Number.isInteger(
      numericQuantity
    ) &&
    numericQuantity > 0;

  const costValid =
    Number.isFinite(
      numericUnitCost
    ) &&
    numericUnitCost >= 0;

  const maxQuantity =
    returnTarget
      ? returnTarget.netQuantity
      : selectedItem
        ?.currentQuantity ?? 0;

  const withinLimit =
    quantityValid &&
    numericQuantity <=
      maxQuantity;

  const canSave =
    Boolean(
      orderId &&
      selectedItem &&
      quantityValid &&
      costValid &&
      withinLimit &&
      !saving
    );

  const saveMovement =
    async (): Promise<void> => {
      if (
        !canSave ||
        !orderId ||
        !selectedItem
      ) {
        return;
      }

      const isReturn =
        Boolean(
          returnTarget
        );

      try {
        setSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        await createInventoryMovement(
          selectedItem.id,
          {
            type:
              isReturn
                ? "return"
                : "issue",
            quantity:
              numericQuantity,
            unitCost:
              numericUnitCost,
            orderId,
            note:
              note.trim() ||
              null,
          }
        );

        setSuccessMessage(
          t(
            isReturn
              ? "orderParts.success.returned"
              : "orderParts.success.issued"
          )
        );

        setAddOpen(false);
        resetDialog();
        await onChanged();
      } catch (
        error: unknown
      ) {
        console.error(
          "Order stock movement failed:",
          error
        );

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
    <>
      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
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
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Box
                sx={{
                  display: "grid",
                  placeItems:
                    "center",
                  color:
                    "primary.main",
                }}
              >
                <InventoryIcon />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                >
                  {t(
                    "orderParts.title"
                  )}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {t(
                    "orderParts.subtitle"
                  )}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={
                <AddIcon />
              }
              disabled={!orderId}
              onClick={() => {
                setSuccessMessage(null);
                setErrorMessage(null);
                setAddOpen(true);
              }}
            >
              {t(
                "orderParts.add"
              )}
            </Button>
          </Stack>

          <Divider />

          {successMessage && (
            <Alert
              severity="success"
              onClose={() => {
                setSuccessMessage(null);
              }}
            >
              {successMessage}
            </Alert>
          )}

          {summaries.length ===
          0 ? (
            <Typography
              color="text.secondary"
              sx={{
                py: 3,
                textAlign:
                  "center",
              }}
            >
              {t(
                "orderParts.empty"
              )}
            </Typography>
          ) : (
            <>
              <TableContainer>
                <Table
                  size="small"
                  sx={{
                    minWidth: 900,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {t(
                          "orderParts.summary.part"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {t(
                          "orderParts.summary.issued"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {t(
                          "orderParts.summary.returned"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {t(
                          "orderParts.summary.used"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {t(
                          "orderParts.summary.unitCost"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {t(
                          "orderParts.summary.total"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {t(
                          "orderParts.summary.stock"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {t(
                          "orderParts.summary.actions"
                        )}
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {summaries.map(
                      (
                        summary
                      ) => (
                        <TableRow
                          key={
                            summary.item.id
                          }
                          hover
                        >
                          <TableCell>
                            <Typography
                              fontWeight={700}
                            >
                              {summary.item.name}
                            </Typography>
                            <Typography
                              component="code"
                              variant="caption"
                              color="text.secondary"
                            >
                              {summary.item.sku}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {summary.issuedQuantity}
                          </TableCell>
                          <TableCell align="right">
                            {summary.returnedQuantity}
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              size="small"
                              color={
                                summary.netQuantity >
                                0
                                  ? "primary"
                                  : "default"
                              }
                              label={
                                summary.netQuantity
                              }
                            />
                          </TableCell>
                          <TableCell align="right">
                            {summary.netQuantity >
                            0
                              ? formatPrice(
                                  summary.averageUnitCost
                                )
                              : "-"}
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={700}>
                              {formatPrice(
                                summary.netCost
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {summary.item.currentQuantity}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              startIcon={
                                <ReturnIcon />
                              }
                              disabled={
                                summary.netQuantity <=
                                0
                              }
                              onClick={() => {
                                openReturn(summary);
                              }}
                            >
                              {t(
                                "orderParts.actions.return"
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  alignSelf: {
                    xs: "stretch",
                    sm: "flex-end",
                  },
                }}
              >
                <Typography
                  variant="overline"
                  color="text.secondary"
                >
                  {t(
                    "orderParts.totalCost"
                  )}
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={800}
                >
                  {formatPrice(totalCost)}
                </Typography>
              </Paper>

              <Divider />

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                {t(
                  "orderParts.history.title"
                )}
              </Typography>

              <TableContainer>
                <Table
                  size="small"
                  sx={{
                    minWidth: 900,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {t(
                          "orderParts.history.date"
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          "orderParts.summary.part"
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          "orderParts.history.type"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {t(
                          "orderParts.history.quantity"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {t(
                          "orderParts.history.unitCost"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {t(
                          "orderParts.history.total"
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          "orderParts.history.user"
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          "orderParts.history.note"
                        )}
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {movements.map(
                      (
                        movement
                      ) => {
                        const movementQuantity =
                          Math.abs(
                            movement.quantityChange
                          );
                        const price =
                          movementUnitCost(
                            movement
                          );

                        return (
                          <TableRow
                            key={movement.id}
                            hover
                          >
                            <TableCell>
                              {formatDateTime(
                                movement.createdAt
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                fontWeight={700}
                              >
                                {movement.inventoryItem
                                  ?.name ?? "-"}
                              </Typography>
                              <Typography
                                component="code"
                                variant="caption"
                                color="text.secondary"
                              >
                                {movement.inventoryItem
                                  ?.sku ?? "-"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                color={
                                  movement.type ===
                                  "issue"
                                    ? "error"
                                    : "success"
                                }
                                label={t(
                                  movement.type ===
                                  "issue"
                                    ? "orderParts.history.issue"
                                    : "orderParts.history.return"
                                )}
                              />
                            </TableCell>
                            <TableCell align="right">
                              {movement.type ===
                              "issue"
                                ? `-${movementQuantity}`
                                : `+${movementQuantity}`}
                            </TableCell>
                            <TableCell align="right">
                              {formatPrice(price)}
                            </TableCell>
                            <TableCell align="right">
                              {formatPrice(
                                movementQuantity *
                                  price
                              )}
                            </TableCell>
                            <TableCell>
                              {movement.createdBy
                                ?.name ?? "-"}
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
                              {movement.note ?? "-"}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Stack>
      </Paper>

      <Dialog
        open={
          addOpen ||
          Boolean(returnTarget)
        }
        onClose={closeDialogs}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t(
            returnTarget
              ? "orderParts.returnDialog.title"
              : "orderParts.addDialog.title"
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

            {!returnTarget && (
              <>
                <TextField
                  label={t(
                    "orderParts.addDialog.searchLabel"
                  )}
                  value={search}
                  onChange={(
                    event
                  ) => {
                    setSearch(
                      event.target.value
                    );
                    setSelectedItem(null);
                  }}
                  helperText={t(
                    "orderParts.addDialog.searchHint"
                  )}
                  autoFocus
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment:
                        searching ? (
                          <CircularProgress size={20} />
                        ) : undefined,
                    },
                  }}
                />

                {search.trim().length >=
                  2 &&
                  !searching &&
                  searchResults.length ===
                    0 && (
                    <Typography
                      color="text.secondary"
                      sx={{
                        py: 2,
                        textAlign:
                          "center",
                      }}
                    >
                      {t(
                        "orderParts.addDialog.noResults"
                      )}
                    </Typography>
                  )}

                {searchResults.length >
                  0 && (
                  <Paper
                    variant="outlined"
                    sx={{
                      maxHeight: 260,
                      overflow: "auto",
                    }}
                  >
                    <List disablePadding>
                      {searchResults.map(
                        (
                          item
                        ) => (
                          <ListItemButton
                            key={item.id}
                            selected={
                              selectedItem?.id ===
                              item.id
                            }
                            onClick={() => {
                              selectItem(item);
                            }}
                          >
                            <ListItemText
                              primary={item.name}
                              secondary={`${item.sku} · ${t(
                                "orderParts.addDialog.available"
                              )}: ${item.currentQuantity}`}
                            />
                            <Chip
                              size="small"
                              color={
                                item.currentQuantity >
                                0
                                  ? "success"
                                  : "error"
                              }
                              label={
                                item.currentQuantity
                              }
                            />
                          </ListItemButton>
                        )
                      )}
                    </List>
                  </Paper>
                )}
              </>
            )}

            {returnTarget && (
              <Alert severity="warning">
                {t(
                  "orderParts.returnDialog.description",
                  {
                    name:
                      returnTarget.item.name,
                    quantity:
                      returnTarget.netQuantity,
                  }
                )}
              </Alert>
            )}

            {selectedItem && (
              <>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                  }}
                >
                  <Typography
                    fontWeight={700}
                  >
                    {selectedItem.name}
                  </Typography>
                  <Typography
                    component="code"
                    variant="body2"
                    color="text.secondary"
                  >
                    {selectedItem.sku}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                    }}
                  >
                    {t(
                      "orderParts.addDialog.available"
                    )}
                    {": "}
                    <strong>
                      {selectedItem.currentQuantity}
                    </strong>
                    {" · "}
                    {t(
                      "orderParts.addDialog.purchasePrice"
                    )}
                    {": "}
                    <strong>
                      {formatPrice(
                        selectedItem.purchasePrice
                      )}
                    </strong>
                  </Typography>
                </Paper>

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={2}
                >
                  <TextField
                    label={t(
                      returnTarget
                        ? "orderParts.returnDialog.quantity"
                        : "orderParts.addDialog.quantity"
                    )}
                    type="number"
                    value={quantity}
                    onChange={(
                      event
                    ) => {
                      setQuantity(
                        event.target.value
                      );
                    }}
                    error={
                      Boolean(
                        quantity &&
                        (
                          !quantityValid ||
                          !withinLimit
                        )
                      )
                    }
                    helperText={
                      !quantityValid
                        ? t(
                            "orderParts.validation.quantity"
                          )
                        : !withinLimit
                          ? t(
                              returnTarget
                                ? "orderParts.validation.returnQuantity"
                                : "orderParts.validation.stock"
                            )
                          : " "
                    }
                    slotProps={{
                      htmlInput: {
                        min: 1,
                        max: maxQuantity,
                        step: 1,
                      },
                    }}
                    fullWidth
                  />

                  <TextField
                    label={t(
                      returnTarget
                        ? "orderParts.returnDialog.unitCost"
                        : "orderParts.addDialog.unitCost"
                    )}
                    type="number"
                    value={unitCost}
                    onChange={(
                      event
                    ) => {
                      setUnitCost(
                        event.target.value
                      );
                    }}
                    error={
                      Boolean(
                        unitCost &&
                        !costValid
                      )
                    }
                    helperText={
                      !costValid
                        ? t(
                            "orderParts.validation.cost"
                          )
                        : " "
                    }
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: 0.01,
                      },
                    }}
                    fullWidth
                  />
                </Stack>

                <Alert severity="info">
                  {t(
                    "orderParts.addDialog.total"
                  )}
                  {": "}
                  <strong>
                    {formatPrice(
                      quantityValid &&
                        costValid
                        ? numericQuantity *
                            numericUnitCost
                        : 0
                    )}
                  </strong>
                </Alert>

                <TextField
                  label={t(
                    returnTarget
                      ? "orderParts.returnDialog.note"
                      : "orderParts.addDialog.note"
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
                  minRows={2}
                  fullWidth
                />
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={closeDialogs}
            disabled={saving}
          >
            {t(
              "orderParts.actions.cancel"
            )}
          </Button>
          <Button
            variant="contained"
            color={
              returnTarget
                ? "warning"
                : "primary"
            }
            startIcon={
              returnTarget
                ? <ReturnIcon />
                : undefined
            }
            onClick={() => {
              void saveMovement();
            }}
            disabled={!canSave}
          >
            {t(
              saving
                ? returnTarget
                  ? "orderParts.actions.returning"
                  : "orderParts.actions.issuing"
                : returnTarget
                  ? "orderParts.actions.return"
                  : "orderParts.actions.issue"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderPartsSection;
