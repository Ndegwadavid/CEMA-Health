"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Users, Calendar, BarChart2, UserCircle, ChevronRight, LogOut } from "lucide-react"

export default function Sidebar() {
  // Start with an explicit default that matches server rendering
  const [isOpen, setIsOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const pathname = usePathname()

  // Handle client-side initialization
  useEffect(() => {
    setHasMounted(true)
    // Set state based on screen size
    setIsOpen(window.innerWidth >= 768)

    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768)
    }

    // Listen for resize events
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navItems = [
    {
      title: "Clients",
      href: "/admin/clients",
      icon: Users,
    },
    {
      title: "Programs",
      href: "/admin/programs",
      icon: Calendar,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart2,
    },
    //{
    //  title: "Profile",
    //  href: "/admin/profile",
    //  icon: UserCircle,
    //},
  ]

  // The actual sidebar UI
  return (
    <>
      {/* Mobile toggle button, always rendered but hidden on desktop */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-black text-white rounded-md shadow-md transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-foreground shadow-xl z-40 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 border-r border-gray-200/50 dark:border-gray-800/50`}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold">Healthcare</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="py-4 flex flex-col h-[calc(100%-4rem)]">
          <nav className="px-2 flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium group transition-colors ${
                        isActive
                          ? "bg-black text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"}`}
                      />
                      <span>{item.title}</span>
                      {isActive && <ChevronRight className="ml-auto h-4 w-4 text-white" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout button at the bottom */}
          <div className="mt-auto px-2 pb-4">
            <Link
              href="/admin/login"
              className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black group transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-white dark:group-hover:text-black" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {hasMounted && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
