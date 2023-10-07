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

export type IAuthContext = [AxiosInstance, boolean, () => void, () => void];

const DataContext = createContext<IAuthContext>([axios.create(), false, () => void, () => void]);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [cookie, setCookie, removeCookie] = useCookies([
    "token",
    "refresh_token",
    "user",
  ]);
  
  const [authed, setAuthed] = useState(false);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      Authorization: `Bearer: ${cookie.token}`,
      "Content-Type": "application/json",
    },
    withCredentials: cookie.token !== undefined,
  });

  useEffect(() => {
    const expiration = cookie["refresh_token"];

    if (expiration) {
      const expirationDate = new Date(expiration);
      const today = new Date();

      if (expirationDate < today) {
        removeCookie("token");
      }
    }

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${cookie.token}`;
    axiosInstance.defaults.withCredentials = cookie.token !== undefined;
    setAuthed(cookie.token);
  }, [cookie["token"]]);

  const login = (token: TokenResponse) => {
    // Update the cookie
    let expires = new Date();
    expires.setTime(expires.getTime() + token.expiration * 1000);
    setCookie('token', token.access_token);
    setCookie('refresh_token', expires);
    setCookie('user', token.user);
  }

  const logout = () => {
    removeCookie('token');
    removeCookie('refresh_token');
    removeCookie('user');
  }

  return (
    <DataContext.Provider value={[axiosInstance, authed, login, logout]}>
      {children}
    </DataContext.Provider>
  );
}

export function useAuth() {
  return useContext(DataContext);
}
