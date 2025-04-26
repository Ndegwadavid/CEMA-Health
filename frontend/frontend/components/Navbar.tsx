"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "../lib/auth";
import { motion } from "framer-motion";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <motion.nav
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="bg-blue-600 text-white p-4"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/admin/programs" className="text-xl font-bold">
          Healthcare Admin
        </Link>
        <div className="space-x-4">
          <Link href="/admin/programs" className="hover:underline">
            Programs
          </Link>
          <Link href="/admin/clients" className="hover:underline">
            Clients
          </Link>
          <Link href="/admin/analytics" className="hover:underline">
            Analytics
          </Link>
          <Link href="/admin/profile" className="hover:underline">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </motion.nav>
  );
}