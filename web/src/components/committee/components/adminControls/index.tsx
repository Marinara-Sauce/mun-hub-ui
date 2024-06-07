import { Box } from "@mui/material";
import Widget from "../../../shared/widget";
import DeleteCommittee from "./components/deleteCommittee";
import RenameCommittee from "./components/renameCommittee";
import EditDelegations from "./components/editDelegations";

export default function AdminControls() {
  return (
    <Widget title="Edit Committee">
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <EditDelegations />
        <RenameCommittee />
        <DeleteCommittee />
      </Box>
    </Widget>
  );
}
