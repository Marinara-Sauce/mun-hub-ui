import { useState, useEffect } from "react";
import { Delegation } from "../../../../../model/delegation";
import { useApi } from "../../../../../contexts/apiContext";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "../../../../shared/confirmModal";
import TextFieldDialog from "../../../../shared/textFieldDialog";
import CreateDelegation from "../createDelegation";

function EditableDelegation({
  delegation,
  onDeleteClicked,
  onRenameClicked,
}: {
  delegation: Delegation;
  onDeleteClicked: (delegation: Delegation) => void;
  onRenameClicked: (delegation: Delegation, newName: string) => void;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  function handleDelete() {
    setActionLoading(true);
    onDeleteClicked(delegation);
  }

  function handleRename(newName: string) {
    setActionLoading(true);
    onRenameClicked(delegation, newName);
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
      <TextFieldDialog
        title="Rename Delegation"
        open={renameDialogOpen}
        buttonLoading={actionLoading}
        textFieldLabel={"New Delegation Name"}
        onSubmit={handleRename}
        onClose={() => setRenameDialogOpen(false)}
      />
      <Box sx={{ display: "flex" }}>
        <Typography sx={{ flex: 1 }}>{delegation.delegation_name}</Typography>
        <IconButton
          aria-label="Rename"
          color="primary"
          onClick={() => setRenameDialogOpen(true)}
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

  const [loading, setLoading] = useState(false);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [delegationSearch, setDelegationSearch] = useState<string>();

  useEffect(() => {
    fetchDelegations();
  }, []);

  function fetchDelegations() {
    setLoading(true);
    axiosInstance.get("/delegations").then((r) => {
      setLoading(false);
      setDelegations(r.data);
    });
  }

  function onDeleteClicked(delegation: Delegation) {
    axiosInstance
      .delete(`/delegations/${delegation.delegation_id}`)
      .then(() => {
        fetchDelegations();
      });
  }

  function onRenameClicked(delegation: Delegation, newName: string) {
    axiosInstance
      .put(
        `/delegations/${delegation.delegation_id}?new_delegation_name=${newName}`,
      )
      .then(() => fetchDelegations());
  }

  return (
    <>
      <CreateDelegation onDelegationAdded={() => fetchDelegations()} />
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
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {delegations.map((c: Delegation) => (
            <>
              {!delegationSearch ||
              c.delegation_name.includes(delegationSearch) ? (
                <EditableDelegation
                  key={c.delegation_id}
                  delegation={c}
                  onDeleteClicked={onDeleteClicked}
                  onRenameClicked={onRenameClicked}
                />
              ) : null}
            </>
          ))}
        </List>
      )}
    </>
  );
}
