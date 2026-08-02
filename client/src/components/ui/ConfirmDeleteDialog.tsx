import type {
  ButtonProps,
} from "@mui/material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import {
  useTranslation,
} from "react-i18next";

interface ConfirmDeleteDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  isConfirmEnabled?: boolean;
  title?: string;
  confirmLabel?: string;
  confirmColor?: ButtonProps["color"];

  inputLabel?: string;
  inputValue?: string;
  inputRequired?: boolean;
  inputMaxLength?: number;
  inputHelperText?: string;

  onInputChange?: (
    value: string
  ) => void;
}

const ConfirmDeleteDialog = ({
  open,
  message,
  onClose,
  onConfirm,
  isConfirmEnabled = true,
  title,
  confirmLabel,
  confirmColor = "error",
  inputLabel,
  inputValue = "",
  inputRequired = false,
  inputMaxLength,
  inputHelperText,
  onInputChange,
}: ConfirmDeleteDialogProps) => {
  const {
    t,
  } = useTranslation();

  const showInput =
    Boolean(
      inputLabel &&
      onInputChange
    );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {title ??
          t(
            "deleteDialog.title"
          )}
      </DialogTitle>

      <DialogContent>
        <Typography>
          {message}
        </Typography>

        {showInput && (
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            margin="normal"
            label={inputLabel}
            value={inputValue}
            required={
              inputRequired
            }
            helperText={
              inputHelperText
            }
            slotProps={{
              htmlInput: {
                maxLength:
                  inputMaxLength,
              },
            }}
            onChange={(
              event
            ) => {
              onInputChange?.(
                event.target.value
              );
            }}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
        >
          {t(
            "deleteDialog.cancel"
          )}
        </Button>

        {isConfirmEnabled && (
          <Button
            onClick={
              onConfirm
            }
            color={
              confirmColor
            }
            variant="contained"
          >
            {confirmLabel ??
              t(
                "deleteDialog.delete"
              )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
