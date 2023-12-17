import { WorkingPaper } from "../../../../../model/workingPaper";

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
    </>
  );
}
