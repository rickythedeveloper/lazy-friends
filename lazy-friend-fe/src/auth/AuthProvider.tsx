// eslint-disable-next-line no-restricted-imports
import { Auth0Provider } from "@auth0/auth0-react";
import auth0Config from "./auth0_config.json";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: "http://localhost:3000/auth/callback",
      }}
    >
      {children}
    </Auth0Provider>
  );
}
