import { TextField, Box, IconButton } from "@mui/material";
import { WorkingPaper } from "../../../../../../../../model/interfaces";
import DeleteIcon from "@mui/icons-material/Delete";
import { Delegation } from "../../../../../../../../model/interfaces";
import { useEffect, useState } from "react";
import ManageWorkingPaperDelegations from "../manageWorkingPaperDelegations";

export default function EditableWorkingPaper({
  workingPaper,
}: {
  workingPaper: WorkingPaper;
}) {
  const [groupName, setGroupName] = useState(workingPaper.working_group_name);
  const [paperLink, setPaperLink] = useState(workingPaper.paper_link);
  const [delegations, setDelegations] = useState(workingPaper.delegations);

  function updatePaperDelegations(
    workingPaper: WorkingPaper,
    delegations: Delegation[],
  ) {
    setDelegations(delegations);
  }

  useEffect(() => {
    workingPaper.working_group_name = groupName;
    workingPaper.paper_link = paperLink;
    workingPaper.delegations = delegations;
  }, [groupName, paperLink, delegations]);

  return (
    <>
      <td>
        <TextField
          id="group-name"
          label="Working Group Name"
          variant="standard"
          sx={{ width: "100%" }}
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
        />
      </td>
      <td>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {workingPaper.delegations.map((d) => d.delegation_name).join(", ")}
          <ManageWorkingPaperDelegations
            workingPaper={workingPaper}
            updatePaperDelegations={updatePaperDelegations}
          />
        </Box>
      </td>
      <td>
        <Box sx={{ display: "flex" }}>
          <TextField
            id="paper-link"
            label="Working Paper Link"
            variant="standard"
            sx={{ width: "100%", flexGrow: 1 }}
            value={paperLink}
            onChange={(event) => setPaperLink(event.target.value)}
          />
          <IconButton aria-label="delete" size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </td>
    </>
  );
}
