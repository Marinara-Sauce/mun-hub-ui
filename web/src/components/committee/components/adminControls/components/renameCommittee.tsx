import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../../../../contexts/authContext";

export default function RenameCommittee() {
    const { id } = useParams();
    const [ axiosInstance ] = useAuth();
    const navigate = useNavigate();

    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const [newName, setNewName] = useState('');
  
    const handleRenameClicked = () => {
      setRenameDialogOpen(true);
    };
  
    const handleClose = () => {
      setRenameDialogOpen(false);
    };
  
    const handleRename = () => {
        setRenameLoading(true);
    };
  
    return (
      <>
        <Dialog open={renameDialogOpen} onClose={handleClose}>
          <DialogTitle>Rename Committee</DialogTitle>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="New Committee Name"
                type="text"
                fullWidth
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            {renameLoading ? <CircularProgress /> : <Button onClick={handleRename} variant="contained" disabled={newName.length === 0}>Rename</Button>}
          </DialogActions>
        </Dialog>
        <Button variant="contained" sx={{flex: 1, margin: 1}} onClick={handleRenameClicked}>
            Rename Committee
        </Button>
      </>
    );
}