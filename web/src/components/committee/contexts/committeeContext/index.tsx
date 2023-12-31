import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Committee } from "../../../../model/interfaces";
import { useApi } from "../../../../contexts/apiContext";

export type ICommitteeContext = {
  committee: Committee;
  loading: boolean;
  error: string;
  updateCommittee: (updatedCommittee: Committee, then: () => void) => void;
  refreshCommittee: () => void;
};

const defaultCommittee: Committee = {
  committee_abbreviation: "",
  committee_id: 1,
  committee_announcement: "",
  committee_name: "",
  committee_poll: 1,
  committee_status: 1,
  committee_description: "",
  delegations: [],
  working_papers: [],
};

const CommitteeContext = createContext<ICommitteeContext>({
  committee: defaultCommittee,
  loading: false,
  error: "",
  updateCommittee: () => {},
  refreshCommittee: () => {},
});

export function CommitteeProvider({
  committee_id,
  children,
}: {
  committee_id?: string;
  children: ReactNode;
}) {
  const { axiosInstance } = useApi();
  const [committee, setCommittee] = useState<Committee>(defaultCommittee);
  const [loading, setLoading] = useState(true);

  useEffect(() => refreshCommittee(), [committee_id]);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8000/committees/${committee_id}/ws`,
    );

    socket.onopen = () => {
      console.log("Websocket is open");
    };

    socket.onmessage = (event) => {
      console.log(event);
      event.data === "UPDATE" && refreshCommittee();
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
  }, [committee_id]);

  function updateCommittee(updatedCommittee: Committee, then: () => void) {
    axiosInstance.patch("/committees", updatedCommittee).then((response) => {
      setCommittee({
        ...committee,
        ...response.data,
      });
      then();
    });
  }

  function refreshCommittee() {
    axiosInstance
      .get(`/committees/${committee_id}`)
      .then((response) => {
        setLoading(false);
        setCommittee(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        // TODO: Handle this
      });
  }

  return (
    <CommitteeContext.Provider
      value={{
        committee,
        loading,
        error: "",
        updateCommittee,
        refreshCommittee,
      }}
    >
      {children}
    </CommitteeContext.Provider>
  );
}

export function useCommittee() {
  return useContext(CommitteeContext);
}
