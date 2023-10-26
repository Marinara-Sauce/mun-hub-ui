import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Box, Typography } from "@mui/material";

export default function Widget(props: {
  title: string;
  children: ReactJSXElement;
}) {
    return (
        <Box sx={{
            backgroundColor: "whitesmoke",
            boxShadow: "5px 5px 5px 2px rgba(0,0,0,.2)",
            display: "flex",
            flexDirection: "column",
            margin: 1,
            maxHeight: "100%",
            maxWidth: "100%",
            flex: 1
        }}>
            <Box sx={{
                backgroundColor: 'orange',
                color: 'white',
                width: '100%',
                display: 'flex',
            }}>
                <Typography variant="h4" sx={{ margin: '8px' }}>
                    {props.title}
                </Typography>
            </Box>
            <Box sx={{
                overflow: 'visible',
                height: '100%',
                margin: '10px',
            }}>
                <>{props.children}</>
            </Box>
        </Box>
    )
}
