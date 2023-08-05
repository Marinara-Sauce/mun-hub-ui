import Attendance from "./components/attendance/attendance";
import SpeakersList from "./components/speakers-list/speakers-list";
import Voting from "./components/voting/voting";

export default function Committee() {
    return (
        <>
            <SpeakersList />
            <Voting />
            <Attendance />
        </>
    );
}