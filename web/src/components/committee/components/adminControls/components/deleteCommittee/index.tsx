import { Button } from "@mui/material";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useApi } from "../../../../../../contexts/authContext";
import ConfirmModal from "../../../../../shared/confirmModal/confirmModal";

export default function DeleteCommittee() {
  const { id } = useParams();
  const { axiosInstance } = useApi();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteClicked = () => {
    setDeleteDialogOpen(true);
  };

  const handleClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    axiosInstance.delete(`/committees/${id}`).then(() => {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      navigate("/committee");
    });
  };

  return (
    <>
      <ConfirmModal
        open={deleteDialogOpen}
        buttonLoading={deleteLoading}
        dialogTitle="Delete Committee"
        confirmButtonText="Delete"
        destructive
        onConfirm={handleDelete}
        onClose={handleClose}
      >
        Are you sure you want to delete this committee? This will delete the
        committee, working papers, and working groups assosciated with this
        committee.
      </ConfirmModal>
      <Button
        variant="contained"
        color="error"
        sx={{ flex: 1, margin: 1 }}
        onClick={handleDeleteClicked}
      >
        Delete Committee
      </Button>
    </>
  );
}
