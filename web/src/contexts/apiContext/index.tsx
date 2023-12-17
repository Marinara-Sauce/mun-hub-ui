import axios, { AxiosInstance } from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { AdminUser } from "../../model/adminUser";

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expiration: number;
  user: AdminUser;
}

export type IAPIContext = {
  axiosInstance: AxiosInstance;
  isLoggedIn: boolean;
  loginUser: (token: TokenResponse) => void;
  logoutUser: () => void;
  currentUser?: AdminUser;
};

const DataContext = createContext<IAPIContext>({
  axiosInstance: axios.create({ baseURL: "http://localhost:8000" }),
  isLoggedIn: false,
  loginUser: () => {},
  logoutUser: () => {},
});

export function APIProvider({ children }: { children: ReactNode }) {
  const [cookie, setCookie, removeCookie] = useCookies([
    "token",
    "refresh_token",
    "user",
  ]);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser>();

  const loginUser = (token: TokenResponse) => {
    let expires = new Date();
    expires = new Date(expires.getTime() + 30 * 60000);

    setCookie("token", token.access_token);
    setCookie("refresh_token", expires);
    setCookie("user", token.user);
  };

  const logoutUser = () => {
    removeCookie("token");
    removeCookie("refresh_token");
    removeCookie("user");
  };

  useEffect(() => {
    if (cookie["token"]) {
      const expiration = cookie["refresh_token"];

      if (expiration) {
        const currentUtcTime = new Date().toISOString();
        const tokenExpirationTime = cookie["refresh_token"];

        const isTokenExpired =
          new Date(tokenExpirationTime) <= new Date(currentUtcTime);

        if (isTokenExpired) {
          logoutUser();
        }
      }
    }

    cookie["token"] ? setIsLoggedIn(true) : setIsLoggedIn(false);

    if (isLoggedIn) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${cookie["token"]}`;
      setCurrentUser(cookie["user"]);
    }
  }, [axiosInstance]);

  return (
    <DataContext.Provider
      value={{ axiosInstance, isLoggedIn, loginUser, logoutUser, currentUser }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useApi() {
  return useContext(DataContext);
}
