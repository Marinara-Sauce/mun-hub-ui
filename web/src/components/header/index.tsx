import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useHeader } from "../../contexts/headerContext";
import { Link } from "react-router-dom";
import Account from "../account";
import DelegationAdminControls from "../delegation/components/delegationAdminControls";
import { useApi } from "../../contexts/apiContext";

export default function AppHeader() {
  const { header } = useHeader();

  const { isLoggedIn, currentUser } = useApi();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {header}
          </Typography>
          <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <Button color="inherit" component={Link} to="/committee">
              Committees
            </Button>
            <Button color="inherit" component={Link} to="/delegation">
              Delegations
            </Button>
            <DelegationAdminControls />
            {isLoggedIn && currentUser?.super_user ? (
              <Button color="inherit" component={Link} to="/users">
                Manage Users
              </Button>
            ) : null}
            <Account />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
