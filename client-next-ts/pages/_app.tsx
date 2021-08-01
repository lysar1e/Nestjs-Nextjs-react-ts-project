import "../styles/globals.css";
import NextNprogress from "nextjs-progressbar";
import type { AppProps } from "next/app";
import { useAuth } from "../hooks/auth.hook";
import { AuthContext } from "../context/AuthContext";
interface AuthUserModel {
  login: (jwtToken: string, id: string) => void | null;
  logout: () => void | null;
  token: string | null;
  userId: string | null;
  isReady: boolean;
}

function MyApp({ Component, pageProps }: AppProps) {
  const { login, logout, token, userId, isReady }: AuthUserModel = useAuth();
  const isLogin = !!token;
  return (
    <>
      <AuthContext.Provider
        value={{ login, logout, token, userId, isReady, isLogin }}
      >
        <NextNprogress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />
        <Component {...pageProps} />
      </AuthContext.Provider>
    </>
  );
}
export default MyApp;
