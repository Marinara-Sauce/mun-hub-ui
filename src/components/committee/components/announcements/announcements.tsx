import Widget from "../../../widget/widget";
import { CommitteeStatus, CommitteeStatusToString } from "../../../../model/committee";
import { Box, Typography } from "@mui/material";

export default function Announcements({committee_status, announcement}: {committee_status: CommitteeStatus, announcement: string}) {
    return (
        <Widget title="Announcements">
            <Box>
                <Box sx={{ p: 1 }}>
                    <Typography variant="h3">Committee Status: {CommitteeStatusToString(committee_status)}</Typography>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Typography>{announcement}</Typography>
                </Box>
            </Box>
        </Widget>
    );
}