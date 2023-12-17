import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Widget from "../../../shared/widget";
import "./speakers-list.css";
import React from "react";

export default function SpeakersList() {
  const currentList: string[] = [
    "USA",
    "Ukraine",
    "Russia",
    "Canada",
    "South America",
    "Uganda",
    "Brazil",
    "Europe",
    "Antartica",
    "Iran",
    "Estionia",
  ];

  const [displayCount, setDisplayCount] = React.useState(10);

  const handleChange = (event: SelectChangeEvent) => {
    setDisplayCount(+event.target.value);
  };

  return (
    <Widget title="Speakers List">
      <>
        <div className="list">
          {currentList.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </div>
        <div className="footer">
          <div className="addButton">
            <Button variant="contained">Add to List</Button>
          </div>
          <div className="selectCount">
            <InputLabel id="select-num-items" className="select-label">
              Number of Items to Display
            </InputLabel>
            <Select
              labelId="select-num-list-items"
              id="select-num-items"
              label="Items"
              value={"" + displayCount}
              onChange={handleChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </div>
        </div>
      </>
    </Widget>
  );
}
