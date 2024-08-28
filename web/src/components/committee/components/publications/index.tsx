import { Table, TableHead, TableRow, TableBody } from "@mui/material";
import Widget from "../../../shared/widget";
import { useCommittee } from "../../contexts/committeeContext";
import ManageWorkingPapers from "../workingPapers/components/manageWorkingPapers";
import { useState } from "react";
import { useApi } from "../../../../contexts/apiContext";
import PublicationsList from "./components/publicationsList";

export default function Publications() {
  const { isLoggedIn } = useApi();
  const { committee } = useCommittee();

  const [editing, setEditing] = useState(false);

  return (
    <Widget
      title="Publications"
      onEdit={isLoggedIn ? () => setEditing(true) : undefined}
    >
      <Table className="table" sx={{ textAlign: "left" }}>
        <TableHead>
          <TableRow className="table-header">
            <th>Publication Link</th>
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
            <PublicationsList publications={committee.publications ?? []} />
          )}
        </TableBody>
      </Table>
    </Widget>
  );
}
