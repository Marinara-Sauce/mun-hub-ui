import { IconButton } from "@mui/material";
import { useApi } from "../../../../contexts/apiContext";
import { AdminUser } from "../../../../model/interfaces";

import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "../../../shared/confirmModal";
import { useState } from "react";
import { useUserList } from "../../contexts/userListContext";

export default function DeleteUser({ user }: { user: AdminUser }) {
  const { axiosInstance } = useApi();
  const { refreshUsers } = useUserList();

  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function deleteUser() {
    setLoading(true);
    axiosInstance.delete(`/user?user_id=${user.user_id}`).then(() => {
      setLoading(false);
      setDeleteOpen(false);
      refreshUsers();
    });
  }

  return (
    <>
      <ConfirmModal
        open={deleteOpen}
        dialogTitle="Delete User"
        confirmButtonText="Delete"
        destructive
        buttonLoading={loading}
        onConfirm={deleteUser}
        onClose={() => setDeleteOpen(false)}
      >
        Are you sure you want to delete the user {user.username}?
      </ConfirmModal>
      <IconButton
        aria-label="delete"
        onClick={() => setDeleteOpen(true)}
        disabled={user.user_id === 1}
      >
        <DeleteIcon />
      </IconButton>
    </>
  );
}
