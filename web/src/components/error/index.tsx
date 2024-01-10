import { Modal, Box, Typography, Button } from "@mui/material";

interface ErrorModalProps {
  open: boolean;
  message: string | null;
  onClose: () => void;
}

export default function ErrorModal({
  open,
  message,
  onClose,
}: ErrorModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "white",
          boxShadow: 24,
          p: 3,
          borderRadius: 8,
          outline: "none",
          textAlign: "center",
          animation: open
            ? "popIn 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)"
            : "none",
        }}
      >
        <Typography variant="h6" color="error" sx={{ textAlign: "center" }}>
          Error
        </Typography>
        <Typography sx={{ p: 5 }}>{message}</Typography>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </Box>
    </Modal>
  );
}
