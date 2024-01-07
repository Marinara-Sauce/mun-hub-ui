import {
  Box,
  Button,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Typography,
} from "@mui/material";
import Widget from "../../../shared/widget";
import { useEffect, useState } from "react";
import { useCommittee } from "../../contexts/committeeContext";
import { useApi } from "../../../../contexts/apiContext";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "../../../shared/loadingButton";

interface SpeakerListEntry {
  speakerlist_id: number;
  committee_id: number;
  delegation_id: number;
  spoke: boolean;
  timestamp: string;
  delegation_name: string;
}

export default function SpeakersList() {
  const { committee, userDelegation, updateCommittee } = useCommittee();
  const { axiosInstance, isLoggedIn } = useApi();

  const [currentList, setCurrentList] = useState<SpeakerListEntry[]>([]);
  const [displayCount, setDisplayCount] = useState(10);

  const [addingToListLoading, setAddingToListLoading] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/committees/${committee.committee_id}/speaker-list`)
      .then((res) => setCurrentList(res.data));
  }, [setCurrentList, committee]);

  function onAddToList() {
    setAddingToListLoading(true);
    axiosInstance
      .post(
        `/committees/${committee.committee_id}/speaker-list?delegation_id=${userDelegation?.delegation_id}`,
      )
      .then(() => {
        setAddingToListLoading(false);
      });
  }

  function setSpeakerListEnabled(enabled: boolean) {
    updateCommittee(
      {
        ...committee,
        speaker_list_open: enabled,
      },
      () => {},
    );
  }

  const handleChange = (event: SelectChangeEvent) => {
    setDisplayCount(+event.target.value);
  };

  const addButtonEnabled: boolean =
    committee.speaker_list_open &&
    (userDelegation
      ? !currentList.find(
          (s) => s.delegation_id === userDelegation.delegation_id,
        )
      : false);

  return (
    <Widget title="Speakers List">
      <>
        <List>
          {currentList.length === 0 ? (
            <Typography>No entries yet :(</Typography>
          ) : null}
          {currentList.map((s, i) => (
            <>
              {i + 1 <= displayCount ? (
                <Box sx={{ display: "flex" }}>
                  <ListItem key={s.speakerlist_id} sx={{ flex: 1 }}>
                    {i + 1}. {s.delegation_name}
                  </ListItem>
                  {isLoggedIn ? (
                    <IconButton>
                      <CloseIcon />
                    </IconButton>
                  ) : null}
                </Box>
              ) : null}
            </>
          ))}
        </List>
        <Box sx={{ display: "flex", gap: 1 }}>
          {isLoggedIn ? (
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <Typography>Speaker List Open</Typography>
              <Switch
                onChange={(e) => setSpeakerListEnabled(e.target.checked)}
                checked={committee.speaker_list_open}
              />
            </Box>
          ) : (
            <LoadingButton
              loading={addingToListLoading}
              variant="contained"
              disabled={!addButtonEnabled}
              onClick={onAddToList}
            >
              Add My Delegation to List
            </LoadingButton>
          )}
          <Box>
            <InputLabel id="select-num-items-label"># To Display</InputLabel>
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
