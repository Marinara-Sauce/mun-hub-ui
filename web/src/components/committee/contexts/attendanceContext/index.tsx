import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AttendanceEntryType,
  AttendanceSession,
  Delegation,
} from "../../../../model/interfaces";
import { useApi } from "../../../../contexts/apiContext";
import { useCommittee } from "../committeeContext";

export type IAttendanceContext = {
  attendance: AttendanceSession;
  getDelegationAttendanceStatus: (
    delegationId: number,
  ) => AttendanceEntryType | undefined;
  getDelegationsInAttendance: (filter: AttendanceEntryType) => Delegation[];
  getAllDelegationsPresent: () => Delegation[];
  getAllAbsentDelegations: () => Delegation[];
};

const defaultAttendance: AttendanceSession = {
  live: false,
  committee_id: 0,
  open_time: "",
  close_time: "",
  entries: [],
  attendance_session_id: 0,
};

const AttendanceContext = createContext<IAttendanceContext>({
  attendance: defaultAttendance,
  getDelegationAttendanceStatus: () => undefined,
  getDelegationsInAttendance: () => [],
  getAllDelegationsPresent: () => [],
  getAllAbsentDelegations: () => [],
});

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const { axiosInstance } = useApi();
  const { committee } = useCommittee();

  const [attendanceSessionState, setAttendanceSessionState] =
    useState<AttendanceSession>(defaultAttendance);

  const setSocket = useState<WebSocket>()[1];

  // Fetches current attendance state on page load
  useEffect(() => {
    axiosInstance
      .get(`/attendance?committee_id=${committee.committee_id}`)
      .then((data) => {
        setAttendanceSessionState(data.data);
        console.log(attendanceSessionState);
      })
      .catch((r) => r.response.status === 404);
  }, [committee.committee_id]);

  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.REACT_APP_WS_URL}/attendance/${committee.committee_id}/ws`,
    );

    setSocket(socket);

    socket.onopen = () => {
      console.log("Attendance WS is open");
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

  function getDelegationAttendanceStatus(
    delegationId: number,
  ): AttendanceEntryType | undefined {
    return attendanceSessionState.entries.find(
      (d) => d.delegation_id === delegationId,
    )?.entry;
  }

  function getDelegationsInAttendance(
    filter: AttendanceEntryType,
  ): Delegation[] {
    const delegationIds =
      attendanceSessionState?.entries
        .filter((a) => a.entry === filter)
        .map((d) => d.delegation_id) ?? [];

    return committee.delegations.filter((d) =>
      delegationIds.includes(d.delegation_id),
    );
  }

  function getAllDelegationsPresent(): Delegation[] {
    return [
      ...getDelegationsInAttendance(AttendanceEntryType.PRESENT),
      ...getDelegationsInAttendance(AttendanceEntryType.PRESENT_AND_VOTING),
    ];
  }

  function getAllAbsentDelegations(): Delegation[] {
    return committee.delegations.filter(
      (d) => !getAllDelegationsPresent().includes(d),
    );
  }

  return (
    <AttendanceContext.Provider
      value={{
        attendance: attendanceSessionState,
        getDelegationAttendanceStatus,
        getAllDelegationsPresent,
        getDelegationsInAttendance,
        getAllAbsentDelegations,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  return useContext(AttendanceContext);
}
