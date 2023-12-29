import { Table, TableBody, TableHead, TableRow, Typography } from "@mui/material";
import { Delegation } from "../../../../model/interfaces";
import PaperLink from "../../../shared/paperLink";

export default function WorkingPaperTable({
  delegation,
}: {
  delegation: Delegation;
}) {  
  console.log(delegation);

  return (
    <Table sx={{ textAlign: "left" }}>
      <TableHead>
        <TableRow className="table-header">
          <th>Committee Name</th>
          <th>Working Group Name</th>
          <th>Working Group Link</th>
        </TableRow>
      </TableHead>
      <TableBody>
        {!delegation.working_papers || delegation.working_papers.length == 0 ? (
          <Typography sx={{ m: 1 }}>No Data to Show :(</Typography>
        ) : (
          delegation.working_papers.map((wp, index) => (
            <TableRow key={index}>
              {/* A delegation can only be in a working group if they're also in that committee, so this should work. */}
              <td>{delegation.committees.find((c) => c.committee_id === wp.committee_id)?.committee_name}</td>
              <td>{wp.working_group_name}</td>
              <td>
                <PaperLink link={wp.paper_link} />
              </td>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
