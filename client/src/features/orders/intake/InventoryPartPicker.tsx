import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Inventory2Outlined as InventoryIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { getInventoryItems } from "index";
import type { InventoryItem } from "types";

export interface SelectedInventoryPart {
  item: InventoryItem;
  quantity: number;
  unitPrice: number;
}

interface InventoryPartPickerProps {
  selectedParts: SelectedInventoryPart[];
  onChange: (
    parts: SelectedInventoryPart[]
  ) => void;
}

const normalizeQuantity = (
  value: number,
  max: number
) => Math.min(
  Math.max(
    Number.isFinite(value) ? value : 1,
    1
  ),
  Math.max(max, 1)
);

const InventoryPartPicker = ({
  selectedParts,
  onChange,
}: InventoryPartPickerProps) => {
  const { t } = useTranslation();
  const [query, setQuery] =
    useState("");
  const [results, setResults] =
    useState<InventoryItem[]>([]);
  const [loading, setLoading] =
    useState(false);
  const [searchError, setSearchError] =
    useState(false);
  const requestSequence = useRef(0);

  useEffect(() => {
    const searchQuery = query.trim();
    const requestId =
      ++requestSequence.current;

    if (searchQuery.length < 2) {
      setResults([]);
      setLoading(false);
      setSearchError(false);
      return;
    }

    setLoading(true);
    setSearchError(false);

    const timeoutId = window.setTimeout(
      () => {
        void getInventoryItems({
          page: 1,
          pageSize: 30,
          q: searchQuery,
          active: true,
        })
          .then((response) => {
            if (
              requestSequence.current ===
              requestId
            ) {
              setResults(response.items);
            }
          })
          .catch(() => {
            if (
              requestSequence.current ===
              requestId
            ) {
              setResults([]);
              setSearchError(true);
            }
          })
          .finally(() => {
            if (
              requestSequence.current ===
              requestId
            ) {
              setLoading(false);
            }
          });
      },
      350
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const selectedIds = useMemo(
    () =>
      new Set(
        selectedParts.map(
          (part) => part.item.id
        )
      ),
    [selectedParts]
  );

  const partsTotal = useMemo(
    () =>
      selectedParts.reduce(
        (total, part) =>
          total +
          part.quantity *
            part.unitPrice,
        0
      ),
    [selectedParts]
  );

  const addPart = (
    item: InventoryItem
  ) => {
    if (
      item.currentQuantity <= 0 ||
      selectedIds.has(item.id)
    ) {
      return;
    }

    onChange([
      ...selectedParts,
      {
        item,
        quantity: 1,
        unitPrice: item.salePrice,
      },
    ]);
  };

  const updatePart = (
    itemId: number,
    update: Partial<
      Pick<
        SelectedInventoryPart,
        "quantity" | "unitPrice"
      >
    >
  ) => {
    onChange(
      selectedParts.map((part) => {
        if (part.item.id !== itemId) {
          return part;
        }

        return {
          ...part,
          ...update,
        };
      })
    );
  };

  const removePart = (
    itemId: number
  ) => {
    onChange(
      selectedParts.filter(
        (part) =>
          part.item.id !== itemId
      )
    );
  };

  return (
    <Stack spacing={2}>
      <TextField
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
        placeholder={t(
          "inventoryPartPicker.searchPlaceholder"
        )}
        helperText={t(
          "inventoryPartPicker.searchHint"
        )}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: loading ? (
              <CircularProgress size={18} />
            ) : undefined,
          },
        }}
      />

      {searchError && (
        <Alert severity="error">
          {t(
            "inventoryPartPicker.error"
          )}
        </Alert>
      )}

      {query.trim().length >= 2 && (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2.5,
            overflow: "hidden",
          }}
        >
          <Typography
            variant="caption"
            fontWeight={750}
            sx={{
              display: "block",
              px: 1.5,
              py: 1,
              bgcolor: "grey.50",
            }}
          >
            {t(
              "inventoryPartPicker.resultsTitle"
            )}
          </Typography>

          {!loading &&
            !searchError &&
            results.length === 0 && (
              <Alert
                severity="info"
                sx={{ m: 1.5 }}
              >
                {t(
                  "inventoryPartPicker.noResults"
                )}
              </Alert>
            )}

          <List disablePadding>
            {results.map((item) => {
              const selected =
                selectedIds.has(item.id);
              const outOfStock =
                item.currentQuantity <= 0;

              return (
                <ListItem
                  key={item.id}
                  divider
                  secondaryAction={
                    <Button
                      size="small"
                      variant={
                        selected
                          ? "outlined"
                          : "contained"
                      }
                      startIcon={
                        selected || outOfStock
                          ? undefined
                          : <AddIcon />
                      }
                      disabled={
                        selected || outOfStock
                      }
                      onClick={() => {
                        addPart(item);
                      }}
                    >
                      {outOfStock
                        ? t(
                            "inventoryPartPicker.outOfStock"
                          )
                        : selected
                          ? t(
                              "inventoryPartPicker.alreadySelected"
                            )
                          : t(
                              "inventoryPartPicker.add"
                            )}
                    </Button>
                  }
                  sx={{
                    pr: 15,
                    py: 1.25,
                  }}
                >
                  <InventoryIcon
                    color={
                      outOfStock
                        ? "disabled"
                        : "primary"
                    }
                    sx={{ mr: 1.5 }}
                  />

                  <ListItemText
                    primary={item.name}
                    secondary={
                      <Stack
                        component="span"
                        spacing={0.35}
                        sx={{ mt: 0.4 }}
                      >
                        <Typography
                          component="span"
                          variant="caption"
                          color="primary.main"
                        >
                          {item.sku}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {t(
                            "inventoryPartPicker.stock",
                            {
                              count:
                                item.currentQuantity,
                            }
                          )}
                          {" · "}
                          {t(
                            "inventoryPartPicker.salePrice",
                            {
                              value:
                                item.salePrice.toLocaleString(),
                            }
                          )}
                        </Typography>
                        {item.compatibility && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {t(
                              "inventoryPartPicker.compatibility",
                              {
                                value:
                                  item.compatibility,
                              }
                            )}
                          </Typography>
                        )}
                      </Stack>
                    }
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: 750,
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}

      <Divider />

      <Typography
        variant="subtitle2"
        fontWeight={800}
      >
        {t(
          "inventoryPartPicker.selectedTitle"
        )}
      </Typography>

      {selectedParts.length === 0 && (
        <Alert severity="info">
          {t(
            "inventoryPartPicker.selectedEmpty"
          )}
        </Alert>
      )}

      {selectedParts.map((part) => {
        const lineTotal =
          part.quantity *
          part.unitPrice;

        return (
          <Paper
            key={part.item.id}
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2.5,
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={800}
                  >
                    {part.item.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="primary.main"
                  >
                    {part.item.sku}
                  </Typography>
                </Box>

                <IconButton
                  size="small"
                  aria-label={t(
                    "inventoryPartPicker.remove"
                  )}
                  onClick={() => {
                    removePart(part.item.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1.5}
              >
                <TextField
                  label={t(
                    "inventoryPartPicker.quantity"
                  )}
                  value={part.quantity}
                  type="number"
                  size="small"
                  onChange={(event) => {
                    updatePart(
                      part.item.id,
                      {
                        quantity:
                          normalizeQuantity(
                            Number(
                              event.target.value
                            ),
                            part.item
                              .currentQuantity
                          ),
                      }
                    );
                  }}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      max:
                        part.item
                          .currentQuantity,
                    },
                  }}
                  sx={{ width: 120 }}
                />

                <TextField
                  label={t(
                    "inventoryPartPicker.unitPrice"
                  )}
                  value={part.unitPrice}
                  type="number"
                  size="small"
                  onChange={(event) => {
                    updatePart(
                      part.item.id,
                      {
                        unitPrice:
                          Math.max(
                            Number(
                              event.target.value
                            ) || 0,
                            0
                          ),
                      }
                    );
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          Kč
                        </InputAdornment>
                      ),
                    },
                    htmlInput: {
                      min: 0,
                      step: 1,
                    },
                  }}
                  sx={{ width: 180 }}
                />

                <Box
                  sx={{
                    ml: {
                      sm: "auto",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {t(
                      "inventoryPartPicker.lineTotal"
                    )}
                  </Typography>
                  <Typography fontWeight={850}>
                    {lineTotal.toLocaleString()} Kč
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
              >
                <Chip
                  size="small"
                  label={t(
                    "inventoryPartPicker.stock",
                    {
                      count:
                        part.item.currentQuantity,
                    }
                  )}
                />
                {part.item.location && (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={t(
                      "inventoryPartPicker.location",
                      {
                        value:
                          part.item.location,
                      }
                    )}
                  />
                )}
              </Stack>
            </Stack>
          </Paper>
        );
      })}

      {selectedParts.length > 0 && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: "grey.50",
          }}
        >
          <Typography fontWeight={800}>
            {t(
              "inventoryPartPicker.partsTotal"
            )}
          </Typography>
          <Typography
            variant="h6"
            fontWeight={900}
          >
            {partsTotal.toLocaleString()} Kč
          </Typography>
        </Stack>
      )}

      <Alert severity="info">
        {t(
          "inventoryPartPicker.reservationHint"
        )}
      </Alert>
    </Stack>
  );
};

export default InventoryPartPicker;
