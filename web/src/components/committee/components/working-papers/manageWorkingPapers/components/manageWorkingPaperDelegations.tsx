import { useState } from "react";
import { WorkingPaper } from "../../../../../../model/workingPaper";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, TextField, Typography } from "@mui/material";
import { useCommittee } from "../../../../contexts/committeeContext";
import { Delegation } from "../../../../../../model/delegation";

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

export default function ManageWorkingPaperDelegations({workingPaper}: {workingPaper: WorkingPaper}) {
    const { committee } = useCommittee();

    const [dialogOpen, setDialogOpen] = useState(false);

    const [notInDelegationSearch, setNotInDelegationSearch] =
        useState<string>("");

    const [inDelegationSearch, setInDelegationSearch] = useState<string>("");

    const [delegationsInWorkingGroup, setDelegationsInWorkingGroup] = useState<Delegation[]>(
        workingPaper.delegations
    );

    const [delegationsNotInWorkingGroup, setDelegationsNotInWorkingGroup] = useState<Delegation[]>(
        committee.delegations.filter((d) => !(workingPaper.delegations.includes(d)))
    )

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
        setDelegationsNotInWorkingGroup([...delegationsNotInWorkingGroup, delegation]);
    }

    function onSaveDelegations() {
        
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
                            onChange={(e) => setInDelegationSearch(e.target.value)} />
                        {workingPaper.delegations.map((d) => d.delegation_name.startsWith(inDelegationSearch) ? (
                            <ListItem divider sx={{ pl: "0", pr: "0" }}>
                                <DelegationInWorkingGroup
                                    key={d.delegation_id}
                                    delegation={d}
                                    onRemove={removeDelegation} />
                            </ListItem>
                        ) : null
                        )}
                    </List>
                    <Typography variant="h5">
                        Delegations not in Working Group
                    </Typography>
                    <List sx={{}}>
                        <TextField
                            fullWidth
                            label="Search"
                            variant="outlined"
                            value={notInDelegationSearch}
                            onChange={(e) => setNotInDelegationSearch(e.target.value)} />
                        {committee.delegations.map((d) => d.delegation_name.startsWith(notInDelegationSearch) ? (
                            <ListItem divider sx={{ pl: "0", pr: "0" }}>
                                <DelegationNotInWorkingGroup
                                    key={d.delegation_id}
                                    delegation={d}
                                    onAdd={addDelegation} />
                            </ListItem>
                        ) : null
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
            <Button variant="contained" sx={{ flexGrow: 1 }} onClick={() => setDialogOpen(true)}>Edit Delegations</Button>
        </>
    )
}