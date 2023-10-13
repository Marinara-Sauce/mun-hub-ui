import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Widget from "../../../widget/widget";
import DeleteCommittee from "./components/deleteCommittee";
import RenameCommittee from "./components/renameCommittee";

export default function AdminControls() {
    return (
      <>
        <Widget title="Admin Controls">
            <Box sx={{display: "flex"}}>
                <RenameCommittee />
                <DeleteCommittee />
            </Box>
        </Widget>
      </>
    );
}