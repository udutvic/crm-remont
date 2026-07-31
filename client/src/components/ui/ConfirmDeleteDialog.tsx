import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
interface ConfirmDeleteDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  isConfirmEnabled?: boolean;
}
const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  message,
  onClose,
  onConfirm,
  isConfirmEnabled = true,
}) => {
  const hasErrorMessage = 
    message.toLowerCase().includes('cannot delete') || 
    message.toLowerCase().includes('open orders') ||
    message.toLowerCase().includes('confirm deletion') && message.toLowerCase().includes('cannot');
  const showDeleteButton = isConfirmEnabled && !hasErrorMessage;
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        <Typography variant="h6">Confirm Deletion</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography
          component="div"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {showDeleteButton && (
          <Button
            onClick={onConfirm}
            color="error"
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDeleteDialog;
