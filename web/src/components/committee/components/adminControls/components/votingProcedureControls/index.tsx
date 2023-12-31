import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCommittee } from "../../../../contexts/committeeContext";
import { CommitteePollingType } from "../../../../../../model/interfaces";
import LoadingButton from "../../../../../shared/loadingButton";

export default function VotingProcedureControls() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { committee, updateCommittee } = useCommittee();
  const [loading, setLoading] = useState(false);

  const [inVotingProcedure, setInVotingProcedure] = useState<boolean>(
    committee.committee_poll === CommitteePollingType.VOTING,
  );

  useEffect(
    () =>
      setInVotingProcedure(
        committee.committee_poll === CommitteePollingType.VOTING,
      ),
    [committee],
  );

  function toggleVote() {
    setLoading(true);
    updateCommittee(
      {
        ...committee,
        committee_poll: inVotingProcedure
          ? CommitteePollingType.NONE
          : CommitteePollingType.VOTING,
      },
      () => {
        setLoading(false);
      },
    );
  }

  return (
    <>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Voting Procedure</DialogTitle>
        <DialogContent>
          {!inVotingProcedure ? (
            <Typography>Voting Procedure Has Not Started Yet</Typography>
          ) : (
            <Typography>Voting Procedure In Progress</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {inVotingProcedure ? (
            <LoadingButton
              loading={loading}
              variant="contained"
              color="error"
              onClick={toggleVote}
            >
              End Vote
            </LoadingButton>
          ) : (
            <LoadingButton
              loading={loading}
              variant="contained"
              onClick={toggleVote}
            >
              Start Vote
            </LoadingButton>
          )}
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        sx={{ flex: 1, margin: 1 }}
        onClick={() => setDialogOpen(true)}
      >
        Voting Procedure
      </Button>
    </>
  );
}
