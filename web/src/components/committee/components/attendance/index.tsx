import {
  Box,
  Button,
} from "@mui/material";
import Widget from "../../../widget/widget";

export default function SpeakersList() {
  return (
    <Widget title="Attendance">
      <Box sx={{display: "flex", gap: 1}}>
        <Button variant="contained" sx={{flex: 1}}>Present</Button>
        <Button variant="contained" sx={{flex: 1}}>Present And Voting</Button>
      </Box>
    </Widget>
  );
}
