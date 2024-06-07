import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AdminUser } from "../../model/interfaces";
import { useApi } from "../../contexts/apiContext";
import { AxiosInstance } from "axios";
import React from "react";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expiration: number;
  user: AdminUser;
}

export default function Account() {
  const auth = useApi();

  const [loginFormVisible, setLoginFormVisible] = useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const onLoggedIn = (token: TokenResponse) => {
    setLoginFormVisible(false);
    auth.loginUser(token);
  };

  const onLogout = () => {
    auth.logoutUser();
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (!auth.isLoggedIn) {
    return (
      <>
        <LoginPopup
          axiosInstance={auth.axiosInstance}
          open={loginFormVisible}
          onClose={() => setLoginFormVisible(false)}
          onLoggedIn={onLoggedIn}
        />
        <Button color="inherit" sx={{ m: 1 }} onClick={() => setLoginFormVisible(true)}>
          Admin Login
        </Button>
      </>
    );
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={auth.currentUser?.first_name} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={() => {
          onLogout()
          handleCloseUserMenu()
        }}>
          <Typography textAlign="center">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}

function LoginPopup({
  axiosInstance,
  open,
  onClose,
  onLoggedIn,
}: {
  axiosInstance: AxiosInstance;
  open: boolean;
  onClose: () => void;
  onLoggedIn: (token: TokenResponse) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const onLogin = (credentials: { username: string; password: string }) => {
    setLoading(true);

    axiosInstance
      .post("/token", credentials, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setLoading(false);
        setError("");
        onLoggedIn(response.data);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data.detail);
      });
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    onLogin({ username, password });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="login-dialog-title"
      maxWidth="xs"
      sx={{ minWidth: "300px" }}
    >
      <DialogTitle id="login-dialog-title">Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter your username and password.
        </DialogContentText>
        <form>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={username}
            onChange={handleUsernameChange}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
          />
        </form>
      </DialogContent>
      {error && (
        <Typography variant="body2" color="error" sx={{ textAlign: "center" }}>
          {error}
        </Typography>
      )}
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button onClick={handleLogin} color="primary">
            Login
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
