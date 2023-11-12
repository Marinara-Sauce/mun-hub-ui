import Widget from "../../../widget/widget";
import { WorkingPaper } from "../../../../model/workingPaper";

import "./working-papers.css";
import WorkingPaperList from "./workingPaperList/workingPaperList";
import { useState } from "react";
import ManageWorkingPapers from "./manageWorkingPapers/manageWorkingPapers";

export default function WorkingPapers({
  workingPapers,
}: {
  workingPapers: WorkingPaper[];
}) {
  const [editing, setEditing] = useState(false);
  
  return (
    <Widget title="Working Papers" onEdit={() => setEditing(true)}>
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
            <ManageWorkingPapers currentWorkingPapers={workingPapers} /> : 
            <WorkingPaperList workingPapers={workingPapers} />
          }
        </tbody>
      </table>
    </Widget>
  );
}
