import { Box, Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useApi } from "../../../../../contexts/authContext";

export default function CreateDelegation({ onDelegationAdded }: { onDelegationAdded: () => void }) {
    const { axiosInstance } = useApi();

  const [isCreating, setIsCreating] = useState(false);
  const [currentName, setCurrentName] = useState("");

  const [loading, setLoading] = useState(false);

  function closeEditMode() {
    setCurrentName("");
    setIsCreating(false);
  }

  function onCreate() {
    setLoading(true);

    axiosInstance.post("/delegations", {
        delegation_name: currentName
    }).then(() => {
        setLoading(false);
        onDelegationAdded();
        setCurrentName("");
    });

    closeEditMode();
  }

  if (!isCreating) {
    return (
      <Button
        variant="outlined"
        sx={{ width: "100%" }}
        startIcon={<AddIcon />}
        onClick={() => setIsCreating(true)}
      >
        Add Delegation
      </Button>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
        <TextField sx={{ flex: 1 }} label="Delegation Name" variant="outlined" value={currentName} onChange={(event) => setCurrentName(event.target.value)}/>
        {loading ? <CircularProgress /> : 
            <IconButton aria-label="Create" color="primary" disabled={currentName.length === 0} onClick={onCreate}>
                <CheckIcon />
            </IconButton>
        }
        <IconButton aria-label="Cancel" onClick={closeEditMode}>
            <ClearIcon />
        </IconButton>
    </Box>
  );
}
