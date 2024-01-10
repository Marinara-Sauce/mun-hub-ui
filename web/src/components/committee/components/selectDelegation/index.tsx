import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useCommittee } from "../../contexts/committeeContext";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";

export default function SelectDelegation() {
  const { committee, userDelegation, applyUserDelegation } = useCommittee();
  const [selectedDelegation, setSelectedDelegation] = useState<string>();

  function setDelegation() {
    selectedDelegation && applyUserDelegation(selectedDelegation);
  }

  function clearDelegation() {
    setSelectedDelegation(undefined);
    applyUserDelegation("");
  }

  if (userDelegation) {
    return (
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {userDelegation.delegation_name}
          </Typography>
          <Typography>{"Currently Present and Voting"}</Typography>
        </Box>
        <IconButton aria-label="clear" onClick={clearDelegation}>
          <ClearIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <FormControl variant="standard" sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
        <InputLabel id="selectLabel">Select Delegation</InputLabel>
        <Select
          labelId="selectLabel"
          label="Delegation"
          id="selectDelegation"
          sx={{ flex: "1", m: 1 }}
          value={selectedDelegation || ""}
          onChange={(event) => setSelectedDelegation(event.target.value)}
        >
          {committee.delegations.map((d) => (
            <MenuItem key={d.delegation_id} value={d.delegation_name}>
              {d.delegation_name}
            </MenuItem>
          ))}
        </Select>
        <IconButton
          aria-label="select"
          disabled={!selectedDelegation}
          onClick={setDelegation}
        >
          <CheckIcon />
        </IconButton>
      </Box>
    </FormControl>
  );
}
