"use client";
import { useCreateGroupMutation, useGroupsQuery } from "@lf/shared";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function GroupPage() {
  const { accessToken } = useAuth();

  const { data: groups } = useGroupsQuery({ accessToken });
  const { mutateAsync: createGroup } = useCreateGroupMutation({ accessToken });

  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  if (!groups) {
    return <div>loading...</div>;
  }

  const handleCreateGroup = async () => {
    if (!newGroupName) {
      return;
    }

    await createGroup({
      title: newGroupName,
    });
    setIsCreateGroupModalOpen(false);
  };

  return (
    <div className={"p-2"}>
      <Dialog
        open={isCreateGroupModalOpen}
        onOpenChange={setIsCreateGroupModalOpen}
      >
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new group</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Project name</Label>
                <Input
                  name="name"
                  placeholder={"Italy trip"}
                  required
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateGroup}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {groups.map((group) => (
        <div key={group.id}>
          {group.id}: {group.title}
        </div>
      ))}
    </div>
  );
}
