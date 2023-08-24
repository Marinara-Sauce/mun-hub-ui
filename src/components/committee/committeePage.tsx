import Announcements from "./components/announcements/announcements";
import Attendance from "./components/attendance/attendance";
import SpeakersList from "./components/speakers-list/speakers-list";
import Voting from "./components/voting/voting";
import WorkingPapers from "./components/working-papers/working-papers";

import './committeePage.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Committee } from "../../model/committee";
import { useHeader } from "../../contexts/headerContext";
import ErrorModal from "../error/errorModal";

export default function CommitteeHub() {

    const { id } = useParams();

    const [committee, setCommittee] = useState<Committee>();

    const [error, setError] = useState<string>('');
    const [errorOpen, setErrorOpen] = useState<boolean>(false);

    const setHeader = useHeader()[1];

    useEffect(() => {
        fetch(`http://localhost:8000/committees/${id}`) // TODO: Place this in some env file
            .then((r) => r.json())
            .then((d: Committee) => {
                setCommittee(d as Committee);
                console.log(d)
            })
            .catch((e) => {
                console.log(e);
                setError(`${e.message}`)
                setErrorOpen(true);
            });
    }, []);

    useEffect(() => committee && setHeader(committee.committee_name), [committee]);

    const procedure: number = 2;

    return (
        <>
            <ErrorModal open={errorOpen} message={error} onClose={() => setErrorOpen(false)}/> 
            <div className="mainContainer">
                <div className="top">
                    <div className="left">
                        <Announcements />
                    </div>
                    <div className="right">
                        <SpeakersList />
                        {
                            procedure === 1 && (
                                <Voting />
                            )
                        }
                        {
                            procedure === 2 && (
                                <Attendance />
                            )
                        }
                    </div>
                </div>
                <div className="bottom">
                    <WorkingPapers />
                </div>
            </div>
        </>
    );
}