import { WorkingPaper } from "../../../../../../model/interfaces";
import PaperLink from "../../../../../shared/paperLink";

export default function WorkingPaperList({
  workingPapers,
}: {
  workingPapers: WorkingPaper[];
}) {
  return (
    <>
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
                <PaperLink link={paper.paper_link} />
              </td>
            </tr>
          ))}
        </>
      )}
    </>
  );
}
