import { useState } from "react";
import { WorkingPaper } from "../../../../../model/workingPaper";
import { Button, TextField } from "@mui/material";

export default function ManageWorkingPapers({currentWorkingPapers}: {currentWorkingPapers: WorkingPaper[]}) {
    const [workingPapers, setWorkingPapers] = useState<WorkingPaper[]>(currentWorkingPapers);

    function addPaper() {
        setWorkingPapers([...workingPapers, {
            working_group_name: '', 
            working_paper_id: 1, 
            paper_link: '', 
            delegations: []
        }]);
    };

    return (
        <>
            {workingPapers.map((paper, index) => (
                <tr key={index}>
                    <td>
                        <TextField id="group-name" label="Working Group Name" variant="standard" sx={{width: "100%"}} />
                    </td>
                    <td>
                        {paper.delegations.map((d) => d.delegation_name).join(", ")}
                    </td>
                    <td>
                        <TextField id="paper-link" label="Working Paper Link" variant="standard" sx={{width: "100%"}} />
                    </td>
                </tr>
            ))}
            <Button variant="contained" sx={{m: 1}} onClick={addPaper}>+ Add Paper</Button>
        </>
    )
}