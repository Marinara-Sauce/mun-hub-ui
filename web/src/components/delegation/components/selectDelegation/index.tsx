import {
  Drawer,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { Delegation } from "../../../../model/delegation";
import { useApi } from "../../../../contexts/apiContext";

export default function SelectDelegation() {
  const { axiosInstance } = useApi();

  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [delegationSearch, setDelegationSearch] = useState<string>();

  useEffect(() => {
    axiosInstance.get("/delegations").then((r) => setDelegations(r.data));
  }, []);

  return (
    <Drawer anchor="left" open={true} sx={{ width: "50%" }}>
      <Typography
        variant="h5"
        sx={{
          m: 2,
          borderBottom: 1,
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        Select Delegation
      </Typography>
      <TextField
        label="Search"
        sx={{ m: 2 }}
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
              <ListItem key={c.delegation_id}>
                <ListItemButton
                  component={Link}
                  to={`/delegation/${c.delegation_id}`}
                >
                  <ListItemText>{c.delegation_name}</ListItemText>
                </ListItemButton>
              </ListItem>
            ) : null}
          </>
        ))}
      </List>
    </Drawer>
  );
}
