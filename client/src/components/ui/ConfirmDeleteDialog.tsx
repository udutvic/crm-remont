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
}

const ConfirmDeleteDialog = ({
  open,
  message,
  onClose,
  onConfirm,
  isConfirmEnabled = true,
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
        {t(
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
            {t(
              "deleteDialog.delete"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
