import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
}

const ConfirmDeleteDialog = ({
  open,
  message,
  onClose,
  onConfirm,
  isConfirmEnabled = true,
  title,
  confirmLabel,
}: ConfirmDeleteDialogProps) => {
  const {
    t,
  } = useTranslation();

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
            color="error"
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
