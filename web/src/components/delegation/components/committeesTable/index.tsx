import { Table, TableBody, TableHead, TableRow, Typography } from "@mui/material";
import { Delegation } from "../../../../model/interfaces";

export default function CommitteesTable({
  delegation,
}: {
  delegation: Delegation;
}) {
  return (
    <Table className="table" sx={{textAlign: "left"}}>
      <TableHead>
        <TableRow className="table-header">
          <th>Committee Name</th>
          <th>Committee Status</th>
        </TableRow>
      </TableHead>
      <TableBody>
        {!delegation.committees || delegation.committees.length == 0 ? (
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
      </TableBody>
    </Table>
  );
}
