"use client";
import { useCreateGroupMutation, useGroupsQuery } from "@lf/shared";
import { useAuth } from "@/auth/useAuth";

export default function GroupPage() {
  const { accessToken } = useAuth();

  const { data: groups } = useGroupsQuery({ accessToken });
  const { mutateAsync: createGroup } = useCreateGroupMutation({ accessToken });

  if (!groups) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <button
        onClick={() => {
          void createGroup({
            title: "test",
          });
        }}
      >
        Add
      </button>

      {groups.map((group) => (
        <div key={group.id}>
          {group.id}: {group.title}
        </div>
      ))}
    </div>
  );
}
