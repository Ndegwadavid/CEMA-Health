"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { isAuthenticated } from "../lib/auth";
import Sidebar from "./Sidebar";

export default function SidebarWrapper() {
  const pathname = usePathname();
  // Use null initially to avoid rendering anything during SSR
  const [showSidebar, setShowSidebar] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check authentication only on the client side
    const shouldShow = 
      isAuthenticated() &&
      pathname !== "/" &&
      !pathname.includes("/admin/login");
    
    setShowSidebar(shouldShow);
  }, [pathname]);
  
  // Don't render anything during SSR or until client-side check completes
  if (showSidebar === null) {
    return null;
  }
  
  return showSidebar ? <Sidebar /> : null;
}