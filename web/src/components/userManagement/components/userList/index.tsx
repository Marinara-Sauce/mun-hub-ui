import { Table, TableHead, TableRow, TableBody, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useApi } from "../../../../contexts/apiContext";
import { AdminUser } from "../../../../model/interfaces";
import Widget from "../../../shared/widget";
import User from "../user";
import CreateUser from "../createUser";

export default function UserList() {
    const { axiosInstance, isLoggedIn, currentUser } = useApi();
    const [users, setUsers] = useState<AdminUser[]>();
  
    useEffect(() => {
      if (isLoggedIn && currentUser?.super_user) {
        axiosInstance.get("/user").then((res) => setUsers(res.data));
      }
    }, [isLoggedIn, currentUser]);
  
    return (
      <Widget title="Manage Users">
        <>
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
          <Box sx={{ mt: 1 }}>
            <CreateUser />
          </Box>
        </>
      </Widget>
    );
}