import { Box } from "@mui/material";
import Widget from "../../../shared/widget";
import DeleteCommittee from "./components/deleteCommittee";
import RenameCommittee from "./components/renameCommittee";
import EditDelegations from "./components/editDelegations";
import AttendanceProcedureControls from "./components/attendanceProcedureControls";

export default function AdminControls() {
  return (
    <Widget title="Admin Controls">
      <Box sx={{ display: "flex" }}>
        <AttendanceProcedureControls />
        <RenameCommittee />
        <EditDelegations />
        <DeleteCommittee />
      </Box>
    </Widget>
  );
}
