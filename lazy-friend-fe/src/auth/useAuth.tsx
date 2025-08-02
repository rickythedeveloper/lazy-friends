// eslint-disable-next-line no-restricted-imports
import { useAuth0 } from "@auth0/auth0-react";

interface User {
  name: string;
  email: string;
  id: string;
}

export function useAuth(): {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
  getAccessToken: () => Promise<string | undefined>;
} {
  const {
    loginWithRedirect: auth0Login,
    logout: auth0Logout,
    isAuthenticated,
    isLoading,
    user: auth0User,
    getAccessTokenWithPopup,
  } = useAuth0();

  const login = () => auth0Login();
  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  const user: User | undefined =
    !!auth0User && !!auth0User.name && !!auth0User.email && !!auth0User.sub
      ? { name: auth0User.name, email: auth0User.email, id: auth0User.sub }
      : undefined;

  // Try get the token silently first
  const getAccessToken = () =>
    getAccessTokenWithPopup({
      authorizationParams: {
        audience: "lazy-friends.ricky-kawagishi.com",
      },
    });

  return {
    login,
    logout,
    isAuthenticated,
    isLoading,
    user,
    getAccessToken,
  };
}
