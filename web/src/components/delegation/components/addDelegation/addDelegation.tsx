import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useApi } from "../../../../contexts/authContext";
import { useNavigate } from "react-router-dom";

export default function AddCommittee() {
  const { axiosInstance, isLoggedIn } = useApi();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [delegationName, setDelegationName] = useState("");
  const navigate = useNavigate();

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleCreate = () => {
    setLoading(true);

    axiosInstance
      .post("/committees", {
        committee_name: delegationName,
        committee_abbreviation: "this should be deleted",
      })
      .then((response) => {
        setLoading(false);
        setDialogOpen(false);
        navigate(`/committee/${response.data.committee_id}`);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const handleDelegationNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDelegationName(event.target.value);
  };

  return (
    <>
      {isLoggedIn ? (
        <Button
          variant="outlined"
          sx={{ m: 2 }}
          startIcon={<AddIcon />}
          onClick={openDialog}
        >
          Add Delegation
        </Button>
      ) : null}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        sx={{ minWidth: "600px" }}
      >
        <DialogTitle>Create Delegation</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              autoFocus
              margin="dense"
              label="Delegation Name"
              type="text"
              value={delegationName}
              onChange={handleDelegationNameChange}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button onClick={handleCreate} color="primary">
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
