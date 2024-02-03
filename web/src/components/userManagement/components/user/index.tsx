import {
  TableRow,
  TableCell,
  TextField,
  Checkbox,
  Box,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useApi } from "../../../../contexts/apiContext";
import { AdminUser } from "../../../../model/interfaces";
import LoadingButton from "../../../shared/loadingButton";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteUser from "../deleteUser";
import { useUserList } from "../../contexts/userListContext";
import ChangePassword from "../changePassword";

export default function User({ user }: { user: AdminUser }) {
  const { axiosInstance, currentUser } = useApi();
  const { refreshUsers } = useUserList();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Editing states
  const [username, setUsername] = useState(user.username);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [superUser, setSuperUser] = useState(user.super_user);

  function updateUser() {
    setLoading(true);

    axiosInstance
      .patch("/user/update", {
        username,
        first_name: firstName,
        last_name: lastName,
        super_user: superUser,
        user_id: user.user_id,
      })
      .then(() => {
        stopEditing();
        refreshUsers();
      });
  }

  function stopEditing() {
    setLoading(false);
    setEditing(false);
  }

  if (editing) {
    return (
      <TableRow>
        <TableCell>
          <TextField
            id="username"
            label="Username"
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </TableCell>
        <TableCell>
          <TextField
            id="firstName"
            label="First Name"
            variant="standard"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </TableCell>
        <TableCell>
          <TextField
            id="lastName"
            label="Last Name"
            variant="standard"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </TableCell>
        <TableCell>
          <Checkbox
            checked={superUser}
            onChange={(event) => setSuperUser(event.target.checked)}
            disabled={
              currentUser?.user_id === user.user_id || user.user_id === 1
            }
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", gap: 1 }}>
            <ChangePassword user={user} />
            <LoadingButton
              variant="contained"
              sx={{ width: "100%" }}
              loading={loading}
              onClick={updateUser}
            >
              Save
            </LoadingButton>
            <Button onClick={stopEditing}>Cancel</Button>
          </Box>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{username}</TableCell>
      <TableCell>{firstName}</TableCell>
      <TableCell>{lastName}</TableCell>
      <TableCell>{superUser ? <CheckIcon /> : <CloseIcon />}</TableCell>
      <TableCell>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
          <DeleteUser user={user} />
        </Box>
      </TableCell>
    </TableRow>
  );
}
