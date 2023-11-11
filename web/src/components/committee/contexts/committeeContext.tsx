import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Committee } from "../../../model/committee";
import { useAuth } from "../../../contexts/authContext";

export type ICommitteeContext = { 
    committee: Committee | undefined, 
    loading: boolean, 
    error: string, 
    updateCommittee: (updatedCommittee: Committee, then: () => void) => void, 
    refreshCommittee: () => void 
};

const CommitteeContext = createContext<ICommitteeContext>(
    {
        committee: undefined, 
        loading: false, 
        error: '', 
        updateCommittee: () => {}, 
        refreshCommittee: () => {}
    }
);

export function CommitteeProvider({ committee_id, children }: { committee_id?: string, children: ReactNode }) {
    const [ axiosInstance ] = useAuth();
    const [ committee, setCommittee ] = useState<Committee>();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => refreshCommittee(), [committee_id]);

    function updateCommittee(updatedCommittee: Committee, then: () => void) {
        axiosInstance.patch("/committees", updatedCommittee).then((response) => {
            setCommittee({
                ...committee,
                ...response.data
            });
            then();
        });
    };

    function refreshCommittee() {
        axiosInstance.get(`/committees/${committee_id}`)
        .then((response) => {
            setLoading(false);
            setCommittee(response.data);
        }).catch((error) => {
            setLoading(false);
            console.log(error)
            // TODO: Handle this
    });
}

    return (
        <CommitteeContext.Provider value={{
            committee, 
            loading, 
            error: '', 
            updateCommittee, 
            refreshCommittee
        }}>
            {children}
        </CommitteeContext.Provider>
    );
}

export function useCommittee() {
    return useContext(CommitteeContext);
}