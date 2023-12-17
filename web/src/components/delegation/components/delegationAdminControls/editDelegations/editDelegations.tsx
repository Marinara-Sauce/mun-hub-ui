import { useState, useEffect } from "react";
import { Delegation } from "../../../../../model/delegation";
import { useApi } from "../../../../../contexts/authContext";
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "../../../../shared/confirmModal/confirmModal";

function EditableDelegation({
  delegation,
  onDeleteClicked,
  onRenameClicked,
}: {
  delegation: Delegation;
  onDeleteClicked: (delegation: Delegation) => void;
  onRenameClicked: (delegation: Delegation) => void;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  function handleDelete() {
    setActionLoading(true);
    onDeleteClicked(delegation);
  }

  return (
    <>
      <ConfirmModal
        destructive
        dialogTitle="Delete Delegation"
        confirmButtonText="Delete"
        open={deleteDialogOpen}
        buttonLoading={actionLoading}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      >
        Are you sure you want to delete this delegation? The delegation will be
        removed from every committee and working group. This cannot be undone.
      </ConfirmModal>
      <Box sx={{ display: "flex" }}>
        <Typography sx={{ flex: 1 }}>{delegation.delegation_name}</Typography>
        <IconButton
          aria-label="Rename"
          color="primary"
          onClick={() => onRenameClicked(delegation)}
        >
          <DriveFileRenameOutlineIcon />
        </IconButton>
        <IconButton
          aria-label="Delete"
          color="primary"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </>
  );
}

export default function EditDelegations() {
  const { axiosInstance } = useApi();

  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [delegationSearch, setDelegationSearch] = useState<string>();

  useEffect(() => {
    axiosInstance.get("/delegations").then((r) => setDelegations(r.data));
  }, []);

  function onDeleteClicked(delegation: Delegation) {
    axiosInstance
      .delete(`/delegations/${delegation.delegation_id}`)
      .then(() => {
        setDelegations(
          delegations.filter(
            (d) => d.delegation_id !== delegation.delegation_id,
          ),
        );
      });
  }

  function onRenameClicked(delegation: Delegation) {}

  return (
    <>
      <TextField
        label="Search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        value={delegationSearch}
        onChange={(event) => setDelegationSearch(event.target.value)}
      />
      <List>
        {delegations.map((c: Delegation) => (
          <>
            {!delegationSearch ||
            c.delegation_name.includes(delegationSearch) ? (
              <EditableDelegation
                delegation={c}
                onDeleteClicked={onDeleteClicked}
                onRenameClicked={onRenameClicked}
              />
            ) : null}
          </>
        ))}
      </List>
    </>
  );
}
