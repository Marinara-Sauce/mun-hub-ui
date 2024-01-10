import { useState } from "react";
import { WorkingPaper } from "../../../../../../../model/interfaces";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { useCommittee } from "../../../../../contexts/committeeContext";
import { Delegation } from "../../../../../../../model/interfaces";

function DelegationNotInWorkingGroup({
  delegation,
  onAdd,
}: {
  delegation: Delegation;
  onAdd: (delegation: Delegation) => void;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", p: "0" }}>
      <Typography sx={{ flex: "1" }}>{delegation.delegation_name}</Typography>
      <Button onClick={() => onAdd(delegation)}>Add</Button>
    </Box>
  );
}

function DelegationInWorkingGroup({
  delegation,
  onRemove,
}: {
  delegation: Delegation;
  onRemove: (delegation: Delegation) => void;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", p: "0" }}>
      <Typography sx={{ flex: "1" }}>{delegation.delegation_name}</Typography>
      <Button onClick={() => onRemove(delegation)}>Remove</Button>
    </Box>
  );
}

export default function ManageWorkingPaperDelegations({
  workingPaper,
  updatePaperDelegations,
}: {
  workingPaper: WorkingPaper;
  updatePaperDelegations: (
    workingPaper: WorkingPaper,
    delegations: Delegation[],
  ) => void;
}) {
  const { committee } = useCommittee();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [notInDelegationSearch, setNotInDelegationSearch] =
    useState<string>("");

  const [inDelegationSearch, setInDelegationSearch] = useState<string>("");

  const [delegationsInWorkingGroup, setDelegationsInWorkingGroup] = useState<
    Delegation[]
  >(workingPaper.delegations);

  const [delegationsNotInWorkingGroup, setDelegationsNotInWorkingGroup] =
    useState<Delegation[]>(
      committee.delegations.filter(
        (d) => !workingPaper.delegations.includes(d),
      ),
    );

  function closeDialog() {
    setDialogOpen(false);
  }

  function addDelegation(delegation: Delegation) {
    setDelegationsNotInWorkingGroup(
      delegationsNotInWorkingGroup.filter((d) => d !== delegation),
    );
    setDelegationsInWorkingGroup([...delegationsInWorkingGroup, delegation]);
  }

  function removeDelegation(delegation: Delegation) {
    setDelegationsInWorkingGroup(
      delegationsInWorkingGroup.filter((d) => d !== delegation),
    );
    setDelegationsNotInWorkingGroup([
      ...delegationsNotInWorkingGroup,
      delegation,
    ]);
  }

  function onSaveDelegations() {
    updatePaperDelegations(workingPaper, delegationsInWorkingGroup);
    closeDialog();
  }

  return (
    <>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Edit Working Group</DialogTitle>
        <DialogContent>
          <Typography variant="h5">Delegations in Working Group</Typography>
          <List sx={{}}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              value={inDelegationSearch}
              onChange={(e) => setInDelegationSearch(e.target.value)}
            />
            {delegationsInWorkingGroup.map((d) =>
              d.delegation_name.startsWith(inDelegationSearch) ? (
                <ListItem key={d.delegation_id} divider sx={{ pl: "0", pr: "0" }}>
                  <DelegationInWorkingGroup
                    delegation={d}
                    onRemove={removeDelegation}
                  />
                </ListItem>
              ) : null,
            )}
          </List>
          <Typography variant="h5">Delegations not in Working Group</Typography>
          <List sx={{}}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              value={notInDelegationSearch}
              onChange={(e) => setNotInDelegationSearch(e.target.value)}
            />
            {delegationsNotInWorkingGroup.map((d) =>
              d.delegation_name.startsWith(notInDelegationSearch) ? (
                <ListItem key={d.delegation_id} divider sx={{ pl: "0", pr: "0" }}>
                  <DelegationNotInWorkingGroup
                    delegation={d}
                    onAdd={addDelegation}
                  />
                </ListItem>
              ) : null,
            )}
          </List>
        </DialogContent>
        <DialogActions sx={{ display: "flex" }}>
          <Button
            sx={{ flex: "1" }}
            variant="contained"
            onClick={onSaveDelegations}
          >
            Save Changes
          </Button>
          <Button onClick={closeDialog}>Cancel Changes</Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        sx={{ flexGrow: 1 }}
        onClick={() => setDialogOpen(true)}
      >
        Edit Delegations
      </Button>
    </>
  );
}
