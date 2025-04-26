
"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
    </motion.div>
  );
}