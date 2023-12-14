import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Committee, CommitteePollingType } from "../../../model/committee";
import { useApi } from "../../../contexts/authContext";

export type ICommitteeContext = {
  committee: Committee;
  loading: boolean;
  error: string;
  updateCommittee: (updatedCommittee: Committee, then: () => void) => void;
  setCommitteePoll: (new_poll: CommitteePollingType, then: () => void) => void;
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
  setCommitteePoll: () => {},
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

  function updateCommittee(updatedCommittee: Committee, then: () => void) {
    axiosInstance.patch("/committees", updatedCommittee).then((response) => {
      setCommittee({
        ...committee,
        ...response.data,
      });
      then();
    });
  }

  function setCommitteePoll(new_poll: CommitteePollingType, then: () => void) {
    axiosInstance
      .put(`/committees/${committee_id}/poll?new_poll=${new_poll}`)
      .then(() => {
        setCommittee({
          ...committee,
          committee_poll: new_poll,
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
        setCommitteePoll,
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
