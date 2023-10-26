import { Box, Button } from "@mui/material";
import "./header.css";
import { useHeader } from "../../contexts/headerContext";
import { Link } from "react-router-dom";
import Account from "../account/account";

export default function AppHeader() {
  const [header] = useHeader();

  return (
    <Box className="page-header">
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
        <Account />
      </Box>
    </Box>
  );
}
