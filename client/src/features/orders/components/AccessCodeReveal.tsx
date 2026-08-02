import {
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  AxiosError,
} from "axios";
import {
  ContentCopyOutlined as CopyIcon,
  LockOutlined as LockIcon,
  VisibilityOffOutlined as HideIcon,
  VisibilityOutlined as ShowIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

import {
  revealOrderAccessCode,
} from "index";
import type {
  AuthErrorResponse,
  OrderAccessType,
} from "types";

interface AccessCodeRevealProps {
  orderId?: number;
  accessType?: OrderAccessType;
  hasAccessCode: boolean;
  description: string;
}

const AUTO_HIDE_SECONDS =
  30;

const AccessCodeReveal = ({
  orderId,
  accessType = "none",
  hasAccessCode,
  description,
}: AccessCodeRevealProps) => {
  const {
    t,
  } = useTranslation();

  const [
    confirmOpen,
    setConfirmOpen,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    accessCode,
    setAccessCode,
  ] = useState<
    string | null
  >(null);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<
    string | null
  >(null);

  const [
    copied,
    setCopied,
  ] = useState(false);

  const hideTimerRef =
    useRef<
      number | null
    >(null);

  const clearHideTimer =
    (): void => {
      if (
        hideTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          hideTimerRef.current
        );

        hideTimerRef.current =
          null;
      }
    };

  const hideCode =
    (): void => {
      clearHideTimer();
      setAccessCode(null);
      setCopied(false);
    };

  useEffect(() => {
    return () => {
      clearHideTimer();
    };
  }, []);

  const scheduleAutoHide =
    (): void => {
      clearHideTimer();

      hideTimerRef.current =
        window.setTimeout(
          () => {
            setAccessCode(
              null
            );

            setCopied(
              false
            );

            hideTimerRef.current =
              null;
          },
          AUTO_HIDE_SECONDS *
            1000
        );
    };

  const handleReveal =
    async (): Promise<void> => {
      if (!orderId) {
        return;
      }

      try {
        setLoading(true);
        setErrorMessage(
          null
        );

        const response =
          await revealOrderAccessCode(
            orderId
          );

        setAccessCode(
          response.accessCode
        );

        setConfirmOpen(
          false
        );

        scheduleAutoHide();
      } catch (
        error: unknown
      ) {
        console.error(
          "Access-code reveal failed:",
          error
        );

        const axiosError =
          error as AxiosError<AuthErrorResponse>;

        setErrorMessage(
          axiosError.response
            ?.data?.error ??
            t(
              "accessCode.errors.revealFailed"
            )
        );

        setConfirmOpen(
          false
        );
      } finally {
        setLoading(false);
      }
    };

  const handleCopy =
    async (): Promise<void> => {
      if (!accessCode) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          accessCode
        );

        setCopied(true);

        window.setTimeout(
          () => {
            setCopied(
              false
            );
          },
          2000
        );
      } catch (
        error: unknown
      ) {
        console.error(
          "Copy failed:",
          error
        );

        setErrorMessage(
          t(
            "accessCode.errors.copyFailed"
          )
        );
      }
    };

  const typeLabel =
    t(
      `accessCode.types.${accessType}`,
      {
        defaultValue:
          t(
            "accessCode.types.unknown"
          ),
      }
    );

  return (
    <Stack spacing={1.25}>
      <Typography
        variant="body2"
      >
        {description}
      </Typography>

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

      {hasAccessCode &&
        !accessCode && (
          <Box>
            <Button
              type="button"
              variant="outlined"
              size="small"
              startIcon={
                <ShowIcon />
              }
              onClick={() => {
                setConfirmOpen(
                  true
                );
              }}
              disabled={
                loading ||
                !orderId
              }
            >
              {t(
                "accessCode.actions.show",
                {
                  type:
                    typeLabel,
                }
              )}
            </Button>
          </Box>
        )}

      {accessCode && (
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            borderColor:
              "warning.main",
            backgroundColor:
              "warning.50",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            alignItems={{
              xs: "stretch",
              sm: "center",
            }}
          >
            <LockIcon
              color="warning"
            />

            <Box
              sx={{
                flexGrow: 1,
                minWidth: 0,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {typeLabel}
              </Typography>

              <Typography
                component="div"
                sx={{
                  fontFamily:
                    "monospace",
                  fontSize:
                    "1.15rem",
                  fontWeight: 700,
                  letterSpacing:
                    "0.08em",
                  overflowWrap:
                    "anywhere",
                  userSelect:
                    "all",
                }}
              >
                {accessCode}
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
            >
              {copied && (
                <Chip
                  size="small"
                  color="success"
                  label={t(
                    "accessCode.copied"
                  )}
                />
              )}

              <Tooltip
                title={t(
                  "accessCode.actions.copy"
                )}
              >
                <IconButton
                  type="button"
                  onClick={() => {
                    void handleCopy();
                  }}
                >
                  <CopyIcon />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={t(
                  "accessCode.actions.hide"
                )}
              >
                <IconButton
                  type="button"
                  onClick={
                    hideCode
                  }
                >
                  <HideIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 1,
            }}
          >
            {t(
              "accessCode.autoHide",
              {
                seconds:
                  AUTO_HIDE_SECONDS,
              }
            )}
          </Typography>
        </Paper>
      )}

      <Dialog
        open={confirmOpen}
        onClose={() => {
          if (!loading) {
            setConfirmOpen(
              false
            );
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {t(
            "accessCode.confirm.title"
          )}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {t(
              "accessCode.confirm.message",
              {
                type:
                  typeLabel,
                seconds:
                  AUTO_HIDE_SECONDS,
              }
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setConfirmOpen(
                false
              );
            }}
            disabled={loading}
          >
            {t(
              "common.cancel"
            )}
          </Button>

          <Button
            variant="contained"
            color="warning"
            startIcon={
              <ShowIcon />
            }
            disabled={loading}
            onClick={() => {
              void handleReveal();
            }}
          >
            {loading
              ? t(
                  "accessCode.actions.loading"
                )
              : t(
                  "accessCode.actions.confirmShow"
                )}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AccessCodeReveal;
