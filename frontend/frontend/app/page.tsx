"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-background"
    >
      <div className="text-center">
        <h1 className="mb-6">Healthcare System</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/admin/login")}
          className="btn-primary"
        >
          Go to Doctor Login
        </motion.button>
      </div>
    </motion.div>
  );
}