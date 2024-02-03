import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export interface PageError {
  title: string;
  message: string;
}

export default function PageError({ title, message }: PageError) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h2">{title}</Typography>
      <Typography variant="h5">{message}</Typography>
      <Button variant="contained" component={Link} to="/">
        Go Back
      </Button>
    </Box>
  );
}
