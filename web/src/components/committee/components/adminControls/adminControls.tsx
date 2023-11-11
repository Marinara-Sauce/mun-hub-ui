import { Box } from "@mui/material";
import Widget from "../../../widget/widget";
import DeleteCommittee from "./components/deleteCommittee";
import RenameCommittee from "./components/renameCommittee";
import EditDelegations from "./components/editDelegations";
import VotingProcedureControls from "./components/votingProcedureControls";

export default function AdminControls() {
    return (
      <>
        <Widget title="Admin Controls">
            <Box sx={{display: "flex"}}>
              <VotingProcedureControls />
              <RenameCommittee />
              <EditDelegations />
              <DeleteCommittee />
            </Box>
        </Widget>
      </>
    );
}