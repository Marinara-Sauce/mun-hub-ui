import { Box, Button } from "@mui/material";
import { useHeader } from "../../contexts/headerContext";
import { Link } from "react-router-dom";
import Account from "../account";
import DelegationAdminControls from "../delegation/components/delegationAdminControls";
import { useApi } from "../../contexts/apiContext";

export default function AppHeader() {
  const [header] = useHeader();

  const { isLoggedIn, currentUser } = useApi();

  return (
    <Box
      className="page-header"
      sx={{
        backgroundColor: "gainsboro",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box className="left-bar" sx={{ ml: 1, flex: 1 }}>
        <h2>{header}</h2>
      </Box>
      <Box className="right-bar" sx={{ mr: 1, display: "flex" }}>
        <Button component={Link} to="/committee" sx={{ m: 1 }}>
          Committees
        </Button>
        <Button component={Link} to="/delegation" sx={{ m: 1 }}>
          Delegations
        </Button>
        <DelegationAdminControls />
        {isLoggedIn && currentUser?.super_user ? <Button component={Link} to="/users">Manage Users</Button> : null}
        <Account />
      </Box>
    </Box>
  );
}
