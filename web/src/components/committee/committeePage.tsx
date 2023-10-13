import Announcements from "./components/announcements/announcements";
import Attendance from "./components/attendance/attendance";
import SpeakersList from "./components/speakers-list/speakers-list";
import Voting from "./components/voting/voting";
import WorkingPapers from "./components/working-papers/working-papers";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHeader } from "../../contexts/headerContext";
import { Committee } from "../../model/committee";
import ErrorModal from "../error/errorModal";
import './committeePage.css';
import { Box } from "@mui/material";
import { useAuth } from "../../contexts/authContext";
import AdminControls from "./components/adminControls/adminControls";


export default function CommitteeHub() {

    const { id } = useParams();
    const [ axiosInstance, authed ] = useAuth();

    const [committee, setCommittee] = useState<Committee>();
    const [procedure, setProcedure] = useState<number>(1);

    const [error, setError] = useState<string>('');
    const [errorOpen, setErrorOpen] = useState<boolean>(false);

    const setHeader = useHeader()[1];

    useEffect(() => {
        fetch(`http://localhost:8000/committees/${id}`) // TODO: Place this in some env file
            .then((r) => r.json())
            .then((d: Committee) => {
                const committee = d as Committee;
                setCommittee(d);
                setProcedure(d.committee_poll);
                console.log(d)
            })
            .catch((e) => {
                console.log(e);
                setError(`${e.message}`)
                setErrorOpen(true);
            });
    }, []);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/committees/${id}/ws`)

        socket.onopen = () => {
            console.log("Websocket is open")
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            setProcedure(data)
        }

        const heartbeatInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send("heartbeat");
            }
          }, 1000);

        socket.onclose = () => {
            clearInterval(heartbeatInterval)
        }

        return () => socket.close();
    });

    useEffect(() => {committee && setHeader(committee.committee_name)}, [committee]);

    return (
        <>
            <ErrorModal open={errorOpen} message={error} onClose={() => setErrorOpen(false)}/>
            {committee && // TODO: Loading throbber for no committee
                <>
                    <Box className="mainContainer">
                        <Box className="top">
                            <Box className="left">
                                <Announcements committee_status={committee.committee_status} announcement={committee.committee_announcement} />
                            </Box>
                            <Box className="right">
                                <SpeakersList />
                                {
                                    procedure === 2 && (
                                        <Voting />
                                    )
                                }
                                {
                                    procedure === 3 && (
                                        <Attendance />
                                    )
                                }
                            </Box>
                        </Box>
                        <Box className="bottom">
                            <WorkingPapers workingPapers={committee.working_papers}/>
                        </Box>
                        <Box>
                            {authed && <AdminControls />}      
                        </Box>
                    </Box>
                </>
            }
        </>
    );
}