import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import LoadingButton from "../loadingButton";

export default function TextFieldDialog({
  open,
  title,
  buttonLoading,
  textFieldLabel,
  onSubmit,
  onClose,
}: {
  open: boolean;
  title: string;
  buttonLoading: boolean;
  textFieldLabel?: string;
  onSubmit: (text: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState<string>("");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={textFieldLabel}
          type="text"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <LoadingButton
          disabled={text.length === 0}
          variant="contained"
          loading={buttonLoading}
          onClick={() => onSubmit(text)}
        >
          Rename
        </LoadingButton>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
