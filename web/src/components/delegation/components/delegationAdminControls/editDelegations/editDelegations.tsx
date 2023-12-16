import { useState, useEffect } from "react";
import { Delegation } from "../../../../../model/delegation";
import { useApi } from "../../../../../contexts/authContext";
import { Box, Button, IconButton, InputAdornment, List, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';

function EditableDelegation({delegation}: {delegation: Delegation}) {
    return (
        <Box sx={{display: "flex"}}>
            <Typography sx={{flex: 1}}>{delegation.delegation_name}</Typography>
            <IconButton aria-label="Rename" color="primary">
                <DriveFileRenameOutlineIcon />
            </IconButton>
            <IconButton aria-label="Delete" color="primary">
                <DeleteIcon />
            </IconButton>
        </Box>
    )
}

export default function EditDelegations() {
    const { axiosInstance } = useApi();

    const [delegations, setDelegations] = useState<Delegation[]>([]);
    const [delegationSearch, setDelegationSearch] = useState<string>();

    useEffect(() => {
        axiosInstance.get("/delegations").then((r) => setDelegations(r.data));
    }, []);

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
                {!delegationSearch || c.delegation_name.includes(delegationSearch) ? (
                    <EditableDelegation delegation={c} />
                ) : null}
            </>
            ))}
        </List>
      </>
    )
}