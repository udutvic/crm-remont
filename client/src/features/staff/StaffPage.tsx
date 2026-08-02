import {
  useCallback,
  useEffect,
  useState,
} from "react";
import type {
  AxiosError,
} from "axios";
import {
  EditOutlined as EditIcon,
  KeyOutlined as PasswordIcon,
  LogoutOutlined as RevokeIcon,
  PersonAddOutlined as AddIcon,
  RefreshOutlined as RefreshIcon,
  RestartAltOutlined as ResetIcon,
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
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import PageHeader from "common/components/PageHeader";
import useAuth from "features/auth/context/useAuth";
import useAppFormatters from "hooks/useAppFormatters";
import {
  createStaffUser,
  getStaffUsers,
  resetStaffUserPassword,
  revokeStaffUserSessions,
  updateStaffUser,
} from "index";
import type {
  AuthErrorResponse,
  CreateStaffPayload,
  StaffRoleFilter,
  StaffStatusFilter,
  StaffUser,
  UpdateStaffPayload,
  UserRole,
} from "types";

interface StaffApiErrorResponse
  extends AuthErrorResponse {
  details?: Record<
    string,
    string
  >;
}

interface StaffFormState {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  password: string;
  confirmPassword: string;
}

const EMPTY_FORM:
  StaffFormState = {
  name: "",
  email: "",
  role: "technician",
  isActive: true,
  password: "",
  confirmPassword: "",
};

const StaffPage = () => {
  const {
    t,
  } = useTranslation();

  const {
    user: currentUser,
    refreshSession,
  } = useAuth();

  const {
    formatDateTime,
  } = useAppFormatters();

  const [
    items,
    setItems,
  ] = useState<StaffUser[]>(
    []
  );

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
    roleFilter,
    setRoleFilter,
  ] =
    useState<StaffRoleFilter>(
      "all"
    );

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StaffStatusFilter>(
      "all"
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

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

  const [
    reloadKey,
    setReloadKey,
  ] = useState(0);

  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);

  const [
    editTarget,
    setEditTarget,
  ] = useState<
    StaffUser | null
  >(null);

  const [
    passwordTarget,
    setPasswordTarget,
  ] = useState<
    StaffUser | null
  >(null);

  const [
    revokeTarget,
    setRevokeTarget,
  ] = useState<
    StaffUser | null
  >(null);

  const [
    form,
    setForm,
  ] =
    useState<StaffFormState>(
      EMPTY_FORM
    );

  const [
    passwordVisible,
    setPasswordVisible,
  ] = useState(false);

  const [
    confirmPasswordVisible,
    setConfirmPasswordVisible,
  ] = useState(false);

  useEffect(() => {
    const timeout =
      window.setTimeout(
        () => {
          setSearchQuery(
            searchInput.trim()
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
  }, [searchInput]);

  const getErrorMessage =
    useCallback((
      error: unknown,
    fallbackKey:
      | "loadFailed"
      | "createFailed"
      | "updateFailed"
      | "passwordFailed"
      | "revokeFailed"
  ): string => {
    const axiosError =
      error as AxiosError<StaffApiErrorResponse>;

    const details =
      axiosError.response
        ?.data?.details;

    if (details) {
      const firstDetail =
        Object.values(
          details
        )[0];

      if (firstDetail) {
        return firstDetail;
      }
    }

    const code =
      axiosError.response
        ?.data?.code;

    if (code) {
      const translated =
        t(
          `staffPage.apiErrors.${code}`,
          {
            defaultValue: "",
          }
        );

      if (translated) {
        return translated;
      }
    }

    return (
      axiosError.response
        ?.data?.error ??
      t(
        `staffPage.errors.${fallbackKey}`
      )
    );
    }, [t]);

  const loadStaff =
    useCallback(
      async (): Promise<void> => {
        /*
         * reloadKey intentionally
         * invalidates this callback.
         */
        void reloadKey;

        try {
          setLoading(true);
          setErrorMessage(
            null
          );

          const response =
            await getStaffUsers({
              page:
                page + 1,

              pageSize,

              q:
                searchQuery ||
                undefined,

              role:
                roleFilter ===
                "all"
                  ? undefined
                  : roleFilter,

              status:
                statusFilter,
            });

          const maximumPage =
            Math.max(
              0,
              response.pagination
                .totalPages - 1
            );

          if (
            page >
            maximumPage
          ) {
            setPage(
              maximumPage
            );

            return;
          }

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
          console.error(
            "Staff load failed:",
            error
          );

          setErrorMessage(
            getErrorMessage(
              error,
              "loadFailed"
            )
          );
        } finally {
          setLoading(false);
        }
      },
      [
        getErrorMessage,
        page,
        pageSize,
        reloadKey,
        roleFilter,
        searchQuery,
        statusFilter,
      ]
    );

  useEffect(() => {
    void loadStaff();
  }, [loadStaff]);

  const reload =
    (): void => {
      setReloadKey(
        (value) =>
          value + 1
      );
    };

  const resetForm =
    (): void => {
      setForm(
        EMPTY_FORM
      );

      setPasswordVisible(
        false
      );

      setConfirmPasswordVisible(
        false
      );
    };

  const openCreate =
    (): void => {
      resetForm();
      setCreateOpen(true);
      setErrorMessage(null);
      setSuccessMessage(null);
    };

  const closeCreate =
    (): void => {
      if (saving) {
        return;
      }

      setCreateOpen(false);
      resetForm();
    };

  const openEdit = (
    staffUser: StaffUser
  ): void => {
    setForm({
      ...EMPTY_FORM,

      name:
        staffUser.name,

      email:
        staffUser.email,

      role:
        staffUser.role,

      isActive:
        staffUser.isActive,
    });

    setEditTarget(
      staffUser
    );

    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const closeEdit =
    (): void => {
      if (saving) {
        return;
      }

      setEditTarget(null);
      resetForm();
    };

  const openPassword = (
    staffUser: StaffUser
  ): void => {
    setForm({
      ...EMPTY_FORM,
      password: "",
      confirmPassword: "",
    });

    setPasswordTarget(
      staffUser
    );

    setPasswordVisible(
      false
    );

    setConfirmPasswordVisible(
      false
    );

    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const closePassword =
    (): void => {
      if (saving) {
        return;
      }

      setPasswordTarget(
        null
      );

      resetForm();
    };

  const handleCreate =
    async (): Promise<void> => {
      if (
        form.password !==
        form.confirmPassword
      ) {
        setErrorMessage(
          t(
            "staffPage.validation.passwordMismatch"
          )
        );

        return;
      }

      const payload:
        CreateStaffPayload = {
        name:
          form.name.trim(),

        email:
          form.email.trim(),

        role:
          form.role,

        isActive:
          form.isActive,

        password:
          form.password,
      };

      try {
        setSaving(true);
        setErrorMessage(
          null
        );

        await createStaffUser(
          payload
        );

        setCreateOpen(false);
        resetForm();
        setPage(0);

        setSuccessMessage(
          t(
            "staffPage.messages.created"
          )
        );

        reload();
      } catch (
        error: unknown
      ) {
        console.error(
          "Staff create failed:",
          error
        );

        setErrorMessage(
          getErrorMessage(
            error,
            "createFailed"
          )
        );
      } finally {
        setSaving(false);
      }
    };

  const handleUpdate =
    async (): Promise<void> => {
      if (!editTarget) {
        return;
      }

      const payload:
        UpdateStaffPayload = {
        name:
          form.name.trim(),

        email:
          form.email.trim(),

        role:
          form.role,

        isActive:
          form.isActive,
      };

      try {
        setSaving(true);
        setErrorMessage(
          null
        );

        await updateStaffUser(
          editTarget.id,
          payload
        );

        const editedSelf =
          editTarget.id ===
          currentUser?.id;

        setEditTarget(null);
        resetForm();

        if (editedSelf) {
          await refreshSession();
        }

        setSuccessMessage(
          t(
            "staffPage.messages.updated"
          )
        );

        reload();
      } catch (
        error: unknown
      ) {
        console.error(
          "Staff update failed:",
          error
        );

        setErrorMessage(
          getErrorMessage(
            error,
            "updateFailed"
          )
        );
      } finally {
        setSaving(false);
      }
    };

  const handlePasswordReset =
    async (): Promise<void> => {
      if (!passwordTarget) {
        return;
      }

      if (
        form.password !==
        form.confirmPassword
      ) {
        setErrorMessage(
          t(
            "staffPage.validation.passwordMismatch"
          )
        );

        return;
      }

      try {
        setSaving(true);
        setErrorMessage(
          null
        );

        await resetStaffUserPassword(
          passwordTarget.id,
          {
            password:
              form.password,
          }
        );

        setPasswordTarget(
          null
        );

        resetForm();

        setSuccessMessage(
          t(
            "staffPage.messages.passwordReset"
          )
        );

        reload();
      } catch (
        error: unknown
      ) {
        console.error(
          "Password reset failed:",
          error
        );

        setErrorMessage(
          getErrorMessage(
            error,
            "passwordFailed"
          )
        );
      } finally {
        setSaving(false);
      }
    };

  const handleRevokeSessions =
    async (): Promise<void> => {
      if (!revokeTarget) {
        return;
      }

      try {
        setSaving(true);
        setErrorMessage(
          null
        );

        const result =
          await revokeStaffUserSessions(
            revokeTarget.id
          );

        setRevokeTarget(
          null
        );

        setSuccessMessage(
          t(
            "staffPage.messages.sessionsRevoked",
            {
              count:
                result.revokedSessions,
            }
          )
        );

        reload();
      } catch (
        error: unknown
      ) {
        console.error(
          "Session revocation failed:",
          error
        );

        setErrorMessage(
          getErrorMessage(
            error,
            "revokeFailed"
          )
        );
      } finally {
        setSaving(false);
      }
    };

  const handleResetFilters =
    (): void => {
      setSearchInput("");
      setSearchQuery("");
      setRoleFilter("all");
      setStatusFilter("all");
      setPage(0);
    };

  const roleLabel = (
    role: UserRole
  ): string =>
    t(
      `staffPage.roles.${role}`
    );

  const statusLabel = (
    active: boolean
  ): string =>
    active
      ? t(
          "staffPage.status.active"
        )
      : t(
          "staffPage.status.inactive"
        );

  const passwordField = (
    field:
      | "password"
      | "confirmPassword",
    label: string,
    visible: boolean,
    onToggle: () => void
  ) => (
    <TextField
      fullWidth
      required
      type={
        visible
          ? "text"
          : "password"
      }
      label={label}
      value={form[field]}
      autoComplete="new-password"
      onChange={(
        event
      ) => {
        setForm(
          (current) => ({
            ...current,
            [field]:
              event.target.value,
          })
        );
      }}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                edge="end"
                onClick={
                  onToggle
                }
                aria-label={t(
                  visible
                    ? "staffPage.actions.hidePassword"
                    : "staffPage.actions.showPassword"
                )}
              >
                {visible
                  ? "🙈"
                  : "👁"}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: {
          xs: 2,
          sm: 4,
        },

        mb: 4,

        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },
      }}
    >
      <PageHeader
        title={t(
          "staffPage.title"
        )}
        onAddClick={
          openCreate
        }
        addButtonText={t(
          "staffPage.addStaff"
        )}
      />

      <Stack spacing={2}>
        <Alert severity="info">
          {t(
            "staffPage.securityNotice"
          )}
        </Alert>

        <Paper
          variant="outlined"
          sx={{
            p: {
              xs: 1.5,
              sm: 2,
            },
          }}
        >
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                sm:
                  "repeat(2, minmax(0, 1fr))",

                lg:
                  "minmax(260px, 2fr) repeat(2, minmax(180px, 1fr)) auto",
              },

              gap: 1.5,
              alignItems: "center",
            }}
          >
            <TextField
              size="small"
              label={t(
                "staffPage.filters.search"
              )}
              placeholder={t(
                "staffPage.filters.searchPlaceholder"
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
            />

            <FormControl size="small">
              <InputLabel>
                {t(
                  "staffPage.filters.role"
                )}
              </InputLabel>

              <Select
                label={t(
                  "staffPage.filters.role"
                )}
                value={
                  roleFilter
                }
                onChange={(
                  event
                ) => {
                  setRoleFilter(
                    event.target
                      .value as StaffRoleFilter
                  );

                  setPage(0);
                }}
              >
                <MenuItem value="all">
                  {t(
                    "staffPage.roles.all"
                  )}
                </MenuItem>

                <MenuItem value="admin">
                  {t(
                    "staffPage.roles.admin"
                  )}
                </MenuItem>

                <MenuItem value="technician">
                  {t(
                    "staffPage.roles.technician"
                  )}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>
                {t(
                  "staffPage.filters.status"
                )}
              </InputLabel>

              <Select
                label={t(
                  "staffPage.filters.status"
                )}
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) => {
                  setStatusFilter(
                    event.target
                      .value as StaffStatusFilter
                  );

                  setPage(0);
                }}
              >
                <MenuItem value="all">
                  {t(
                    "staffPage.status.all"
                  )}
                </MenuItem>

                <MenuItem value="active">
                  {t(
                    "staffPage.status.active"
                  )}
                </MenuItem>

                <MenuItem value="inactive">
                  {t(
                    "staffPage.status.inactive"
                  )}
                </MenuItem>
              </Select>
            </FormControl>

            <Stack
              direction="row"
              spacing={1}
            >
              <Button
                variant="outlined"
                startIcon={
                  <ResetIcon />
                }
                onClick={
                  handleResetFilters
                }
              >
                {t(
                  "staffPage.filters.reset"
                )}
              </Button>

              <Tooltip
                title={t(
                  "staffPage.actions.refresh"
                )}
              >
                <IconButton
                  color="primary"
                  onClick={
                    reload
                  }
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Paper>

        {errorMessage && (
          <Alert
            severity="error"
            onClose={() => {
              setErrorMessage(
                null
              );
            }}
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

        {loading ? (
          <Box
            sx={{
              minHeight: 280,
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
              p: 4,
              textAlign:
                "center",
            }}
          >
            <Typography
              color="text.secondary"
            >
              {t(
                "staffPage.empty"
              )}
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                md:
                  "repeat(2, minmax(0, 1fr))",

                xl:
                  "repeat(3, minmax(0, 1fr))",
              },

              gap: 2,
            }}
          >
            {items.map(
              (
                staffUser
              ) => {
                const isSelf =
                  staffUser.id ===
                  currentUser?.id;

                return (
                  <Card
                    key={
                      staffUser.id
                    }
                    variant="outlined"
                    sx={{
                      display: "flex",
                      flexDirection:
                        "column",
                      height: "100%",

                      borderColor:
                        isSelf
                          ? "primary.main"
                          : undefined,
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={1}
                          alignItems="flex-start"
                        >
                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                overflowWrap:
                                  "anywhere",
                              }}
                            >
                              {staffUser.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflowWrap:
                                  "anywhere",
                              }}
                            >
                              {staffUser.email}
                            </Typography>
                          </Box>

                          {isSelf && (
                            <Chip
                              size="small"
                              color="primary"
                              label={t(
                                "staffPage.currentAccount"
                              )}
                            />
                          )}
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Chip
                            size="small"
                            label={roleLabel(
                              staffUser.role
                            )}
                            color={
                              staffUser.role ===
                              "admin"
                                ? "secondary"
                                : "default"
                            }
                          />

                          <Chip
                            size="small"
                            label={statusLabel(
                              staffUser.isActive
                            )}
                            color={
                              staffUser.isActive
                                ? "success"
                                : "default"
                            }
                          />

                          <Chip
                            size="small"
                            variant="outlined"
                            label={t(
                              "staffPage.activeSessions",
                              {
                                count:
                                  staffUser.activeSessionCount,
                              }
                            )}
                          />
                        </Stack>

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns:
                              "minmax(0, 1fr) minmax(0, 1fr)",
                            gap: 1.5,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {t(
                                "staffPage.lastLogin"
                              )}
                            </Typography>

                            <Typography
                              variant="body2"
                            >
                              {staffUser.lastLoginAt
                                ? formatDateTime(
                                    staffUser.lastLoginAt
                                  )
                                : t(
                                    "staffPage.never"
                                  )}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {t(
                                "staffPage.passwordChanged"
                              )}
                            </Typography>

                            <Typography
                              variant="body2"
                            >
                              {formatDateTime(
                                staffUser.passwordChangedAt
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>

                    <CardActions
                      sx={{
                        px: 2,
                        pb: 2,
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      <Button
                        size="small"
                        startIcon={
                          <EditIcon />
                        }
                        onClick={() => {
                          openEdit(
                            staffUser
                          );
                        }}
                      >
                        {t(
                          "staffPage.actions.edit"
                        )}
                      </Button>

                      <Button
                        size="small"
                        startIcon={
                          <PasswordIcon />
                        }
                        onClick={() => {
                          openPassword(
                            staffUser
                          );
                        }}
                      >
                        {t(
                          "staffPage.actions.resetPassword"
                        )}
                      </Button>

                      <Button
                        size="small"
                        color="warning"
                        startIcon={
                          <RevokeIcon />
                        }
                        disabled={
                          staffUser.activeSessionCount ===
                          0
                        }
                        onClick={() => {
                          setRevokeTarget(
                            staffUser
                          );

                          setErrorMessage(
                            null
                          );

                          setSuccessMessage(
                            null
                          );
                        }}
                      >
                        {t(
                          "staffPage.actions.revokeSessions"
                        )}
                      </Button>
                    </CardActions>
                  </Card>
                );
              }
            )}
          </Box>
        )}

        <Paper variant="outlined">
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
                  event.target
                    .value
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
            labelRowsPerPage={t(
              "staffPage.pagination.rowsPerPage"
            )}
            labelDisplayedRows={({
              from,
              to,
              count,
            }) =>
              t(
                "staffPage.pagination.displayedRows",
                {
                  from,
                  to,
                  count,
                }
              )
            }
          />
        </Paper>
      </Stack>

      <Dialog
        open={createOpen}
        onClose={
          closeCreate
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t(
            "staffPage.dialogs.createTitle"
          )}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            sx={{
              pt: 1,
            }}
          >
            <TextField
              fullWidth
              required
              label={t(
                "staffPage.fields.name"
              )}
              value={form.name}
              autoComplete="off"
              onChange={(
                event
              ) => {
                setForm(
                  (current) => ({
                    ...current,
                    name:
                      event.target.value,
                  })
                );
              }}
            />

            <TextField
              fullWidth
              required
              type="email"
              label={t(
                "staffPage.fields.email"
              )}
              value={form.email}
              autoComplete="off"
              onChange={(
                event
              ) => {
                setForm(
                  (current) => ({
                    ...current,
                    email:
                      event.target.value,
                  })
                );
              }}
            />

            <FormControl fullWidth>
              <InputLabel>
                {t(
                  "staffPage.fields.role"
                )}
              </InputLabel>

              <Select
                label={t(
                  "staffPage.fields.role"
                )}
                value={form.role}
                onChange={(
                  event
                ) => {
                  setForm(
                    (current) => ({
                      ...current,

                      role:
                        event.target
                          .value as UserRole,
                    })
                  );
                }}
              >
                <MenuItem value="technician">
                  {t(
                    "staffPage.roles.technician"
                  )}
                </MenuItem>

                <MenuItem value="admin">
                  {t(
                    "staffPage.roles.admin"
                  )}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={
                    form.isActive
                  }
                  onChange={(
                    event
                  ) => {
                    setForm(
                      (current) => ({
                        ...current,

                        isActive:
                          event.target
                            .checked,
                      })
                    );
                  }}
                />
              }
              label={t(
                "staffPage.fields.active"
              )}
            />

            {passwordField(
              "password",
              t(
                "staffPage.fields.password"
              ),
              passwordVisible,
              () => {
                setPasswordVisible(
                  (value) =>
                    !value
                );
              }
            )}

            {passwordField(
              "confirmPassword",
              t(
                "staffPage.fields.confirmPassword"
              ),
              confirmPasswordVisible,
              () => {
                setConfirmPasswordVisible(
                  (value) =>
                    !value
                );
              }
            )}

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {t(
                "staffPage.passwordHint"
              )}
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              closeCreate
            }
            disabled={saving}
          >
            {t(
              "common.cancel"
            )}
          </Button>

          <Button
            variant="contained"
            startIcon={
              <AddIcon />
            }
            disabled={saving}
            onClick={() => {
              void handleCreate();
            }}
          >
            {saving
              ? t(
                  "staffPage.actions.saving"
                )
              : t(
                  "staffPage.actions.create"
                )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={
          Boolean(
            editTarget
          )
        }
        onClose={
          closeEdit
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t(
            "staffPage.dialogs.editTitle",
            {
              name:
                editTarget?.name ??
                "",
            }
          )}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            sx={{
              pt: 1,
            }}
          >
            <TextField
              fullWidth
              required
              label={t(
                "staffPage.fields.name"
              )}
              value={form.name}
              onChange={(
                event
              ) => {
                setForm(
                  (current) => ({
                    ...current,
                    name:
                      event.target.value,
                  })
                );
              }}
            />

            <TextField
              fullWidth
              required
              type="email"
              label={t(
                "staffPage.fields.email"
              )}
              value={form.email}
              onChange={(
                event
              ) => {
                setForm(
                  (current) => ({
                    ...current,
                    email:
                      event.target.value,
                  })
                );
              }}
            />

            <FormControl
              fullWidth
              disabled={
                editTarget?.id ===
                currentUser?.id
              }
            >
              <InputLabel>
                {t(
                  "staffPage.fields.role"
                )}
              </InputLabel>

              <Select
                label={t(
                  "staffPage.fields.role"
                )}
                value={form.role}
                onChange={(
                  event
                ) => {
                  setForm(
                    (current) => ({
                      ...current,

                      role:
                        event.target
                          .value as UserRole,
                    })
                  );
                }}
              >
                <MenuItem value="technician">
                  {t(
                    "staffPage.roles.technician"
                  )}
                </MenuItem>

                <MenuItem value="admin">
                  {t(
                    "staffPage.roles.admin"
                  )}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={
                    form.isActive
                  }
                  disabled={
                    editTarget?.id ===
                    currentUser?.id
                  }
                  onChange={(
                    event
                  ) => {
                    setForm(
                      (current) => ({
                        ...current,

                        isActive:
                          event.target
                            .checked,
                      })
                    );
                  }}
                />
              }
              label={t(
                "staffPage.fields.active"
              )}
            />

            {editTarget?.id ===
              currentUser?.id && (
              <Alert severity="info">
                {t(
                  "staffPage.selfProtection"
                )}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              closeEdit
            }
            disabled={saving}
          >
            {t(
              "common.cancel"
            )}
          </Button>

          <Button
            variant="contained"
            disabled={saving}
            onClick={() => {
              void handleUpdate();
            }}
          >
            {saving
              ? t(
                  "staffPage.actions.saving"
                )
              : t(
                  "staffPage.actions.save"
                )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={
          Boolean(
            passwordTarget
          )
        }
        onClose={
          closePassword
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {t(
            "staffPage.dialogs.passwordTitle",
            {
              name:
                passwordTarget
                  ?.name ?? "",
            }
          )}
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            sx={{
              pt: 1,
            }}
          >
            <DialogContentText>
              {passwordTarget?.id ===
              currentUser?.id
                ? t(
                    "staffPage.dialogs.selfPasswordMessage"
                  )
                : t(
                    "staffPage.dialogs.passwordMessage"
                  )}
            </DialogContentText>

            {passwordField(
              "password",
              t(
                "staffPage.fields.newPassword"
              ),
              passwordVisible,
              () => {
                setPasswordVisible(
                  (value) =>
                    !value
                );
              }
            )}

            {passwordField(
              "confirmPassword",
              t(
                "staffPage.fields.confirmPassword"
              ),
              confirmPasswordVisible,
              () => {
                setConfirmPasswordVisible(
                  (value) =>
                    !value
                );
              }
            )}

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {t(
                "staffPage.passwordHint"
              )}
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              closePassword
            }
            disabled={saving}
          >
            {t(
              "common.cancel"
            )}
          </Button>

          <Button
            variant="contained"
            color="warning"
            disabled={saving}
            onClick={() => {
              void handlePasswordReset();
            }}
          >
            {saving
              ? t(
                  "staffPage.actions.saving"
                )
              : t(
                  "staffPage.actions.resetPassword"
                )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={
          Boolean(
            revokeTarget
          )
        }
        onClose={() => {
          if (!saving) {
            setRevokeTarget(
              null
            );
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {t(
            "staffPage.dialogs.revokeTitle"
          )}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {revokeTarget?.id ===
            currentUser?.id
              ? t(
                  "staffPage.dialogs.selfRevokeMessage",
                  {
                    count:
                      Math.max(
                        0,
                        (
                          revokeTarget
                            ?.activeSessionCount ??
                          0
                        ) - 1
                      ),
                  }
                )
              : t(
                  "staffPage.dialogs.revokeMessage",
                  {
                    name:
                      revokeTarget
                        ?.name ?? "",

                    count:
                      revokeTarget
                        ?.activeSessionCount ??
                      0,
                  }
                )}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setRevokeTarget(
                null
              );
            }}
            disabled={saving}
          >
            {t(
              "common.cancel"
            )}
          </Button>

          <Button
            variant="contained"
            color="warning"
            disabled={saving}
            onClick={() => {
              void handleRevokeSessions();
            }}
          >
            {saving
              ? t(
                  "staffPage.actions.saving"
                )
              : t(
                  "staffPage.actions.confirmRevoke"
                )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffPage;
