import Widget from "../../../widget/widget";

import "./workingPapers.css";
import WorkingPaperList from "./workingPaperList/workingPaperList";
import { useState } from "react";
import ManageWorkingPapers from "./manageWorkingPapers/manageWorkingPapers";
import { useCommittee } from "../../contexts/committeeContext";
import { useApi } from "../../../../contexts/authContext";

export default function WorkingPapers() {
  const { isLoggedIn } = useApi();
  const { committee } = useCommittee();

  const [editing, setEditing] = useState(false);
  
  return (
    <Widget title="Working Papers" onEdit={isLoggedIn ? () => setEditing(true) : undefined}>
      <table className="table">
        <thead>
          <tr className="table-header">
            <th>Working Group Name</th>
            <th>Group Members</th>
            <th>Paper Link</th>
          </tr>
        </thead>
        <tbody>
          {editing ? 
            <ManageWorkingPapers currentWorkingPapers={committee.working_papers} exitEditMode={() => setEditing(false)} /> : 
            <WorkingPaperList workingPapers={committee.working_papers} />
          }
        </tbody>
      </table>
    </Widget>
  );
}
