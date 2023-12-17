import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";
import LoadingButton from "../loadingButton/loadingButton";

export default function TextFieldDialog({ open, title, buttonLoading, onSubmit, onClose }: { open: boolean, title: string, buttonLoading: boolean, onSubmit: (text: string) => void, onClose: () => void}) {
    const [ text, setText ] = useState<string>("");

    return (
        <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Committee Name"
            type="text"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
            <LoadingButton disabled={text.length === 0} variant="contained" loading={buttonLoading} onClick={() => onSubmit(text)}>Rename</LoadingButton>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
}