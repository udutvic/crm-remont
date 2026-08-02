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

import useAuth from "features/auth/context/useAuth";
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

interface PartSummary {
  item: InventoryItem;
  issuedQuantity: number;
  returnedQuantity: number;
  netQuantity: number;
  saleTotal: number;
  costTotal: number;
  averageUnitPrice: number;
  averageUnitCost: number;
}

const absoluteQuantity = (
  movement: StockMovement
): number =>
  Math.abs(
    movement.quantityChange
  );

const unitSalePrice = (
  movement: StockMovement
): number =>
  Number(
    movement.unitPrice ??
      movement.inventoryItem
        ?.salePrice ??
      0
  );

const unitCostPrice = (
  movement: StockMovement
): number =>
  Number(
    movement.unitCost ??
      movement.inventoryItem
        ?.purchasePrice ??
      0
  );

const digitsOnly = (
  value: string
): string => {
  const wholePart =
    value
      .replace(
        /\s/g,
        ""
      )
      .split(
        /[.,]/
      )[0];

  return wholePart.replace(
    /[^0-9]/g,
    ""
  );
};

const wholeMoneyString = (
  value: number
): string =>
  String(
    Math.max(
      0,
      Math.round(
        Number(value) ||
          0
      )
    )
  );

const OrderPartsSection = ({
  order,
  onChanged,
}: OrderPartsSectionProps) => {
  const {
    t,
  } = useTranslation();

  const {
    user,
  } = useAuth();

  const {
    formatDateTime,
    formatPrice,
  } = useAppFormatters();

  const isAdmin =
    user?.role ===
    "admin";

  const [
    addOpen,
    setAddOpen,
  ] = useState(false);

  const [
    returnTarget,
    setReturnTarget,
  ] = useState<
    PartSummary | null
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
    customerUnitPrice,
    setCustomerUnitPrice,
  ] = useState("0");

  const [
    internalUnitCost,
    setInternalUnitCost,
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
                movement
                  .inventoryItem
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
              item:
                InventoryItem;
              issuedQuantity:
                number;
              returnedQuantity:
                number;
              issuedSale:
                number;
              returnedSale:
                number;
              issuedCost:
                number;
              returnedCost:
                number;
            }
          >();

        for (
          const movement of
          movements
        ) {
          const item =
            movement
              .inventoryItem;

          if (!item) {
            continue;
          }

          const current =
            grouped.get(
              item.id
            ) ?? {
              item,
              issuedQuantity:
                0,
              returnedQuantity:
                0,
              issuedSale: 0,
              returnedSale: 0,
              issuedCost: 0,
              returnedCost: 0,
            };

          const movementQuantity =
            absoluteQuantity(
              movement
            );

          const saleAmount =
            movementQuantity *
            unitSalePrice(
              movement
            );

          const costAmount =
            movementQuantity *
            unitCostPrice(
              movement
            );

          if (
            movement.type ===
            "issue"
          ) {
            current
              .issuedQuantity +=
              movementQuantity;

            current.issuedSale +=
              saleAmount;

            current.issuedCost +=
              costAmount;
          } else {
            current
              .returnedQuantity +=
              movementQuantity;

            current.returnedSale +=
              saleAmount;

            current.returnedCost +=
              costAmount;
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
            ): PartSummary => {
              const netQuantity =
                current
                  .issuedQuantity -
                current
                  .returnedQuantity;

              const saleTotal =
                current
                  .issuedSale -
                current
                  .returnedSale;

              const costTotal =
                current
                  .issuedCost -
                current
                  .returnedCost;

              return {
                item:
                  current.item,
                issuedQuantity:
                  current
                    .issuedQuantity,
                returnedQuantity:
                  current
                    .returnedQuantity,
                netQuantity,
                saleTotal,
                costTotal,
                averageUnitPrice:
                  netQuantity > 0
                    ? saleTotal /
                      netQuantity
                    : 0,
                averageUnitCost:
                  netQuantity > 0
                    ? costTotal /
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
              left.item.name
                .localeCompare(
                  right.item.name
                )
          );
      },
      [
        movements,
      ]
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
      setSearchResults(
        []
      );
      setSearching(false);
      return;
    }

    let active = true;

    const timer =
      window.setTimeout(
        () => {
          const run =
            async (): Promise<void> => {
              try {
                setSearching(
                  true
                );

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
                  setSearching(
                    false
                  );
                }
              }
            };

          void run();
        },
        350
      );

    return () => {
      active = false;
      window.clearTimeout(
        timer
      );
    };
  }, [
    addOpen,
    search,
    t,
  ]);

  const resetEditor =
    (): void => {
      setSelectedItem(null);
      setQuantity("1");
      setCustomerUnitPrice(
        "0"
      );
      setInternalUnitCost(
        "0"
      );
      setNote("");
      setErrorMessage(null);
    };

  const selectItem = (
    item: InventoryItem
  ): void => {
    setSelectedItem(item);
    setQuantity("1");

    setCustomerUnitPrice(
      wholeMoneyString(
        item.salePrice ??
          0
      )
    );

    setInternalUnitCost(
      wholeMoneyString(
        item.purchasePrice ??
          0
      )
    );

    setErrorMessage(null);
  };

  const quantityNumber =
    Number(quantity);

  const unitPriceNumber =
    Number(
      customerUnitPrice
    );

  const unitCostNumber =
    Number(
      internalUnitCost
    );

  const baseValuesValid =
    Number.isInteger(
      quantityNumber
    ) &&
    quantityNumber > 0 &&
    Number.isInteger(
      unitPriceNumber
    ) &&
    unitPriceNumber >= 0 &&
    (
      !isAdmin ||
      (
        Number.isInteger(
          unitCostNumber
        ) &&
        unitCostNumber >= 0
      )
    );

  const enoughStock =
    Boolean(
      selectedItem &&
      quantityNumber <=
        selectedItem
          .currentQuantity
    );

  const issuePart =
    async (): Promise<void> => {
      if (
        !orderId ||
        !selectedItem ||
        !baseValuesValid ||
        !enoughStock
      ) {
        return;
      }

      try {
        setSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        await createInventoryMovement(
          selectedItem.id,
          {
            type: "issue",
            quantity:
              quantityNumber,
            unitPrice:
              unitPriceNumber,
            unitCost:
              isAdmin
                ? unitCostNumber
                : null,
            orderId,
            note:
              note.trim() ||
              null,
          }
        );

        setSuccessMessage(
          t(
            "orderParts.success.issued"
          )
        );

        setAddOpen(false);
        setSearch("");
        setSearchResults([]);
        resetEditor();

        await onChanged();
      } catch (
        error: unknown
      ) {
        console.error(
          "Order part issue failed:",
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

  const openReturn = (
    summary: PartSummary
  ): void => {
    setReturnTarget(
      summary
    );

    setQuantity("1");

    setCustomerUnitPrice(
      wholeMoneyString(
        summary
          .averageUnitPrice
      )
    );

    setInternalUnitCost(
      wholeMoneyString(
        summary
          .averageUnitCost
      )
    );

    setNote("");
    setErrorMessage(null);
  };

  const returnQuantityValid =
    Boolean(
      returnTarget &&
      Number.isInteger(
        quantityNumber
      ) &&
      quantityNumber > 0 &&
      quantityNumber <=
        returnTarget
          .netQuantity
    );

  const returnPart =
    async (): Promise<void> => {
      if (
        !orderId ||
        !returnTarget ||
        !returnQuantityValid ||
        !baseValuesValid
      ) {
        return;
      }

      try {
        setSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        await createInventoryMovement(
          returnTarget
            .item.id,
          {
            type: "return",
            quantity:
              quantityNumber,
            unitPrice:
              unitPriceNumber,
            unitCost:
              isAdmin
                ? unitCostNumber
                : null,
            orderId,
            note:
              note.trim() ||
              null,
          }
        );

        setSuccessMessage(
          t(
            "orderParts.success.returned"
          )
        );

        setReturnTarget(
          null
        );

        resetEditor();
        await onChanged();
      } catch (
        error: unknown
      ) {
        console.error(
          "Order part return failed:",
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

  const editorFields = (
    maxQuantity?: number
  ) => (
    <Stack spacing={2}>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
      >
        <TextField
          label={t(
            "orderFinance.partsEditor.quantity"
          )}
          type="text"
          value={quantity}
          onChange={(
            event
          ) => {
            setQuantity(
              digitsOnly(
                event.target
                  .value
              )
            );
          }}
          slotProps={{
            htmlInput: {
              inputMode:
                "numeric",
              pattern:
                "[0-9]*",
              "aria-valuemax":
                maxQuantity,
            },
          }}
          fullWidth
        />

        <TextField
          label={t(
            "orderFinance.partsEditor.customerUnitPrice"
          )}
          type="text"
          value={
            customerUnitPrice
          }
          onChange={(
            event
          ) => {
            setCustomerUnitPrice(
              digitsOnly(
                event.target
                  .value
              )
            );
          }}
          slotProps={{
            htmlInput: {
              inputMode:
                "numeric",
              pattern:
                "[0-9]*",
            },
          }}
          fullWidth
        />

        {isAdmin && (
          <TextField
            label={t(
              "orderFinance.partsEditor.internalUnitCost"
            )}
            type="text"
            value={
              internalUnitCost
            }
            onChange={(
              event
            ) => {
              setInternalUnitCost(
                digitsOnly(
                  event.target
                    .value
                )
              );
            }}
            slotProps={{
              htmlInput: {
                inputMode:
                  "numeric",
                pattern:
                  "[0-9]*",
              },
            }}
            fullWidth
          />
        )}
      </Stack>

      <Alert severity="info">
        {t(
          "orderFinance.partsEditor.customerTotal"
        )}
        {": "}
        <strong>
          {formatPrice(
            baseValuesValid
              ? quantityNumber *
                  unitPriceNumber
              : 0
          )}
        </strong>
      </Alert>

      <TextField
        label={t(
          "orderParts.addDialog.note"
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
    </Stack>
  );

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
              <InventoryIcon
                color="primary"
              />

              <Box>
                <Typography
                  variant="h6"
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
              onClick={() => {
                setAddOpen(true);
                setErrorMessage(
                  null
                );
                setSuccessMessage(
                  null
                );
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
                setSuccessMessage(
                  null
                );
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
                    minWidth:
                      isAdmin
                        ? 980
                        : 780,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {t(
                          "orderParts.summary.part"
                        )}
                      </TableCell>

                      <TableCell
                        align="right"
                      >
                        {t(
                          "orderParts.summary.used"
                        )}
                      </TableCell>

                      <TableCell
                        align="right"
                      >
                        {t(
                          "orderFinance.partsEditor.customerUnitPrice"
                        )}
                      </TableCell>

                      <TableCell
                        align="right"
                      >
                        {t(
                          "orderFinance.partsEditor.customerTotal"
                        )}
                      </TableCell>

                      {isAdmin && (
                        <>
                          <TableCell
                            align="right"
                          >
                            {t(
                              "orderFinance.partsEditor.internalUnitCost"
                            )}
                          </TableCell>

                          <TableCell
                            align="right"
                          >
                            {t(
                              "orderFinance.partsEditor.internalTotal"
                            )}
                          </TableCell>
                        </>
                      )}

                      <TableCell
                        align="right"
                      >
                        {t(
                          "orderParts.summary.stock"
                        )}
                      </TableCell>

                      <TableCell
                        align="right"
                      >
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
                            summary
                              .item.id
                          }
                          hover
                        >
                          <TableCell>
                            <Typography
                              fontWeight={
                                700
                              }
                            >
                              {
                                summary
                                  .item.name
                              }
                            </Typography>

                            <Typography
                              component="code"
                              variant="caption"
                              color="text.secondary"
                            >
                              {
                                summary
                                  .item.sku
                              }
                            </Typography>
                          </TableCell>

                          <TableCell
                            align="right"
                          >
                            <Chip
                              size="small"
                              label={
                                summary
                                  .netQuantity
                              }
                            />
                          </TableCell>

                          <TableCell
                            align="right"
                          >
                            {formatPrice(
                              summary
                                .averageUnitPrice
                            )}
                          </TableCell>

                          <TableCell
                            align="right"
                          >
                            <Typography
                              fontWeight={
                                700
                              }
                            >
                              {formatPrice(
                                summary
                                  .saleTotal
                              )}
                            </Typography>
                          </TableCell>

                          {isAdmin && (
                            <>
                              <TableCell
                                align="right"
                              >
                                {formatPrice(
                                  summary
                                    .averageUnitCost
                                )}
                              </TableCell>

                              <TableCell
                                align="right"
                              >
                                {formatPrice(
                                  summary
                                    .costTotal
                                )}
                              </TableCell>
                            </>
                          )}

                          <TableCell
                            align="right"
                          >
                            {
                              summary
                                .item
                                .currentQuantity
                            }
                          </TableCell>

                          <TableCell
                            align="right"
                          >
                            <Button
                              size="small"
                              startIcon={
                                <ReturnIcon />
                              }
                              disabled={
                                summary
                                  .netQuantity <=
                                0
                              }
                              onClick={() => {
                                openReturn(
                                  summary
                                );
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
                    minWidth:
                      isAdmin
                        ? 1050
                        : 850,
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

                      <TableCell
                        align="right"
                      >
                        {t(
                          "orderParts.history.quantity"
                        )}
                      </TableCell>

                      <TableCell
                        align="right"
                      >
                        {t(
                          "orderFinance.partsEditor.customerUnitPrice"
                        )}
                      </TableCell>

                      {isAdmin && (
                        <TableCell
                          align="right"
                        >
                          {t(
                            "orderFinance.partsEditor.internalUnitCost"
                          )}
                        </TableCell>
                      )}

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
                        const item =
                          movement
                            .inventoryItem;

                        return (
                          <TableRow
                            key={
                              movement.id
                            }
                            hover
                          >
                            <TableCell>
                              {formatDateTime(
                                movement
                                  .createdAt
                              )}
                            </TableCell>

                            <TableCell>
                              <Typography
                                fontWeight={
                                  700
                                }
                              >
                                {item
                                  ?.name ??
                                  "-"}
                              </Typography>

                              <Typography
                                component="code"
                                variant="caption"
                                color="text.secondary"
                              >
                                {item
                                  ?.sku ??
                                  "-"}
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

                            <TableCell
                              align="right"
                            >
                              {movement.type ===
                              "issue"
                                ? `-${absoluteQuantity(
                                    movement
                                  )}`
                                : `+${absoluteQuantity(
                                    movement
                                  )}`}
                            </TableCell>

                            <TableCell
                              align="right"
                            >
                              {formatPrice(
                                unitSalePrice(
                                  movement
                                )
                              )}
                            </TableCell>

                            {isAdmin && (
                              <TableCell
                                align="right"
                              >
                                {formatPrice(
                                  unitCostPrice(
                                    movement
                                  )
                                )}
                              </TableCell>
                            )}

                            <TableCell>
                              {movement
                                .createdBy
                                ?.name ??
                                "-"}
                            </TableCell>

                            <TableCell>
                              {movement
                                .note ??
                                "-"}
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
        open={addOpen}
        onClose={() => {
          if (!saving) {
            setAddOpen(false);
            setSearch("");
            setSearchResults([]);
            resetEditor();
          }
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t(
            "orderParts.addDialog.title"
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

            <TextField
              label={t(
                "orderParts.addDialog.searchLabel"
              )}
              value={search}
              onChange={(
                event
              ) => {
                setSearch(
                  event.target
                    .value
                );
                setSelectedItem(
                  null
                );
              }}
              slotProps={{
                input: {
                  startAdornment:
                    (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  endAdornment:
                    searching ? (
                      <CircularProgress
                        size={20}
                      />
                    ) : undefined,
                },
              }}
              fullWidth
            />

            {searchResults
              .length > 0 && (
              <Paper
                variant="outlined"
                sx={{
                  maxHeight: 260,
                  overflow: "auto",
                }}
              >
                <List
                  disablePadding
                >
                  {searchResults.map(
                    (
                      item
                    ) => (
                      <ListItemButton
                        key={
                          item.id
                        }
                        selected={
                          selectedItem
                            ?.id ===
                          item.id
                        }
                        onClick={() => {
                          selectItem(
                            item
                          );
                        }}
                      >
                        <ListItemText
                          primary={
                            item.name
                          }
                          secondary={`${item.sku} · ${t(
                            "orderParts.addDialog.available"
                          )}: ${item.currentQuantity}`}
                        />

                        <Chip
                          size="small"
                          label={
                            item.currentQuantity
                          }
                          color={
                            item.currentQuantity >
                            0
                              ? "success"
                              : "error"
                          }
                        />
                      </ListItemButton>
                    )
                  )}
                </List>
              </Paper>
            )}

            {selectedItem && (
              <>
                <Alert severity="success">
                  <strong>
                    {
                      selectedItem.name
                    }
                  </strong>
                  {" · "}
                  {
                    selectedItem.sku
                  }
                  {" · "}
                  {t(
                    "orderParts.addDialog.available"
                  )}
                  {": "}
                  {
                    selectedItem
                      .currentQuantity
                  }
                </Alert>

                {editorFields(
                  selectedItem
                    .currentQuantity
                )}
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            disabled={saving}
            onClick={() => {
              setAddOpen(false);
              setSearch("");
              setSearchResults([]);
              resetEditor();
            }}
          >
            {t(
              "orderParts.actions.cancel"
            )}
          </Button>

          <Button
            variant="contained"
            disabled={
              saving ||
              !selectedItem ||
              !baseValuesValid ||
              !enoughStock
            }
            onClick={() => {
              void issuePart();
            }}
          >
            {saving
              ? t(
                  "orderParts.actions.issuing"
                )
              : t(
                  "orderParts.actions.issue"
                )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(
          returnTarget
        )}
        onClose={() => {
          if (!saving) {
            setReturnTarget(
              null
            );
            resetEditor();
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t(
            "orderParts.returnDialog.title"
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

            <Alert severity="warning">
              {t(
                "orderParts.returnDialog.description",
                {
                  name:
                    returnTarget
                      ?.item.name ??
                    "",
                  quantity:
                    returnTarget
                      ?.netQuantity ??
                    0,
                }
              )}
            </Alert>

            {editorFields(
              returnTarget
                ?.netQuantity
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            disabled={saving}
            onClick={() => {
              setReturnTarget(
                null
              );
              resetEditor();
            }}
          >
            {t(
              "orderParts.actions.cancel"
            )}
          </Button>

          <Button
            variant="contained"
            color="warning"
            startIcon={
              <ReturnIcon />
            }
            disabled={
              saving ||
              !returnQuantityValid ||
              !baseValuesValid
            }
            onClick={() => {
              void returnPart();
            }}
          >
            {saving
              ? t(
                  "orderParts.actions.returning"
                )
              : t(
                  "orderParts.actions.return"
                )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderPartsSection;
