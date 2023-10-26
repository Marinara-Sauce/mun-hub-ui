import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Widget from "../../../widget/widget";
import "./voting.css";
import React from "react";

export default function SpeakersList() {
  return (
    <Widget title="Voting">
      <>
        <div className="buttonRow">
          <Button variant="contained" color="success">
            Yes
          </Button>
          <Button variant="contained" color="error">
            No
          </Button>
          <Button variant="contained">Abstain</Button>
        </div>
      </>
    </Widget>
  );
}
