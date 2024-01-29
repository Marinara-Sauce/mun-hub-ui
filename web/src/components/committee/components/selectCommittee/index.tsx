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
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { Committee } from "../../../../model/interfaces";
import { Link } from "react-router-dom";
import AddCommittee from "../addCommittee";
import { useApi } from "../../../../contexts/apiContext";

export default function SelectCommittee() {
  const { axiosInstance } = useApi();
  const [committees, setCommittees] = useState<Committee[]>([]);

  useEffect(() => {
    axiosInstance.get("/committees").then((r) => setCommittees(r.data));
  }, [axiosInstance]);

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
        Select a Comittee
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
      />

      <AddCommittee />
      <List>
        {committees.map((c) => (
          <ListItem key={c.committee_id}>
            <ListItemButton
              component={Link}
              to={`/committee/${c.committee_id}`}
            >
              <ListItemText>{c.committee_name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
