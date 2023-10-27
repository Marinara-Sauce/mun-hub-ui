import { Box, Button, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, List, ListItem, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Delegation } from "../../../../model/delegation";
import { useAuth } from "../../../../contexts/authContext";
import { useCommittee } from "../../contexts/committeeContext";

function DelegationNotInCommittee({
    delegation,
    search = '',
}: {
    delegation: Delegation,
    search?: string
}) {
    return (
        <Box sx={{display: 'flex', alignItems: 'center', width: '100%', p: '0'}}>
            <Typography sx={{flex: '1'}}>{delegation.delegation_name}</Typography>
            <Button>Add</Button>
        </Box>
    )
}

export default function EditDelegations() {

    const axiosInstance = useAuth()[0];

    const committee = useCommittee()[0];

    const [dialogOpen, setDialogOpen] = useState(false);
    const [delegations, setDelegations] = useState<Delegation[]>([]);

    const [delegationsLoading, setDelegationsLoading] = useState(false);

    const [notInDelegationSearch, setNotInDelegationSearch] = useState<string>('');

    useEffect(() => {
        if (dialogOpen && delegations.length === 0) {
            setDelegationsLoading(true);
            axiosInstance.get("/delegations")
            .then((response) => {
                setDelegationsLoading(false);
                setDelegations(response.data);
            })
        }
    }, [dialogOpen])

    return (
        <>
            {dialogOpen ? (
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Edit Committee Delegations</DialogTitle>
                    <DialogContent>
                        {delegationsLoading ? <CircularProgress /> : (
                            <Box>
                                <Typography>Delegations in Committee</Typography>
                                <List sx={{overflow: 'auto', width: '100%'}}>
                                    <TextField 
                                        fullWidth 
                                        label="Search" 
                                        variant="outlined" 
                                        value={notInDelegationSearch} 
                                        onChange={(e) => setNotInDelegationSearch(e.target.value)}
                                    />
                                    {committee.map((d) => d.delegation_name.startsWith(notInDelegationSearch) ? 
                                        <ListItem divider sx={{pl: '0', pr: '0'}}>
                                            <DelegationNotInCommittee key={d.delegation_id} delegation={d} search={notInDelegationSearch} />
                                        </ListItem> : null
                                    )}        
                                </List>
                                <Typography>Delegations not in Committee</Typography>
                                <List sx={{overflow: 'auto', width: '100%'}}>
                                    <TextField 
                                        fullWidth 
                                        label="Search" 
                                        variant="outlined" 
                                        value={notInDelegationSearch} 
                                        onChange={(e) => setNotInDelegationSearch(e.target.value)}
                                    />
                                    {delegations.map((d) => d.delegation_name.startsWith(notInDelegationSearch) ? 
                                        <ListItem divider sx={{pl: '0', pr: '0'}}>
                                            <DelegationNotInCommittee key={d.delegation_id} delegation={d} search={notInDelegationSearch} />
                                        </ListItem> : null
                                    )}        
                                </List>
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
            ) : null}
            <Button variant="contained" sx={{flex: 1, margin: 1}} onClick={() => setDialogOpen(true)}>
                Edit Delegations
            </Button>
        </>
    )
}