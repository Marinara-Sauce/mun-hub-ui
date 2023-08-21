import Announcements from "./components/announcements/announcements";
import Attendance from "./components/attendance/attendance";
import SpeakersList from "./components/speakers-list/speakers-list";
import Voting from "./components/voting/voting";
import WorkingPapers from "./components/working-papers/working-papers";

import './committee.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Committee } from "../../model/committee";

export default function CommitteeHub() {

    const { id } = useParams();

    const [committee, setCommittee] = useState<Committee>();

    useEffect(() => {
        fetch(`http://localhost:8000/committees/${id}`) // TODO: Place this in some env file
            .then((r) => r.json())
            .then((d) => {
                console.log(d);
                setCommittee(d);
            })
            .catch((e) => console.log(e)); // TODO: Error handling
    }, []);

    const procedure: number = 2;

    if (!committee) return <p>Committee {id} Not Found</p>

    return (
        <>
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