import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  Box,
  CircularProgress,
} from "@mui/material";
import Widget from "../../../shared/widget";
import User from "../user";
import CreateUser from "../createUser";
import { useUserList } from "../../contexts/userListContext";

export default function UserList() {
  const { users, loading } = useUserList();

  return (
    <Widget title="Manage Users">
      <>
        {loading ? (
          <CircularProgress />
        ) : (
          <Table sx={{ textAlign: "left" }}>
            <TableHead>
              <TableRow className="table-header">
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Super User</th>
                <th>Edit</th>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((u) => <User key={u.user_id} user={u} />)}
            </TableBody>
          </Table>
        )}
        <Box sx={{ mt: 1 }}>
          <CreateUser />
        </Box>
      </>
    </Widget>
  );
}
