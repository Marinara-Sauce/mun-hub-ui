import { Drawer, Typography, TextField, InputAdornment, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { Delegation } from "../../../../model/delegation";

export default function SelectDelegation() {
    const [ delegations, setDelegations ] = useState<Delegation[]>([]);

    useEffect(() => {
        fetch(`http://localhost:8000/delegations`) // TODO: Place this in some env file
            .then((r) => r.json())
            .then((d) => {
                setDelegations(d);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    return (
        <Drawer anchor="left" open={true} sx={{width: "50%"}}>
            <Typography variant="h5" sx={{m: 2, borderBottom: 1, borderColor: 'divider', textAlign: 'center'}}>Select Delegation</Typography>
            <TextField label="Search" sx={{m: 2}} InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon />
                </InputAdornment>
            )}} />
            <List>
                {delegations.map((c) => (
                    <ListItem key={c.delegation_id}>
                        <ListItemButton component={Link} to={`/delegation/${c.delegation_id}`}>
                            <ListItemText>{c.delegation_name}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
                
            </List>
        </Drawer>
    );
}