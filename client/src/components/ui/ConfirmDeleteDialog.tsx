import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

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
  const normalizedMessage = message.toLowerCase();

  const hasErrorMessage =
    normalizedMessage.includes("cannot delete") ||
    normalizedMessage.includes("open orders") ||
    (normalizedMessage.includes("confirm deletion") &&
      normalizedMessage.includes("cannot"));

  const showDeleteButton =
    isConfirmEnabled && !hasErrorMessage;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Confirm Deletion</DialogTitle>

      <DialogContent>
        <Typography>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        {showDeleteButton && (
          <Button
            onClick={onConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
