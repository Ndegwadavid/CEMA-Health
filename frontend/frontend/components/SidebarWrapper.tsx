"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { isAuthenticated } from "../lib/auth"
import Sidebar from "./Sidebar"

export default function SidebarWrapper() {
  const pathname = usePathname()
  // Use null initially to avoid rendering anything during SSR
  const [showSidebar, setShowSidebar] = useState<boolean | null>(null)
  const [bodyPadding, setBodyPadding] = useState("0")

  // First useEffect - Check authentication and set sidebar visibility
  useEffect(() => {
    // Check authentication only on the client side
    const shouldShow = isAuthenticated() && pathname !== "/" && !pathname.includes("/admin/login")
    setShowSidebar(shouldShow)
  }, [pathname])

  // Second useEffect - Handle body padding when sidebar is shown
  useEffect(() => {
    // Only run this effect if showSidebar is not null (client-side)
    if (showSidebar === null) return

    const updateBodyPadding = () => {
      if (showSidebar && window.innerWidth >= 768) {
        setBodyPadding("16rem") // 64px or 16rem
      } else {
        setBodyPadding("0")
      }
    }

    // Initial update
    updateBodyPadding()

    // Add resize listener
    window.addEventListener("resize", updateBodyPadding)

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateBodyPadding)
    }
  }, [showSidebar])

  // Apply the padding to the main content
  useEffect(() => {
    if (typeof document !== "undefined") {
      const mainElement = document.querySelector("main")
      if (mainElement) {
        mainElement.style.paddingLeft = bodyPadding
      }
    }
  }, [bodyPadding])

  // Don't render anything during SSR or until client-side check completes
  if (showSidebar === null) {
    return null
  }

  return showSidebar ? <Sidebar /> : null
}
