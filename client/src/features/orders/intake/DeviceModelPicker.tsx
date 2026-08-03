import {
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  AxiosError,
} from "axios";
import {
  Add as AddIcon,
  PhoneIphoneOutlined as PhoneIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import type {
  DeviceType,
} from "types";

import {
  createDeviceModel,
  getDeviceModels,
  type DeviceModelCatalogItem,
} from "./deviceModelApi";
import {
  deviceTypeOptions,
} from "./intakeWizardConfig";

interface DeviceModelPickerProps {
  value: DeviceModelCatalogItem | null;
  onSelect: (
    model: DeviceModelCatalogItem
  ) => void;
}

interface CreateFormState {
  deviceType: DeviceType;
  brand: string;
  model: string;
  aliases: string;
}

interface ApiErrorBody {
  error?: string;
  deviceModel?: DeviceModelCatalogItem;
}

const initialCreateForm: CreateFormState = {
  deviceType: "phone",
  brand: "",
  model: "",
  aliases: "",
};

const DeviceModelPicker = ({
  value,
  onSelect,
}: DeviceModelPickerProps) => {
  const { t } = useTranslation();
  const [query, setQuery] =
    useState("");
  const [models, setModels] =
    useState<DeviceModelCatalogItem[]>(
      []
    );
  const [loading, setLoading] =
    useState(true);
  const [loadError, setLoadError] =
    useState(false);
  const [dialogOpen, setDialogOpen] =
    useState(false);
  const [createForm, setCreateForm] =
    useState<CreateFormState>(
      initialCreateForm
    );
  const [createError, setCreateError] =
    useState("");
  const [saving, setSaving] =
    useState(false);
  const requestSequence = useRef(0);

  useEffect(() => {
    const requestId =
      ++requestSequence.current;
    const searchQuery = query.trim();

    setLoading(true);
    setLoadError(false);

    const timeoutId = window.setTimeout(
      () => {
        void getDeviceModels(
          searchQuery,
          20
        )
          .then((items) => {
            if (
              requestSequence.current !==
              requestId
            ) {
              return;
            }

            setModels(items);
          })
          .catch(() => {
            if (
              requestSequence.current !==
              requestId
            ) {
              return;
            }

            setModels([]);
            setLoadError(true);
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
      searchQuery ? 350 : 0
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const closeDialog = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setCreateError("");
    setCreateForm(
      initialCreateForm
    );
  };

  const saveModel = async () => {
    const brand =
      createForm.brand.trim();
    const model =
      createForm.model.trim();

    if (!brand || !model) {
      setCreateError(
        t(
          "deviceModelCatalog.validation"
        )
      );
      return;
    }

    setSaving(true);
    setCreateError("");

    try {
      const created =
        await createDeviceModel({
          deviceType:
            createForm.deviceType,
          brand,
          model,
          aliases:
            createForm.aliases
              .split(",")
              .map((alias) =>
                alias.trim()
              )
              .filter(Boolean),
        });

      setModels((current) => [
        created,
        ...current.filter(
          (item) =>
            item.id !== created.id
        ),
      ]);
      onSelect(created);
      closeDialog();
    } catch (error) {
      const axiosError =
        error as AxiosError<ApiErrorBody>;

      if (
        axiosError.response?.status ===
        409
      ) {
        const existing =
          axiosError.response.data
            ?.deviceModel;

        if (existing) {
          onSelect(existing);
          setModels((current) => [
            existing,
            ...current.filter(
              (item) =>
                item.id !== existing.id
            ),
          ]);
          closeDialog();
          return;
        }

        setCreateError(
          t(
            "deviceModelCatalog.duplicateError"
          )
        );
        return;
      }

      setCreateError(
        t(
          "deviceModelCatalog.createError"
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const resultTitle = query.trim()
    ? t(
        "deviceModelCatalog.searchResultsTitle"
      )
    : t(
        "deviceModelCatalog.popularTitle"
      );

  return (
    <Stack spacing={1.25}>
      <TextField
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
        placeholder={t(
          "deviceModelCatalog.searchPlaceholder"
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
              <CircularProgress
                size={18}
              />
            ) : undefined,
          },
        }}
      />

      <Typography
        variant="caption"
        fontWeight={750}
        color="text.secondary"
      >
        {resultTitle}
      </Typography>

      {loadError && (
        <Alert severity="error">
          {t(
            "deviceModelCatalog.error"
          )}
        </Alert>
      )}

      {!loadError &&
        !loading &&
        models.length === 0 && (
          <Alert severity="info">
            {t(
              "deviceModelCatalog.empty"
            )}
          </Alert>
        )}

      <List
        dense
        sx={{
          maxHeight: 340,
          overflowY: "auto",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        {models.map((item) => {
          const selected =
            value?.id === item.id;

          return (
            <ListItemButton
              key={item.id}
              selected={selected}
              onClick={() => {
                onSelect(item);
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 32 }}
              >
                <PhoneIcon
                  fontSize="small"
                  color={
                    selected
                      ? "primary"
                      : "inherit"
                  }
                />
              </ListItemIcon>
              <ListItemText
                primary={`${item.brand} ${item.model}`}
                secondary={t(
                  "deviceModelCatalog.usageCount",
                  {
                    count:
                      item.usageCount,
                  }
                )}
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: 700,
                }}
                secondaryTypographyProps={{
                  variant: "caption",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {value && (
        <Alert severity="success">
          {t(
            "deviceModelCatalog.selected"
          )}
          {": "}
          <strong>
            {value.brand}{" "}
            {value.model}
          </strong>
        </Alert>
      )}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        fullWidth
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        {t(
          "deviceModelCatalog.addAction"
        )}
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {t(
            "deviceModelCatalog.addTitle"
          )}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            sx={{ pt: 1 }}
          >
            {createError && (
              <Alert severity="error">
                {createError}
              </Alert>
            )}

            <TextField
              select
              label={t(
                "deviceModelCatalog.type"
              )}
              value={
                createForm.deviceType
              }
              onChange={(event) => {
                setCreateForm(
                  (current) => ({
                    ...current,
                    deviceType:
                      event.target
                        .value as DeviceType,
                  })
                );
              }}
              fullWidth
              required
            >
              {deviceTypeOptions.map(
                (option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {t(
                      option.labelKey
                    )}
                  </MenuItem>
                )
              )}
            </TextField>

            <TextField
              label={t(
                "deviceModelCatalog.brand"
              )}
              value={createForm.brand}
              onChange={(event) => {
                setCreateForm(
                  (current) => ({
                    ...current,
                    brand:
                      event.target.value,
                  })
                );
              }}
              fullWidth
              required
            />

            <TextField
              label={t(
                "deviceModelCatalog.model"
              )}
              value={createForm.model}
              onChange={(event) => {
                setCreateForm(
                  (current) => ({
                    ...current,
                    model:
                      event.target.value,
                  })
                );
              }}
              fullWidth
              required
            />

            <TextField
              label={t(
                "deviceModelCatalog.aliases"
              )}
              helperText={t(
                "deviceModelCatalog.aliasesHint"
              )}
              value={createForm.aliases}
              onChange={(event) => {
                setCreateForm(
                  (current) => ({
                    ...current,
                    aliases:
                      event.target.value,
                  })
                );
              }}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={closeDialog}
            disabled={saving}
          >
            {t(
              "deviceModelCatalog.cancel"
            )}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void saveModel();
            }}
            disabled={saving}
          >
            {saving
              ? t(
                  "deviceModelCatalog.saving"
                )
              : t(
                  "deviceModelCatalog.save"
                )}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default DeviceModelPicker;
