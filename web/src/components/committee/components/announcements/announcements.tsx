import Widget from "../../../widget/widget";
import {
  CommitteeStatusToString,
} from "../../../../model/committee";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useCommittee } from "../../contexts/committeeContext";
import { useAuth } from "../../../../contexts/authContext";
import { useState } from "react";
import AnnouncementsJoditEditor from "./components/joditEditor/joditEditor";

export default function Announcements() {
  const [committee, loading] = useCommittee();
  const [axiosInstance, authed] = useAuth();
  
  const [editing, setEditing] = useState(false);

  if (loading) return <CircularProgress />;

  function onEdit() {
    console.log('hello')
    setEditing(true);
  }

  return (
    <Widget title="Announcements" onEdit={authed ? onEdit : undefined}>
      {!editing ? (
          <Box>
            <Box sx={{ p: 1 }}>
              <Typography variant="h3">
                {CommitteeStatusToString(committee?.committee_status)}
              </Typography>
            </Box>
            <Box sx={{ p: 1 }}>
              <Typography>{committee?.committee_announcement}</Typography>
            </Box>
          </Box>
        ) : (
          <AnnouncementsJoditEditor />
        )}
    </Widget>
  );
}
