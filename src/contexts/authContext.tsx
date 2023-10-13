import axios, { AxiosInstance } from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { AdminUser } from "../model/adminUser";

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expiration: number;
  user: AdminUser;
}

export type IAuthContext = [
  AxiosInstance,
  boolean,
  (token: TokenResponse) => void,
  () => void,
  AdminUser | null
];

const DataContext = createContext<IAuthContext>([
  axios.create({ baseURL: "http://localhost:8000" }),
  false,
  () => {},
  () => {},
  null,
]);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [cookie, setCookie, removeCookie] = useCookies([
    "token",
    "refresh_token",
    "user",
  ]);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const [authed, setAuthed] = useState<boolean>(false);
  const [user, setUser] = useState<AdminUser | null>(null);

  const login = (token: TokenResponse) => {
    let expires = new Date();
    expires = new Date(expires.getTime() + 30 * 60000);

    setCookie("token", token.access_token);
    setCookie("refresh_token", expires);
    setCookie("user", token.user);
  };

  const logout = () => {
    removeCookie("token");
    removeCookie("refresh_token");
    removeCookie("user");
  };

  useEffect(() => {
    if (cookie["token"]) {
      const expiration = cookie["refresh_token"];

      if (expiration) {
        const currentUtcTime = new Date().toISOString();
        const tokenExpirationTime = cookie["refresh_token"]
  
        const isTokenExpired = new Date(tokenExpirationTime) <= new Date(currentUtcTime);
  
        if (isTokenExpired) {
          logout();
        }
      }
    }

    cookie["token"] ? setAuthed(true) : setAuthed(false);

    if (authed) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${cookie["token"]}`
      setUser(cookie["user"]);
    }

  }, [axiosInstance]);

  return (
    <DataContext.Provider value={[axiosInstance, authed, login, logout, user]}>
      {children}
    </DataContext.Provider>
  );
}

export function useAuth() {
  return useContext(DataContext);
}
