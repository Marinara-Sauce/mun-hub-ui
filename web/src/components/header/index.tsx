import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { useHeader } from "../../contexts/headerContext";
import { Link } from "react-router-dom";
import Account from "../account";
import DelegationAdminControls from "../delegation/components/delegationAdminControls";
import { useApi } from "../../contexts/apiContext";
import HomeIcon from '@mui/icons-material/Home';

export default function AppHeader() {
  const { header } = useHeader();

  const { isLoggedIn, currentUser } = useApi();

  return (
    <AppBar position="static" color="default" sx={{ zIndex: 999 }}>
      <Toolbar>
        <Box sx={{ display: "flex", flexGrow: 1, alignItems: 'center', gap: 1 }}>
          <IconButton href="/">
            <HomeIcon />
          </IconButton>
          <Typography variant="h6">
            {header}
          </Typography>
        </Box>

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
  );
}
