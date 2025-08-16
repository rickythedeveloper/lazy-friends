"use client";
import { useCreateGroupMutation, useGroupsQuery } from "@lf/shared";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";

export default function GroupPage() {
  const { accessToken } = useAuth();

  const { data: groups } = useGroupsQuery({ accessToken });
  const { mutateAsync: createGroup } = useCreateGroupMutation({ accessToken });

  if (!groups) {
    return <div>loading...</div>;
  }

  return (
    <div className={"p-2"}>
      <Button
        onClick={() => {
          void createGroup({
            title: "test",
          });
        }}
      >
        Add group
      </Button>

      {groups.map((group) => (
        <div key={group.id}>
          {group.id}: {group.title}
        </div>
      ))}
    </div>
  );
}
