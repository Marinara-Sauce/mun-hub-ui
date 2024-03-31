import { Box, Button } from "@mui/material";
import Widget from "../../../shared/widget";
import { useCommittee } from "../../contexts/committeeContext";
import { useApi } from "../../../../contexts/apiContext";
import { useEffect, useState } from "react";
import { AttendanceSession } from "../../../../model/interfaces";

export default function Attendance() {
  const { axiosInstance, isLoggedIn } = useApi();
  const { committee, userDelegation } = useCommittee();
  
  const setSocket = useState<WebSocket>()[1];
  const [userSubmitted, setUserSubmitted] = useState(false);

  const [attendanceSessionState, setAttendanceSessionState] = useState<AttendanceSession>();

  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.REACT_APP_WS_URL}/attendance/${committee.committee_id}/ws`,
    );

    setSocket(socket);

    socket.onopen = () => {
      console.log("Voting WS is open");
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
      .get(`/voting?committee_id=${committee.committee_id}`)
      .then((data) => setAttendanceSessionState(data.data))
      .catch((r) => r.response.status === 404);
  }, [committee.committee_id]);

  useEffect(() => {
    setUserSubmitted(
      attendanceSessionState?.entries.filter(
        (entry) => entry.delegation_id === userDelegation?.delegation_id,
      ).length !== 0,
    );
  }, [attendanceSessionState, userDelegation]);
  
  return (
    <>
      {(attendanceSessionState?.live || isLoggedIn) ? (
        <Widget title="Attendance">
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" sx={{ flex: 1 }}>
              Present
            </Button>
            <Button variant="contained" sx={{ flex: 1 }}>
              Present And Voting
            </Button>
          </Box>
        </Widget>
      ) : null}
    </>
  );
}
