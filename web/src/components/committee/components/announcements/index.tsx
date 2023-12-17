import Widget from "../../../widget/widget";
import {
  Committee,
  CommitteeStatus,
  CommitteeStatusToString,
} from "../../../../model/committee";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useCommittee } from "../../contexts/committeeContext";
import { useApi } from "../../../../contexts/authContext";
import { useState } from "react";
import AnnouncementsJoditEditor from "./components/joditEditor";

export default function Announcements() {
  const { committee, updateCommittee } = useCommittee();
  const { isLoggedIn } = useApi();

  const [content, setContent] = useState<string>(
    committee.committee_announcement,
  );
  const [status, setStatus] = useState<CommitteeStatus>(
    committee.committee_status,
  );

  const [editing, setEditing] = useState(false);

  function onEdit() {
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setContent(committee.committee_announcement);
  }

  function onSave() {
    updateCommittee(
      {
        ...committee,
        committee_announcement: content,
        committee_status: status,
      },
      () => {
        setEditing(false);
      },
    );
  }

  return (
    <Widget title="Announcements" onEdit={isLoggedIn ? onEdit : undefined}>
      {!editing ? (
        <Box>
          <Box sx={{ p: 1 }}>
            <Typography variant="h3">
              {CommitteeStatusToString(committee.committee_status)}
            </Typography>
          </Box>
          <Box sx={{ p: 1 }}>
            <div
              dangerouslySetInnerHTML={{
                __html: committee ? committee.committee_announcement : "",
              }}
            />{" "}
            {/* TODO: This is so insecure its not even funny. Fix it */}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="select-label">Committee Status</InputLabel>
            <Select
              labelId="select-label"
              id="state"
              label="Committee State"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as CommitteeStatus)
              }
            >
              <MenuItem value={CommitteeStatus.IN_SESSION}>In Session</MenuItem>
              <MenuItem value={CommitteeStatus.MOD}>Moderated Caucus</MenuItem>
              <MenuItem value={CommitteeStatus.UNMOD}>
                Unmoderated Caucus
              </MenuItem>
              <MenuItem value={CommitteeStatus.OUT_OF_SESSION}>
                Out of Session
              </MenuItem>
              <MenuItem value={CommitteeStatus.SUSPENDED_SESSION}>
                Suspended Session
              </MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ flex: "1" }}>
            <AnnouncementsJoditEditor
              content={content || ""}
              onChange={(newContent) => setContent(newContent)}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              sx={{ flex: "1", my: 1 }}
              onClick={onSave}
            >
              save
            </Button>
            <Button sx={{ my: 1 }} onClick={cancelEdit}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Widget>
  );
}
