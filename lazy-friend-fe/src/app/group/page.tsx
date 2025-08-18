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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GroupList } from "@/components/composites/GroupListItem";

const createGroupFormSchema = z.object({
  title: z.string().min(1),
});

export default function GroupPage() {
  const { accessToken } = useAuth();

  const { data: groups } = useGroupsQuery({ accessToken });
  const { mutateAsync: createGroup } = useCreateGroupMutation({ accessToken });

  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  const createGroupForm = useForm({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      title: "",
    },
  });

  if (!groups) {
    return <div>loading...</div>;
  }

  const handleCreateGroup = async ({
    title,
  }: z.infer<typeof createGroupFormSchema>) => {
    await createGroup({
      title: title,
    });
    setIsCreateGroupModalOpen(false);
  };

  return (
    <div className={"p-2"}>
      <Dialog
        open={isCreateGroupModalOpen}
        onOpenChange={setIsCreateGroupModalOpen}
      >
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...createGroupForm}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createGroupForm.handleSubmit(handleCreateGroup)(e);
              }}
            >
              <DialogHeader>
                <DialogTitle>Create new group</DialogTitle>
              </DialogHeader>
              <div className={"my-2"}>
                <FormField
                  control={createGroupForm.control}
                  name={"title"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group name</FormLabel>
                      <FormControl>
                        <Input placeholder={"Italy trip"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type={"submit"}>Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <GroupList groups={groups} />
    </div>
  );
}
