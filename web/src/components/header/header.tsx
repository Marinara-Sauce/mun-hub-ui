import { Box, Button } from "@mui/material";
import "./header.css";
import { useHeader } from "../../contexts/headerContext";
import { Link } from "react-router-dom";
import Account from "../account/account";
import DelegationAdminControls from "../delegation/components/delegationAdminControls/delegationAdminControls";

export default function AppHeader() {
  const [header] = useHeader();

  return (
    <Box className="page-header" sx={{ backgroundColor: "gainsboro", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)" }}>
      <Box className="left-bar" sx={{ ml: 1 }}>
        <h2>{header}</h2>
      </Box>
      <Box className="right-bar" sx={{ mr: 1 }}>
        <Button component={Link} to="/committee" sx={{ m: 1 }}>
          Committees
        </Button>
        <Button component={Link} to="/delegation" sx={{ m: 1 }}>
          Delegations
        </Button>
        <DelegationAdminControls />
        <Account />
      </Box>
    </Box>
  );
}
