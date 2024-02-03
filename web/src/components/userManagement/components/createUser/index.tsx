import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Typography,
  Checkbox,
  DialogActions,
  Button,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useApi } from "../../../../contexts/apiContext";
import LoadingButton from "../../../shared/loadingButton";
import { useUserList } from "../../contexts/userListContext";

export default function CreateUser() {
  const { axiosInstance } = useApi();
  const { refreshUsers } = useUserList();

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
    if (
      !usernameRef.current?.value ||
      !firstNameRef.current?.value ||
      !lastNameRef.current?.value ||
      !passwordRef.current?.value ||
      !confirmPasswordRef.current?.value
    ) {
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
        refreshUsers();
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
