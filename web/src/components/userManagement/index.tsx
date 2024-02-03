import { useEffect, useState } from "react";
import { useApi } from "../../contexts/apiContext";
import PageError from "../pageError";

import UserList from "./components/userList";

export default function UserManagement() {
  const { isLoggedIn, currentUser } = useApi();
  const [canViewPage, setCanViewPage] = useState(false);

  useEffect(
    () => setCanViewPage((isLoggedIn && currentUser?.super_user) || false),
    [isLoggedIn, currentUser],
  );

  return (
    <>
      {canViewPage ? (
        <UserList />
      ) : (
        <PageError
          title="403 - Forbidden"
          message="You are not authorized to view this page"
        />
      )}
    </>
  );
}
