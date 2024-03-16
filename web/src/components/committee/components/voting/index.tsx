import { Button, Box } from "@mui/material";
import Widget from "../../../shared/widget";
import { useEffect, useState } from "react";
import { useCommittee } from "../../contexts/committeeContext";

export default function Voting() {

  const { committee } = useCommittee();

  const [ socket, setSocket ] = useState<WebSocket>();

  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.REACT_APP_WS_URL}/voting/${committee.committee_id}/ws`,
    );

    setSocket(socket);

    socket.onopen = () => {
      console.log("Voting WS is open");
    };

    socket.onmessage = (event) => {
      console.log(event);
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


  return (
    <Widget title="Voting">
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" color="success" sx={{ flex: 1 }}>
          Yes
        </Button>
        <Button variant="contained" color="error" sx={{ flex: 1 }}>
          No
        </Button>
        <Button variant="contained" sx={{ flex: 1 }}>
          Abstain
        </Button>
      </Box>
    </Widget>
  );
}
