import { Button, CircularProgress, SxProps } from "@mui/material";
import { MouseEventHandler } from "react";

export default function LoadingButton({
  loading,
  variant = "contained",
  disabled = false,
  color,
  onClick,
  children,
  sx,
}: {
  loading: boolean;
  variant?: "contained" | "text" | "outlined";
  disabled?: boolean;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: string;
  sx?: SxProps;
}) {
  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Button
          variant={variant}
          color={color}
          onClick={onClick}
          disabled={disabled}
          sx={sx}
        >
          {children}
        </Button>
      )}
    </>
  );
}
