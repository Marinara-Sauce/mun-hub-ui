import Announcements from "./components/announcements";
import Attendance from "./components/attendance";
import SpeakersList from "./components/speakersList";
import Voting from "./components/voting";
import WorkingPapers from "./components/workingPapers";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHeader } from "../../contexts/headerContext";
import { Box, CircularProgress } from "@mui/material";
import { useApi } from "../../contexts/apiContext";
import AdminControls from "./components/adminControls";
import { CommitteeProvider, useCommittee } from "./contexts/committeeContext";
import Widget from "../shared/widget";
import SelectDelegation from "./components/selectDelegation";
import { AttendanceProvider } from "./contexts/attendanceContext";
import Publications from "./components/publications";

function CommitteeLayout() {
  // Contexts
  const { isLoggedIn } = useApi();
  const { committee, loading } = useCommittee();
  const { setHeader } = useHeader();

  // Update page header
  useEffect(
    () => setHeader(committee ? committee.committee_name : ""),
    [committee],
  );

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box sx={{ display: "flex" }}>
            <AttendanceProvider>
              <Box sx={{ flexBasis: "45%" }}>
                {!isLoggedIn ? (
                  <Widget title="My Delegation">
                    <SelectDelegation />
                  </Widget>
                ) : null}
                {isLoggedIn ? <AdminControls /> : null}
                <Voting />
                <Attendance />
                <SpeakersList />
              </Box>
            </AttendanceProvider>
            <Box sx={{ width: "100%" }}>
              <Announcements />
              <Publications />
              <WorkingPapers />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

export default function CommitteeHub() {
  const { id } = useParams();

  return (
    <CommitteeProvider committee_id={id}>
      <CommitteeLayout />
    </CommitteeProvider>
  );
}
