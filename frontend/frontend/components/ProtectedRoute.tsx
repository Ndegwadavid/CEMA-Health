"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "../lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      if (!authenticated && !pathname.includes("/admin/login")) {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (isAuth === null) {
    return null;
  }

  return isAuth || pathname.includes("/admin/login") ? <>{children}</> : null;
}