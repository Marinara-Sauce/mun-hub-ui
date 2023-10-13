import { Box, Button } from "@mui/material";
import { useAuth } from "../../../../contexts/authContext";
import Widget from "../../../widget/widget";

export default function AdminControls() {
    const [ authed, user ] = useAuth();
    
    return (
        <Widget title="Admin Controls">
            <Box className="w-full">
                <Button variant="contained" className="w-full">
                    Rename Committee
                </Button>
                <Button variant="contained" color="error" className="w-full">
                    Delete Committee
                </Button>
            </Box>
        </Widget>
    );
}