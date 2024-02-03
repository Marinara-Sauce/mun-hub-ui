import { useEffect, useRef, useState } from "react";
import { useApi } from "../../contexts/apiContext";
import PageError from "../pageError";
import { AdminUser } from "../../model/interfaces";
import Widget from "../shared/widget";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button,
  TextField,
  Box,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "../shared/loadingButton";

function UserRow({ user }: { user: AdminUser }) {
  const { axiosInstance, currentUser } = useApi();

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
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              onClick={() => setEditing(true)}
            >
              Change Password
            </Button>
            <LoadingButton
              variant="contained"
              sx={{ width: "100%" }}
              loading={loading}
              onClick={updateUser}
            >
              Save
            </LoadingButton>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              onClick={stopEditing}
            >
              Cancel
            </Button>
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
        <Button
          variant="contained"
          sx={{ width: "100%" }}
          onClick={() => setEditing(true)}
        >
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
}

function UserList() {
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
            {users?.map((u) => <UserRow key={u.user_id} user={u} />)}
          </TableBody>
        </Table>
        <Box sx={{ mt: 1 }}>
          <CreateUser />
        </Box>
      </>
    </Widget>
  );
}

function CreateUser() {
  const { axiosInstance } = useApi();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const usernameRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const superUserRef = useRef<HTMLInputElement>(null);

  useEffect(() => setError(""), [dialogOpen]);

  function createUser() {
    if (!usernameRef.current?.value || !firstNameRef.current?.value || !lastNameRef.current?.value || !passwordRef.current?.value || !confirmPasswordRef.current?.value) {
      setError("All fields must be filled out!");
      return;
    }

    if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
      setError("The two passwords do not match!");
      return;
    }

    setLoading(true);
    axiosInstance
      .post("/user/create", {
        username: usernameRef.current?.value,
        unhashed_password: passwordRef.current?.value,
        first_name: firstNameRef.current?.value,
        last_name: lastNameRef.current?.value,
        super_user: superUserRef.current?.checked,
      })
      .then(() => {
        setLoading(false);
        setDialogOpen(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }

  return (
    <>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1 }}>
            <TextField label="Username" fullWidth inputRef={usernameRef} />
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField label="First Name" fullWidth inputRef={firstNameRef} />
              <TextField label="Last Name" fullWidth inputRef={lastNameRef} />
            </Box>
            <TextField
              label="Password"
              fullWidth
              inputRef={passwordRef}
              type="password"
            />
            <TextField
              label="Confirm Password"
              fullWidth
              inputRef={confirmPasswordRef}
              type="password"
            />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography>Super User</Typography>
              <Checkbox aria-label="Super User" inputRef={superUserRef} />
            </Box>
            <Typography color="error">{error}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={loading} onClick={createUser}>
            Create
          </LoadingButton>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Button
        sx={{ width: "100%" }}
        variant="contained"
        onClick={() => setDialogOpen(true)}
      >
        Create User
      </Button>
    </>
  );
}

export default function UserManagement() {
  const { isLoggedIn, currentUser } = useApi();
  const [canViewPage, setCanViewPage] = useState(false);

  useEffect(
    () => setCanViewPage((isLoggedIn && currentUser?.super_user) || false),
    [isLoggedIn, currentUser],
  );

  return (
    <>
      {canViewPage ? (
        <UserList />
      ) : (
        <PageError
          title="403 - Forbidden"
          message="You are not authorized to view this page"
        />
      )}
    </>
  );
}
