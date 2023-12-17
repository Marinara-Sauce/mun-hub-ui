import { Typography } from "@mui/material";
import { Delegation } from "../../../../model/delegation";

export default function WorkingPaperTable({
  delegation,
}: {
  delegation: Delegation;
}) {
  return (
    <table className="table">
      <thead>
        <tr className="table-header">
          <th>Committee Name</th>
          <th>Working Group Name</th>
          <th>Working Group Members</th>
          <th>Working Group Link</th>
        </tr>
      </thead>
      <tbody>
        {!delegation.workingPapers || delegation.workingPapers.length == 0 ? (
          <Typography sx={{ m: 1 }}>No Data to Show :(</Typography>
        ) : (
          delegation.committees.map((row, index) => (
            <tr key={index}>
              <td>
                <a href={`/committee/${row.committee_id}`}>
                  {row.committee_name}
                </a>
              </td>
              <td>{row.committee_status}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
