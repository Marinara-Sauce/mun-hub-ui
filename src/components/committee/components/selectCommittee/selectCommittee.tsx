import { Drawer, Typography, TextField, InputAdornment, List, ListItem, ListItemButton, ListItemText, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";
import { Committee } from "../../../../model/committee";
import { Link } from "react-router-dom";
import AddCommittee from "../addCommittee/addCommittee";

export default function SelectCommittee() {

    const [ committees, setCommittees ] = useState<Committee[]>([]);

    useEffect(() => {
        fetch(`http://localhost:8000/committees`) // TODO: Place this in some env file
            .then((r) => r.json())
            .then((d) => {
                setCommittees(d);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    return (
        <Drawer anchor="left" open={true} sx={{width: "50%"}}>
            <Typography variant="h5" sx={{m: 2, borderBottom: 1, borderColor: 'divider', textAlign: 'center'}}>Select a Comittee</Typography>
            <TextField label="Search" sx={{m: 2}} InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon />
                </InputAdornment>
            )}} />
            
            <AddCommittee />
            <List>
                {committees.map((c) => (
                    <ListItem key={c.committee_id}>
                        <ListItemButton component={Link} to={`/committee/${c.committee_id}`}>
                            <ListItemText>{c.committee_name}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
                
            </List>
        </Drawer>
    );
    
}