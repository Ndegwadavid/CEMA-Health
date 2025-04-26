"use client";

import { useState, useEffect } from "react";
import { User } from "../../../lib/types";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser({ username: "admin", email: "admin@example.com" });
  }, []);

  if (!user) return <div className="p-4 md:ml-64">Loading...</div>;

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 md:ml-64"
      >
        <h1 className="mb-4">Admin Profile</h1>
        <div className="card">
          <p className="mb-2"><strong>Username:</strong> {user.username}</p>
          <p className="mb-2"><strong>Email:</strong> {user.email}</p>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}