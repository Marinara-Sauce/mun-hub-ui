import { Box, Button, Dialog, Modal, Typography } from "@mui/material";
import Widget from "../../../shared/widget";
import { useCommittee } from "../../contexts/committeeContext";
import { useApi } from "../../../../contexts/apiContext";
import { useEffect, useState } from "react";
import {
  AttendanceEntryType,
  AttendanceSession,
} from "../../../../model/interfaces";

export default function Attendance() {
  const { axiosInstance, isLoggedIn } = useApi();
  const { committee, userDelegation } = useCommittee();

  const setSocket = useState<WebSocket>()[1];
  const [userSubmitted, setUserSubmitted] = useState(false);

  const [attendanceSessionState, setAttendanceSessionState] =
    useState<AttendanceSession>();

  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.REACT_APP_WS_URL}/attendance/${committee.committee_id}/ws`,
    );

    setSocket(socket);

    socket.onopen = () => {
      console.log("Attendance WS is open");
    };

    socket.onmessage = (event) => {
      setAttendanceSessionState(JSON.parse(event.data));
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

  // Fetches current attendance state on page load
  useEffect(() => {
    axiosInstance
      .get(`/attendance?committee_id=${committee.committee_id}`)
      .then((data) => {
        setAttendanceSessionState(data.data);
        console.log(attendanceSessionState);
      })
      .catch((r) => r.response.status === 404);
  }, [committee.committee_id]);

  useEffect(() => {
    setUserSubmitted(
      attendanceSessionState?.entries.filter(
        (entry) => entry.delegation_id === userDelegation?.delegation_id,
      ).length !== 0,
    );
  }, [attendanceSessionState, userDelegation]);

  function submitAttendance(submission: AttendanceEntryType) {
    axiosInstance
      .post(
        `/attendance/submit?committee_id=${committee.committee_id}&delegation_id=${userDelegation?.delegation_id}&submission=${submission}`,
      )
      .then((res) => setAttendanceSessionState(res.data))
      .catch((r) => r.response.status === 404);
  }

  function startAttendance() {
    axiosInstance.post(`/attendance/start?committee_id=${committee.committee_id}`)
    .then((res) => setAttendanceSessionState(res.data))
    .catch((r) => r.response.status === 404);
  }
  
  function closeAttendance() {
    axiosInstance.post(`/attendance/end?committee_id=${committee.committee_id}`)
      .then((res) => setAttendanceSessionState(res.data))
      .catch((r) => r.response.status === 404);
  }

  return (
    <>
    <Dialog open={moreDetailsOpen} onClose={() => setMoreDetailsOpen(false)}>
      <Box sx={{display: "flex"}}>
        <Box>
          <Typography variant="h5">Present Delegations</Typography>
          {attendanceSessionState?.entries.filter((a) => a.entry === AttendanceEntryType.PRESENT ? (<Typography>{committee.delegations.filter((d) => d.delegation_id === a.delegation_id)}</Typography>) : null)}
        </Box>
        <Box>
          <Typography variant="h5">Present & Voting Delegations</Typography>
        </Box>
        <Box>
          <Typography variant="h5">Absent Delegations</Typography>
        </Box>
      </Box>
    </Dialog>
      {(attendanceSessionState?.live && userDelegation) || isLoggedIn ? (
        <Widget title="Attendance">
          {isLoggedIn ? (
            <Box sx={{ display: "flex", gap: 1 }}>
              {attendanceSessionState?.live ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
                <Box sx={{ display: "flex", gap: 1, textAlign: "center" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography>Present</Typography>
                    <Typography variant="h4">
                      {attendanceSessionState.entries.filter((e) => e.entry === AttendanceEntryType.PRESENT).length}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography>Present & Voting</Typography>
                    <Typography variant="h4">
                      {attendanceSessionState.entries.filter((e) => e.entry === AttendanceEntryType.PRESENT_AND_VOTING).length}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography>Not Present</Typography>
                    <Typography variant="h4">
                      {committee.delegations.filter((d) => !attendanceSessionState.entries.map((e) => e.delegation_id).includes(d.delegation_id)).length}
                    </Typography>
                  </Box>
                </Box>
                <Button sx={{width: "100%"}} variant="contained" onClick={() => setMoreDetailsOpen(true)}>More Details</Button>
                <Button sx={{width: "100%"}} variant="contained" onClick={closeAttendance}>Close Attendance</Button>
              </Box>
              ) : (
                <Button sx={{width: "100%"}} variant="contained" onClick={startAttendance}>Start Attendance</Button>
              )}
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              {userSubmitted ? (
                <Typography>Your attendance has been recorded</Typography>
              ) : (
                <>
                  <Button
                    variant="contained"
                    sx={{ flex: 1 }}
                    onClick={() =>
                      submitAttendance(AttendanceEntryType.PRESENT)
                    }
                  >
                    Present
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ flex: 1 }}
                    onClick={() =>
                      submitAttendance(AttendanceEntryType.PRESENT_AND_VOTING)
                    }
                  >
                    Present And Voting
                  </Button>
                </>
              )}
            </Box>
          )}
        </Widget>
      ) : null}
    </>
  );
}
