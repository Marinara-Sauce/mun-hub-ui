import AppHeader from "./components/header";
import CommitteeHub from "./components/committee";
import { Route, Routes } from "react-router-dom";
import { HeaderProvider } from "./contexts/headerContext";
import SelectCommittee from "./components/committee/components/selectCommittee";
import SelectDelegation from "./components/delegation/components/selectDelegation";
import DelegationPage from "./components/delegation";
import { Box } from "@mui/material";
import { APIProvider } from "./contexts/apiContext";
import UserManagement from "./components/userManagement";
import HomePage from "./components/homePage";

function App() {
  return (
    <APIProvider>
      <HeaderProvider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            flex: "1",
          }}
        >
          <AppHeader />
          <Box
            sx={{
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <Routes>
              <Route path="/committee" Component={SelectCommittee} />
              <Route path="/committee/:id" Component={CommitteeHub} />
              <Route path="/delegation" Component={SelectDelegation} />
              <Route path="/delegation/:id" Component={DelegationPage} />
              <Route path="/users" Component={UserManagement} />
              <Route path="/" Component={HomePage} />
            </Routes>
          </Box>
        </Box>
      </HeaderProvider>
    </APIProvider>
  );
}

export default App;
