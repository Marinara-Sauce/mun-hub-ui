import Widget from "../../../widget/widget";
import { WorkingPaper } from "../../../../model/workingPaper";

import "./working-papers.css";

export default function WorkingPapers({
  workingPapers,
}: {
  workingPapers: WorkingPaper[];
}) {
  return (
    <Widget title="Working Papers">
      <table className="table">
        <thead>
          <tr className="table-header">
            <th>Working Group Name</th>
            <th>Group Members</th>
            <th>Paper Link</th>
          </tr>
        </thead>
        <tbody>
          {workingPapers.length === 0 ? (
            <tr>
              <td>No Papers Yet :(</td>
            </tr>
          ) : (
            <>
              {workingPapers.map((paper, index) => (
                <tr key={index}>
                  <td>{paper.working_group_name}</td>
                  <td>
                    {paper.delegations.map((d) => d.delegation_name).join(", ")}
                  </td>
                  <td>
                    <a
                      href={paper.paper_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {paper.paper_link}
                    </a>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </Widget>
  );
}
