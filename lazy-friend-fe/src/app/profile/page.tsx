"use client";

import { useAuth } from "@/auth/useAuth";
import { useQuery } from "@lf/shared";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { isAuthenticated, isLoading, user, getAccessToken } = useAuth();
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const getData = async () => {
    const accessToken = await getAccessToken();
    console.log("access token", accessToken);
    setAccessToken(accessToken);
  };

  const accessBe = async () => {
    const response = await fetch("http://localhost:3001/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  };

  const { data } = useQuery({
    queryFn: accessBe,
    queryKey: ["private", accessToken],
    enabled: !!accessToken,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

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
      Hi {user.name} ({user.email}, {user.id}){loadButton}
    </div>
  ) : (
    <div>Hi unknown user</div>
  );
}
