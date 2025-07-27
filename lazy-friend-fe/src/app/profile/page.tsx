"use client";

import { useAuth } from "@/auth/useAuth";
import { stuff } from "@lf/shared";

export default function ProfilePage() {
  const { isAuthenticated, isLoading, user, getAccessToken } = useAuth();

  console.log(stuff);

  const getData = async () => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return;
    }

    const response = await fetch("http://localhost:3001/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(response);
  };

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!isAuthenticated) {
    return <div>Not signed in</div>;
  }

  const loadButton = (
    <button
      onClick={() => {
        void getData();
      }}
    >
      Load
    </button>
  );

  return user ? (
    <div>
      Hi {user.name} ({user.email}){loadButton}
    </div>
  ) : (
    <div>Hi unknown user</div>
  );
}
