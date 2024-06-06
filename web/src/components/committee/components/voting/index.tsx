import { Button, Box, Typography } from "@mui/material";
import Widget from "../../../shared/widget";
import { useEffect, useState } from "react";
import { useCommittee } from "../../contexts/committeeContext";
import { useApi } from "../../../../contexts/apiContext";
import {
  AttendanceEntryType,
  VoteType,
  VotingSession,
} from "../../../../model/interfaces";
import { useAttendance } from "../../contexts/attendanceContext";

export default function Voting() {
  const { axiosInstance, isLoggedIn } = useApi();
  const { committee, userDelegation } = useCommittee();
  const { getDelegationAttendanceStatus } = useAttendance();

  const setSocket = useState<WebSocket>()[1];
  const [userVoted, setUserVoted] = useState(false);

  const [votingSessionState, setVotingSessionState] = useState<VotingSession>();

  // Handles voting WS
  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.REACT_APP_WS_URL}/voting/${committee.committee_id}/ws`,
    );

    setSocket(socket);

    socket.onopen = () => {
      console.log("Voting WS is open");
    };

    socket.onmessage = (event) => {
      setVotingSessionState(JSON.parse(event.data));
    };

    const heartbeatInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send("heartbeat");
      }
    }, 1000);

    socket.onclose = () => {
      clearInterval(heartbeatInterval);
      console.log("Websocket is closed");
    };

    return () => socket.close();
  }, [committee.committee_id]);

  // Fetches current voting state on page load
  useEffect(() => {
    axiosInstance
      .get(`/voting?committee_id=${committee.committee_id}`)
      .then((data) => setVotingSessionState(data.data))
      .catch((r) => r.response.status === 404);
  }, [committee.committee_id]);

  // Check if the user can vote (client side, there's a check on the API side too)
  useEffect(() => {
    setUserVoted(
      votingSessionState?.votes.filter(
        (vote) => vote.delegation_id === userDelegation?.delegation_id,
      ).length !== 0,
    );
  }, [votingSessionState, userDelegation]);

  function castVote(vote: VoteType) {
    axiosInstance
      .post(
        `/voting/vote?committee_id=${committee.committee_id}&delegation_id=${userDelegation?.delegation_id}&vote=${vote}`,
      )
      .then(() => setUserVoted(true));
  }

  function startVote() {
    // If the vote is started, the WS will pick up the new state
    axiosInstance.post(`/voting/start?committee_id=${committee.committee_id}`);
  }

  function endVote() {
    axiosInstance.post(`/voting/end?committee_id=${committee.committee_id}`);
  }

  function getTotalVotesOfType(voteType: VoteType): number {
    return votingSessionState
      ? votingSessionState?.votes.filter((v) => v.vote == voteType).length
      : 0;
  }

  const totalVotes =
    getTotalVotesOfType(VoteType.ABSTAIN) +
    getTotalVotesOfType(VoteType.NO) +
    getTotalVotesOfType(VoteType.YES);
  const percentParticipation =
    (totalVotes - getTotalVotesOfType(VoteType.ABSTAIN)) /
    committee.delegations.length;

  const insufficientQuorum: boolean = percentParticipation < 2 / 3;
  const votePassed: boolean =
    !insufficientQuorum &&
    getTotalVotesOfType(VoteType.YES) > getTotalVotesOfType(VoteType.NO);

  return (
    <>
      {(votingSessionState &&
        votingSessionState.live &&
        userDelegation &&
        getDelegationAttendanceStatus(userDelegation.delegation_id)) ||
      isLoggedIn ? (
        <Widget title="Voting">
          {isLoggedIn ? (
            <>
              {votingSessionState && votingSessionState.live ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", gap: 1, textAlign: "center" }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography>Yes</Typography>
                      <Typography variant="h4">
                        {getTotalVotesOfType(VoteType.YES)}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography>No</Typography>
                      <Typography variant="h4">
                        {getTotalVotesOfType(VoteType.NO)}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography>Abstain</Typography>
                      <Typography variant="h4">
                        {getTotalVotesOfType(VoteType.ABSTAIN)}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography>Unaccounted</Typography>
                      <Typography variant="h4">
                        {committee.delegations.length - totalVotes}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography sx={{ flex: 1 }}>
                      Percentage of Quorum Voted:{" "}
                      {Math.round(percentParticipation * 100)}%
                    </Typography>
                    <Typography color={votePassed ? "green" : "error"}>
                      {votePassed
                        ? "Vote Passed"
                        : insufficientQuorum
                        ? "Insufficient Quorum"
                        : "Vote Failed"}
                    </Typography>
                  </Box>
                  <Button
                    sx={{ flex: 1 }}
                    variant="contained"
                    color="error"
                    onClick={endVote}
                  >
                    End Vote
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  sx={{ display: "flex", width: "100%" }}
                  onClick={startVote}
                >
                  Start Vote
                </Button>
              )}
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              {userVoted ? (
                <Typography>{"You've already voted"}</Typography>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ flex: 1 }}
                    onClick={() => castVote(VoteType.YES)}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ flex: 1 }}
                    onClick={() => castVote(VoteType.NO)}
                  >
                    No
                  </Button>
                  {getDelegationAttendanceStatus(
                    userDelegation!.delegation_id,
                  ) === AttendanceEntryType.PRESENT_AND_VOTING ? (
                    <Button
                      variant="contained"
                      sx={{ flex: 1 }}
                      onClick={() => castVote(VoteType.ABSTAIN)}
                    >
                      Abstain
                    </Button>
                  ) : null}
                </>
              )}
            </Box>
          )}
        </Widget>
      ) : null}
    </>
  );
}
