import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ReactNode } from "react";
import LoadingButton from "../loadingButton";

export default function ConfirmModal({
  open,
  children,
  dialogTitle,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  destructive = false,
  buttonLoading = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  children: ReactNode;
  dialogTitle: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  destructive?: boolean;
  buttonLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  function onClickedConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <LoadingButton
          loading={buttonLoading}
          variant="contained"
          color={destructive ? "error" : "primary"}
          onClick={onClickedConfirm}
        >
          {confirmButtonText}
        </LoadingButton>
        <Button onClick={onClose}>{cancelButtonText}</Button>
      </DialogActions>
    </Dialog>
  );
}
