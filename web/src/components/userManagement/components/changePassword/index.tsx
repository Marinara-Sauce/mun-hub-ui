import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { AdminUser } from "../../../../model/interfaces";
import { useEffect, useRef, useState } from "react";
import LoadingButton from "../../../shared/loadingButton";
import { useApi } from "../../../../contexts/apiContext";

export default function ChangePassword({ user }: { user: AdminUser }) {
  const { axiosInstance } = useApi();

  const [changeDialogOpen, setChangeDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => setError(""), [changeDialogOpen]);

  function changePassword() {
    if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
      setError("The two password fields must match!");
      return;
    }

    setLoading(true);

    axiosInstance
      .post(
        `/user/update/password?user_id=${user.user_id}&new_password=${passwordRef.current?.value}`,
      )
      .then(() => {
        setLoading(false);
        setError("");
        setChangeDialogOpen(false);
      });
  }

  return (
    <>
      <Dialog open={changeDialogOpen} onClose={() => setChangeDialogOpen(true)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", p: 1, gap: 1 }}>
            <TextField
              label="Password"
              type="password"
              inputRef={passwordRef}
            />
            <TextField
              label="Confirm Password"
              type="password"
              inputRef={confirmPasswordRef}
            />
            <Typography color="error">{error}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={loading} onClick={changePassword}>
            Confirm
          </LoadingButton>
          <Button onClick={() => setChangeDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        sx={{ width: "100%" }}
        onClick={() => setChangeDialogOpen(true)}
      >
        Change Password
      </Button>
    </>
  );
}
