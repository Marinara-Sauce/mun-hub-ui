import Widget from "../../../widget/widget";
import {
  CommitteeStatusToString,
} from "../../../../model/committee";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useCommittee } from "../../contexts/committeeContext";
import { useAuth } from "../../../../contexts/authContext";
import { useEffect, useState } from "react";
import AnnouncementsJoditEditor from "./components/joditEditor/joditEditor";

export default function Announcements() {
  const [committee, loading] = useCommittee();
  const updateCommittee = useCommittee()[3];
  const fetchCommittee = useCommittee()[4];

  const [axiosInstance, authed] = useAuth();
  const [content, setContent] = useState<string>();
  
  const [editing, setEditing] = useState(false);

  useEffect(() => setContent(committee?.committee_announcement), [committee]);
  if (loading) return <CircularProgress />;

  function onEdit() {
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setContent(committee?.committee_announcement);
  }

  function onSave() {
    if (content && committee) {
      updateCommittee({
        ...committee,
        committee_announcement: content
      }, () => {
        setEditing(false);
      })
    }
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
              <div dangerouslySetInnerHTML={{ __html: committee ? committee.committee_announcement : '' }} /> 
            </Box>
          </Box>
        ) : (
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Box sx={{flex: '1'}}>
              <AnnouncementsJoditEditor content={content || ''} onChange={(newContent) => setContent(newContent)} />
            </Box>
            <Box sx={{display: 'flex', gap: 1}}>
              <Button variant='contained' sx={{flex: '1', my: 1}} onClick={onSave}>save</Button>
              <Button sx={{my: 1}} onClick={cancelEdit}>Cancel</Button>
            </Box>
          </Box>
        )}
    </Widget>
  );
}
