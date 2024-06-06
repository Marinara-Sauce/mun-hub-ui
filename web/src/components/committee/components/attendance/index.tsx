import { Box, Button, Dialog, Typography } from "@mui/material";
import Widget from "../../../shared/widget";
import { useCommittee } from "../../contexts/committeeContext";
import { useApi } from "../../../../contexts/apiContext";
import { useEffect, useState } from "react";
import { AttendanceEntryType } from "../../../../model/interfaces";
import DelegationAttendanceList from "./delegationAttendanceList";
import { useAttendance } from "../../contexts/attendanceContext";

export default function Attendance() {
  const { axiosInstance, isLoggedIn } = useApi();
  const { committee, userDelegation } = useCommittee();
  const {
    attendance,
    getDelegationAttendanceStatus,
    getDelegationsInAttendance,
    getAllAbsentDelegations,
  } = useAttendance();

  const [userSubmitted, setUserSubmitted] = useState(false);

  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false);

  useEffect(() => {
    setUserSubmitted(
      Boolean(
        userDelegation &&
          getDelegationAttendanceStatus(userDelegation.delegation_id),
      ),
    );
  }, [userDelegation, attendance]);

  function submitAttendance(submission: AttendanceEntryType) {
    axiosInstance
      .post(
        `/attendance/submit?committee_id=${committee.committee_id}&delegation_id=${userDelegation?.delegation_id}&submission=${submission}`,
      )
      .then()
      .catch((r) => r.response.status === 404);
  }

  function overrideAttendance(
    delegationId: number,
    submission: AttendanceEntryType,
  ) {
    axiosInstance
      .post(
        `/attendance/override?committee_id=${committee.committee_id}&delegation_id=${delegationId}&submission=${submission}`,
      )
      .catch((r) => r.response.status === 404);
  }

  function removeAttendance(delegationId: number) {
    axiosInstance
      .post(
        `/attendance/markabsent?committee_id=${committee.committee_id}&delegation_id=${delegationId}`,
      )
      .catch((r) => r.response.status === 404);
  }

  function startAttendance() {
    axiosInstance
      .post(`/attendance/start?committee_id=${committee.committee_id}`)
      .catch((r) => r.response.status === 404);
  }

  function closeAttendance() {
    axiosInstance
      .post(`/attendance/end?committee_id=${committee.committee_id}`)
      .catch((r) => r.response.status === 404);
  }

  return (
    <>
      <Dialog open={moreDetailsOpen} onClose={() => setMoreDetailsOpen(false)}>
        <Box sx={{ display: "flex", p: 2 }}>
          <DelegationAttendanceList
            delegations={getDelegationsInAttendance(
              AttendanceEntryType.PRESENT,
            )}
            columnTitle="Present Delegations"
            currentAttendance={AttendanceEntryType.PRESENT}
            overrideAttendance={overrideAttendance}
            removeAttendance={removeAttendance}
          />
          <DelegationAttendanceList
            columnTitle="Present & Voting Delegations"
            delegations={getDelegationsInAttendance(
              AttendanceEntryType.PRESENT_AND_VOTING,
            )}
            currentAttendance={AttendanceEntryType.PRESENT_AND_VOTING}
            overrideAttendance={overrideAttendance}
            removeAttendance={removeAttendance}
          />
          <DelegationAttendanceList
            columnTitle="Absent Delegations"
            delegations={getAllAbsentDelegations()}
            overrideAttendance={overrideAttendance}
            removeAttendance={removeAttendance}
          />
        </Box>
      </Dialog>
      {(attendance.live && userDelegation) || isLoggedIn ? (
        <Widget title="Attendance">
          {isLoggedIn ? (
            <Box sx={{ display: "flex", gap: 1 }}>
              {attendance.live ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, textAlign: "center" }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography>Present</Typography>
                      <Typography variant="h4">
                        {
                          getDelegationsInAttendance(
                            AttendanceEntryType.PRESENT,
                          ).length
                        }
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography>Present & Voting</Typography>
                      <Typography variant="h4">
                        {
                          getDelegationsInAttendance(
                            AttendanceEntryType.PRESENT_AND_VOTING,
                          ).length
                        }
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography>Not Present</Typography>
                      <Typography variant="h4">
                        {getAllAbsentDelegations().length}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    sx={{ width: "100%" }}
                    variant="contained"
                    onClick={() => setMoreDetailsOpen(true)}
                  >
                    More Details
                  </Button>
                  <Button
                    sx={{ width: "100%" }}
                    variant="contained"
                    onClick={closeAttendance}
                  >
                    Close Attendance
                  </Button>
                </Box>
              ) : (
                <Button
                  sx={{ width: "100%" }}
                  variant="contained"
                  onClick={startAttendance}
                >
                  Start Attendance
                </Button>
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
