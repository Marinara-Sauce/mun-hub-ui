import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Widget from "../../../widget/widget";
import "./attendance.css";
import React from "react";

export default function SpeakersList() {
  return (
    <Widget title="Attendance">
      <>
        <div className="buttonRow">
          <Button variant="contained">Present</Button>
          <Button variant="contained">Present And Voting</Button>
        </div>
      </>
    </Widget>
  );
}
