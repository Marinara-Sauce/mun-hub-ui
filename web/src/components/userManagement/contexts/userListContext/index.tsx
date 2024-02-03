import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AdminUser } from "../../../../model/interfaces";
import { useApi } from "../../../../contexts/apiContext";

export type IUserListContext = {
  users: AdminUser[];
  loading: boolean;
  refreshUsers: () => void;
};

const UserListContext = createContext<IUserListContext>({
  users: [],
  loading: false,
  refreshUsers: () => {},
});

export function UserListProvider({ children }: { children: ReactNode }) {
  const { axiosInstance, isLoggedIn, currentUser } = useApi();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  function refreshUsers() {
    setLoading(true);
    if (isLoggedIn && currentUser?.super_user) {
      axiosInstance.get("/user").then((res) => {
        setLoading(false);
        setUsers(res.data);
      });
    }
  }

  useEffect(
    () => refreshUsers(),
    [isLoggedIn, currentUser, axiosInstance, setUsers],
  );

  return (
    <UserListContext.Provider value={{ users, loading, refreshUsers }}>
      {children}
    </UserListContext.Provider>
  );
}

export function useUserList() {
  return useContext(UserListContext);
}
