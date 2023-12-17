import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Box, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function Widget(props: {
  title: string;
  onEdit?: () => void;
  children: ReactJSXElement;
}) {
  return (
    <Box
      sx={{
        backgroundColor: "whitesmoke",
        boxShadow: "5px 5px 5px 2px rgba(0,0,0,.2)",
        display: "flex",
        flexDirection: "column",
        margin: 2,
        maxHeight: "100%",
        maxWidth: "100%",
        flex: 1,
      }}
    >
      <Box
        sx={{
          backgroundColor: "orange",
          color: "white",
          width: "100%",
          display: "flex",
        }}
      >
        <Typography variant="h4" sx={{ margin: "8px", flexGrow: "1" }}>
          {props.title}
        </Typography>
        {props.onEdit ? (
          <IconButton
            aria-label="edit"
            sx={{ margin: "8px" }}
            onClick={props.onEdit}
          >
            <EditIcon />
          </IconButton>
        ) : null}
      </Box>
      <Box
        sx={{
          overflow: "visible",
          height: "100%",
          margin: "10px",
        }}
      >
        <>{props.children}</>
      </Box>
    </Box>
  );
}
