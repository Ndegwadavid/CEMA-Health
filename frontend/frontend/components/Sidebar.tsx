"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

export default function Sidebar() {
  // Start with an explicit default that matches server rendering
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  // Handle client-side initialization
  useEffect(() => {
    setHasMounted(true);
    // Set state based on screen size
    setIsOpen(window.innerWidth >= 768);
    
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    
    // Listen for resize events
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // The actual sidebar UI
  return (
    <>
      {/* Mobile toggle button, always rendered but hidden on desktop */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <motion.button
          whileHover={hasMounted ? { scale: 1.1 } : {}}
          whileTap={hasMounted ? { scale: 0.9 } : {}}
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-600 text-white rounded"
        >
          <Menu size={24} />
        </motion.button>
      </div>

      {/* Sidebar, animated only after mounting */}
      <motion.div
        initial={false}
        animate={hasMounted ? { x: isOpen ? 0 : "-100%" } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 z-40 md:static md:translate-x-0 md:flex md:flex-col"
      >
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/clients" className="block p-2 hover:bg-gray-700 rounded">
                Clients
              </Link>
            </li>
            <li>
              <Link href="/admin/programs" className="block p-2 hover:bg-gray-700 rounded">
                Programs
              </Link>
            </li>
            <li>
              <Link href="/admin/analytics" className="block p-2 hover:bg-gray-700 rounded">
                Analytics
              </Link>
            </li>
            <li>
              <Link href="/admin/profile" className="block p-2 hover:bg-gray-700 rounded">
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </motion.div>

      {/* Overlay for mobile when sidebar is open - only show after mounting */}
      {hasMounted && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}