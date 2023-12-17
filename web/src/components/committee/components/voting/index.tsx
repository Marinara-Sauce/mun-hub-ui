import { Button, Box } from "@mui/material";
import Widget from "../../../widget/widget";

export default function SpeakersList() {
  return (
    <Widget title="Voting">
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" color="success" sx={{ flex: 1 }}>
          Yes
        </Button>
        <Button variant="contained" color="error" sx={{ flex: 1 }}>
          No
        </Button>
        <Button variant="contained" sx={{ flex: 1 }}>
          Abstain
        </Button>
      </Box>
    </Widget>
  );
}
