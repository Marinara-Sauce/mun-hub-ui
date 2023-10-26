import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Committee } from "../../../model/committee";
import { useAuth } from "../../../contexts/authContext";

export type ICommitteeContext = [ Committee | undefined, boolean, string ];

const CommitteeContext = createContext<ICommitteeContext>(
    [undefined, false, '']
);

export function CommitteeProvider({ committee_id, children }: { committee_id?: string, children: ReactNode }) {
    const [ axiosInstance ] = useAuth();
    const [ committee, setCommittee ] = useState<Committee>();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        axiosInstance.get(`/committees/${committee_id}`)
            .then((response) => {
                setLoading(false);
                setCommittee(response.data);
            }).catch((error) => {
                setLoading(false);
                console.log(error)
                // TODO: Handle this
            });
    }, [committee_id]);

    return (
        <CommitteeContext.Provider value={[committee, loading, '']}>
            {children}
        </CommitteeContext.Provider>
    );
}

export function useCommittee() {
    return useContext(CommitteeContext);
}