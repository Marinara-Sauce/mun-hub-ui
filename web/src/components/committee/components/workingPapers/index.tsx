import Widget from "../../../shared/widget";

import "./workingPapers.css";
import WorkingPaperList from "./components/workingPaperList";
import { useState } from "react";
import ManageWorkingPapers from "./components/manageWorkingPapers";
import { useCommittee } from "../../contexts/committeeContext";
import { useApi } from "../../../../contexts/apiContext";
import { Table, TableBody, TableHead, TableRow } from "@mui/material";

export default function WorkingPapers() {
  const { isLoggedIn } = useApi();
  const { committee } = useCommittee();

  const [editing, setEditing] = useState(false);

  return (
    <Widget
      title="Working Papers"
      onEdit={isLoggedIn ? () => setEditing(true) : undefined}
    >
      <Table className="table" sx={{textAlign: "left"}}>
        <TableHead>
          <TableRow className="table-header">
            <th>Working Group Name</th>
            <th>Group Members</th>
            <th>Paper Link</th>
          </TableRow>
        </TableHead>
        <TableBody>
          {editing ? (
            <ManageWorkingPapers
              currentWorkingPapers={committee.working_papers}
              exitEditMode={() => setEditing(false)}
            />
          ) : (
            <WorkingPaperList workingPapers={committee.working_papers} />
          )}
        </TableBody>
      </Table>
    </Widget>
  );
}
