import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useApi } from "../../../../contexts/authContext";
import { useState } from "react";
import LoadingButton from "../../../shared/loadingButton/loadingButton";
import CreateDelegation from "./createDelegation/createDelegation";

export default function DelegationAdminControls() {
    const { isLoggedIn } = useApi();

    const [dialogOpen, setDialogOpen] = useState(false);

    function closeDialog() {
        setDialogOpen(false);
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <>
            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>Manage Delegations</DialogTitle>
                <DialogContent>
                    <CreateDelegation />
                </DialogContent>
                <DialogActions>
                    <Button>Close</Button>
                </DialogActions>
            </Dialog>
            <Button onClick={() => setDialogOpen(true)}>Manage Delegations</Button>
        </>
    );
}