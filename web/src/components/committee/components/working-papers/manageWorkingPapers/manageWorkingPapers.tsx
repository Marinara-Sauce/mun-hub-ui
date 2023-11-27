import { useState } from "react";
import { WorkingPaper } from "../../../../../model/workingPaper";
import { Box, Button, TextField } from "@mui/material";
import ManageWorkingPaperDelegations from "./components/manageWorkingPaperDelegations";

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
                        <Box sx={{display: "flex"}}>
                            {paper.delegations.map((d) => d.delegation_name).join(", ")}
                            <ManageWorkingPaperDelegations workingPaper={paper} />
                        </Box>
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