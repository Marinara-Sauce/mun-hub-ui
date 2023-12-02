import { useState } from "react";
import { WorkingPaper } from "../../../../../model/workingPaper";
import { Button } from "@mui/material";
import LoadingButton from "../../../../shared/loadingButton/loadingButton";
import { useCommittee } from "../../../contexts/committeeContext";
import { useAuth } from "../../../../../contexts/authContext";
import EditableWorkingPaper from "./components/editableWorkingPaper";

interface WorkingPaperRequest {
    paper_link: string;
    working_group_name: string;
    committee_id: number;
    delegation_ids: number[];
}
export default function ManageWorkingPapers({
    currentWorkingPapers,
    exitEditMode,
}: {
    currentWorkingPapers: WorkingPaper[];
    exitEditMode: () => void;
}) {
    const [ axiosInstance ] = useAuth();
    const { committee, refreshCommittee } = useCommittee();
    
    const [workingPapers, setWorkingPapers] = useState<WorkingPaper[]>([...currentWorkingPapers]);

    const [loading, setLoading] = useState(false);

    function getNextPaperId() {
        if (workingPapers.length === 0) return 1;

        return workingPapers[workingPapers.length - 1].working_paper_id + 1;
    }

    function addPaper() {
        setWorkingPapers([...workingPapers, {
            working_group_name: '',
            working_paper_id: getNextPaperId(),
            committee_id: committee.committee_id,
            paper_link: '', 
            delegations: []
        }]);
    };

    function onSaveWorkingPapers() {
        setLoading(true);

        const workingPaperRequest: WorkingPaperRequest[] = workingPapers.map((wp) => {
            return {
                paper_link: wp.paper_link,
                working_group_name: wp.working_group_name,
                committee_id: committee.committee_id,
                delegation_ids: wp.delegations.map((d) => d.delegation_id),
            }
        });

        axiosInstance.patch(`/committees/${committee.committee_id}/working-papers`, workingPaperRequest).then(() => {
            setLoading(false);
            refreshCommittee();
            exitEditMode();
        });
    }

    return (
        <>
            {workingPapers.map((paper, index) => (
                <tr key={index}>
                    <EditableWorkingPaper key={index} workingPaper={paper} />
                </tr>
            ))}
            <Button variant="contained" sx={{m: 1}} onClick={addPaper}>+ Add Paper</Button>
            <LoadingButton variant="contained" loading={loading} onClick={onSaveWorkingPapers}>Save</LoadingButton>
            <Button sx={{m: 1}} onClick={exitEditMode} >Cancel</Button>
        </>
    )
}