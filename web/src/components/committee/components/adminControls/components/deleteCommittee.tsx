import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Button } from "@mui/material";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../../../../contexts/authContext";

export default function DeleteCommittee() {
    const { id } = useParams();
    const [ axiosInstance ] = useAuth();
    const navigate = useNavigate();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
  
    const handleDeleteClicked = () => {
      setDeleteDialogOpen(true);
    };
  
    const handleClose = () => {
      setDeleteDialogOpen(false);
    };
  
    const handleDelete = () => {
        setDeleteLoading(true);
        axiosInstance.delete(`/committees/${id}`).then(() => {
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            navigate("/committee")
        });
    };
  
    return (
      <>
        <Dialog open={deleteDialogOpen} onClose={handleClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this committee? This will delete the committee, working papers, and working groups assosciated with this committee.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            {deleteLoading ? <CircularProgress /> : <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>}
          </DialogActions>
        </Dialog>
        <Button variant="contained" color="error" sx={{flex: 1, margin: 1}} onClick={handleDeleteClicked}>
            Delete Committee
        </Button>
      </>
    );
}