import Announcements from "./components/announcements/announcements";
import Attendance from "./components/attendance/attendance";
import SpeakersList from "./components/speakers-list/speakers-list";
import Voting from "./components/voting/voting";
import WorkingPapers from "./components/working-papers/working-papers";

import './committee.css';

export default function Committee() {
    let procedure = 1; // 0 = none, 1 = voting, 2 = attendance
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