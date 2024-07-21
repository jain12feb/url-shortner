import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { CircleAlert, LayoutDashboard, Loader, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { logout } from "@/db/apiAuth";
import { UrlState } from "@/context";

const UserButton = () => {
  const [open, setOpen] = useState(false);

  const { user, fetchUser } = UrlState();

  const { loading, fn: fnLogout } = useFetch(logout);

  const splitedName = user?.user_metadata?.name?.split(" ");
  const navigate = useNavigate();
  if (loading) return <Loader className="animate-spin" color="yellow" />;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-12 rounded-full">
          {/* <img
            src={
              user?.user_metadata?.profile_pic ||
              "https://github.com/shadcn.png"
            }
            className="object-contain w-16 h-16 rounded-full ring ring-yellow-700"
            alt={
              splitedName &&
              splitedName[0]?.substring(0, 1) + splitedName[1]?.substring(0, 1)
            }
          /> */}
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={
                user?.user_metadata?.profile_pic ||
                "https://github.com/shadcn.png"
              }
              className="object-contain"
            />
            <AvatarFallback>
              {splitedName &&
                splitedName[0]?.substring(0, 1) +
                  splitedName[1]?.substring(0, 1)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-yellow-100 text-yellow-700 border-yellow-300 min-w-[175px]">
          <DropdownMenuLabel className="select-none">
            {user?.user_metadata?.name ? (
              <p>{user?.user_metadata?.name}</p>
            ) : (
              <p>{user?.user_metadata?.email || user?.email}</p>
            )}
            {user?.user_metadata?.name && (
              <p className="text-xs">{user?.user_metadata?.email}</p>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem onClick={() => {}}>
            Profile
            <DropdownMenuShortcut>
              <UserRoundCog size={18} />
            </DropdownMenuShortcut>
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            Dashboard
            <DropdownMenuShortcut>
              <LayoutDashboard size={18} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="focus:bg-destructive text-destructive focus:text-white focus:font-semibold"
          >
            Logout
            <DropdownMenuShortcut>
              <LogOut size={18} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent className="bg-yellow-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-yellow-700 flex items-center">
              <CircleAlert className="mr-2" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* className="flex flex-row justify-center items-center gap-2" */}
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                fnLogout().then(() => {
                  navigate("/");
                  fetchUser();
                });
              }}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserButton;
