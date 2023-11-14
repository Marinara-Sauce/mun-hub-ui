import { useState } from "react";
import { WorkingPaper } from "../../../../../model/workingPaper";
import { Box, Button, IconButton, TextField } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ManageWorkingPapers({currentWorkingPapers}: {currentWorkingPapers: WorkingPaper[]}) {
    const [workingPapers, setWorkingPapers] = useState<WorkingPaper[]>([...currentWorkingPapers]);

    function getNextPaperId() {
        if (workingPapers.length === 0) return 1;

        return workingPapers[workingPapers.length - 1].working_paper_id + 1;
    }
    function addPaper() {
        setWorkingPapers([...workingPapers, {
            working_group_name: '', 
            working_paper_id: getNextPaperId(), 
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
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Box sx={{flex: 1}}>
                                {paper.delegations.length === 0 ? "No Delegations" : null}
                                {paper.delegations.map((d) => d.delegation_name).join(", ")}
                            </Box>
                            <IconButton aria-label="delete" size="small">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </td>
                    <td>
                        <Box sx={{display: 'flex'}}>
                            <TextField id="paper-link" label="Working Paper Link" variant="standard" sx={{width: "100%", flexGrow: 1}} />
                            <IconButton aria-label="delete" size="small">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </td>
                </tr>
            ))}
            <Button variant="contained" sx={{m: 1}} onClick={addPaper}>+ Add Paper</Button>
        </>
    )
}