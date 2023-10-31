import Announcements from "./components/announcements/announcements";
import Attendance from "./components/attendance/attendance";
import SpeakersList from "./components/speakers-list/speakers-list";
import Voting from "./components/voting/voting";
import WorkingPapers from "./components/working-papers/working-papers";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHeader } from "../../contexts/headerContext";
import ErrorModal from "../error/errorModal";
import './committeePage.css';
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../contexts/authContext";
import AdminControls from "./components/adminControls/adminControls";
import { CommitteeProvider, useCommittee } from "./contexts/committeeContext";

function CommitteeLayout() {
    const { id } = useParams();

    // Contexts
    const authed = useAuth()[1];
    const [ committee, loading, error ] = useCommittee();
    const setHeader = useHeader()[1];

    // Committee States
    const [procedure, setProcedure] = useState<number>(1);
    const [errorOpen, setErrorOpen] = useState<boolean>(false);
    
    // Connect to websocket for polling
    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/committees/${id}/ws`)

    socket.onopen = () => {
      console.log("Websocket is open");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProcedure(data);
    };

    const heartbeatInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send("heartbeat");
      }
    }, 1000);

    socket.onclose = () => {
      clearInterval(heartbeatInterval);
    };

    return () => socket.close();
  });

    // Update page header
    useEffect(() => setHeader(committee ? committee.committee_name : ''), [committee]);

    return (
        <>
            <ErrorModal open={errorOpen} message={'as'} onClose={() => setErrorOpen(false)}/>
            {!committee ? <CircularProgress /> : 
                <>
                    <Box className="mainContainer">
                        <Box className="top">
                            <Box className="left">
                                <Announcements />
                            </Box>
                            <Box className="right">
                                <SpeakersList />
                                { procedure === 2 ? <Voting /> : null }
                                { procedure === 3 ? <Attendance /> : null }
                            </Box>
                        </Box>
                        <Box className="bottom">
                            <WorkingPapers workingPapers={committee.working_papers}/>
                        </Box>
                        <Box>
                            {authed ? <AdminControls /> : null}      
                        </Box>
                    </Box>
                </>
            }
        </>
    )
}

export default function CommitteeHub() {
    const { id } = useParams();

    return (
        <CommitteeProvider committee_id={id}>
            <CommitteeLayout />
        </CommitteeProvider>
    );
}
