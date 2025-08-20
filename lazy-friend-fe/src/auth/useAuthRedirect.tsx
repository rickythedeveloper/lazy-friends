import { useAuth } from "@/auth/useAuth";
import { useEffect } from "react";
import { redirect, usePathname } from "next/navigation";

export function useAuthRedirect() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const isAllowed = isAuthenticated || isLoading;

    if (pathname === "/" || pathname === "/login") {
      return;
    }

    if (pathname === "/auth/callback") {
      if (isAllowed) {
        redirect("/profile");
      } else {
        return;
      }
    }

    if (!isAllowed) {
      redirect("/login");
    }
  }, [isAuthenticated, isLoading, pathname]);
}
