import {
  Box,
  Button,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import Widget from "../../../shared/widget";
import { useEffect, useState } from "react";
import { useCommittee } from "../../contexts/committeeContext";
import { useApi } from "../../../../contexts/apiContext";

interface SpeakerListEntry {
  speakerlist_id: number;
  committee_id: number;
  delegation_id: number;
  spoke: boolean;
  timestamp: string;
}

export default function SpeakersList() {
  const { committee, userDelegation } = useCommittee();
  const { axiosInstance } = useApi();
  
  const [currentList, setCurrentList] = useState<SpeakerListEntry[]>([]);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    axiosInstance.get(`/committees/${committee.committee_id}/speaker-list`).then((res) => setCurrentList(res.data));
    console.log(currentList);

  }, [setCurrentList, committee]);

  const handleChange = (event: SelectChangeEvent) => {
    setDisplayCount(+event.target.value);
  };

  const addButtonEnabled: boolean = committee.speaker_list_open && (userDelegation ? !currentList.find((s) => s.delegation_id === userDelegation.delegation_id) : false);

  return (
    <Widget title="Speakers List">
      <>
        <List>
          {currentList.length === 0 ? <Typography>No entries yet :(</Typography> : null}
          {currentList.map((s) => (
            <ListItem key={s.speakerlist_id}>{s.delegation_id}</ListItem>
          ))}
        </List>
        <Box sx={{display: "flex", gap: 1}}>
          <Button variant="contained" disabled={!addButtonEnabled} sx={{flex: 1}}>Add My Delegation to List</Button>
          <Box>
            <InputLabel id="select-num-items-label">
              # To Display
            </InputLabel>
            <Select
              labelId="select-num-items-label"
              id="select-num-items"
              label="# To Display"
              value={"" + displayCount}
              onChange={handleChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </Box>
        </Box>
      </>
    </Widget>
  );
}
