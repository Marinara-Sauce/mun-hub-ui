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
import { SetStateAction, useState } from "react";
import { Committee } from "../../../../model/committee";
import { useAuth } from "../../../../contexts/authContext";
import { useNavigate } from "react-router-dom";

export default function AddCommittee() {
  const [authContext, authed] = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [committeeName, setCommitteeName] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleCreate = () => {
    setLoading(true);

    authContext
      .post("/committees", {
        committee_name: committeeName,
        committee_abbreviation: "this should be deleted",
      })
      .then((response) => {
        setLoading(false);
        setError("");
        setDialogOpen(false);
        navigate(`/committee/${response.data.committee_id}`);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data.detail);
      });
  };

  const handleCommitteeNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCommitteeName(event.target.value);
  };

  return (
    <>
      {authed && (
        <Button
          variant="outlined"
          sx={{ m: 2 }}
          startIcon={<AddIcon />}
          onClick={openDialog}
        >
          Add Committee
        </Button>
      )}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        sx={{ minWidth: "600px" }}
      >
        <DialogTitle>Create Committee</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              autoFocus
              margin="dense"
              label="Committee Name"
              type="text"
              value={committeeName}
              onChange={handleCommitteeNameChange}
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
