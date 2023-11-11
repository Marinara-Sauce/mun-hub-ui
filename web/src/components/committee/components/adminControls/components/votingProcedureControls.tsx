import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import { useCommittee } from "../../../contexts/committeeContext";
import { CommitteePollingType } from "../../../../../model/committee";

export default function VotingProcedureControls() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [ committee ] = useCommittee();

    const inVotingProcedure = committee?.committee_poll === CommitteePollingType.VOTING;

    return (
        <>
            <Dialog open={dialogOpen}>
                <DialogTitle>Voting Procedure</DialogTitle>
                <DialogContent>
                    {
                        !inVotingProcedure ? (
                            <Typography>Voting Procedure Has Not Started Yet</Typography>
                        ) : (
                            <Typography>Voting Procedure In Progress</Typography>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    {
                        inVotingProcedure ? (
                            <Button variant="contained" color="error">End Vote</Button>
                        ) : (
                            <Button variant="contained">Start Vote</Button>
                        )
                    }
                </DialogActions>
            </Dialog>
            <Button variant="contained" sx={{flex: 1, margin: 1}} onClick={() => setDialogOpen(true)}>Voting Procedure</Button>
        </>
    )
}