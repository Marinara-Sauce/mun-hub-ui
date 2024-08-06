import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Committee, Delegation } from "../../../../model/interfaces";
import { useApi } from "../../../../contexts/apiContext";

export type ICommitteeContext = {
  committee: Committee;
  userDelegation?: Delegation;
  loading: boolean;
  error: string;
  updateCommittee: (updatedCommittee: Committee, then: () => void) => void;
  refreshCommittee: () => void;
  applyUserDelegation: (delegation: string) => void;
  socket?: WebSocket;
  speakersListVersion: number;
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
  speaker_list_open: false,
};

const CommitteeContext = createContext<ICommitteeContext>({
  committee: defaultCommittee,
  loading: false,
  error: "",
  speakersListVersion: 0,
  updateCommittee: () => {},
  refreshCommittee: () => {},
  applyUserDelegation: () => {},
});

export function CommitteeProvider({
  committee_id,
  children,
}: {
  committee_id?: string;
  children: ReactNode;
}) {
  const { axiosInstance } = useApi();

  // The current pages committee
  const [committee, setCommittee] = useState<Committee>(defaultCommittee);
  // The current user's delegation
  const [userDelegation, setUserDelegation] = useState<Delegation>();

  // Used to update the speakers list
  const [speakersListVersion, setSpeakersListVersion] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => refreshCommittee(), [committee_id]);

  useEffect(() => {
    const delegationName = localStorage.getItem("delegation");

    if (!delegationName) {
      return;
    }

    const foundDelegation = committee.delegations.find(
      (d) => d.delegation_name.toLowerCase() === delegationName.toLowerCase(),
    );

    setUserDelegation(foundDelegation);
  }, [committee, localStorage.getItem("delegation")]);

  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.REACT_APP_WS_URL}/committees/${committee_id}/ws`,
    );

    socket.onopen = () => {
      console.log("Websocket is open");
    };

    socket.onmessage = (event) => {
      event.data === "UPDATE" && refreshCommittee();
      event.data === "SPEAKER" && setSpeakersListVersion(prev => prev + 1);
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

  function applyUserDelegation(delegation: string) {
    localStorage.setItem("delegation", delegation);
    setUserDelegation(
      committee.delegations.find((d) => d.delegation_name === delegation),
    );
  }

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
        userDelegation,
        loading,
        error: "",
        speakersListVersion,
        updateCommittee,
        refreshCommittee,
        applyUserDelegation,
      }}
    >
      {children}
    </CommitteeContext.Provider>
  );
}

export function useCommittee() {
  return useContext(CommitteeContext);
}
