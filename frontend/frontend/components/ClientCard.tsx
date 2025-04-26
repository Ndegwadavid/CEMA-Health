"use client";

import { Client } from "../lib/types";
import { motion } from "framer-motion";
import Link from "next/link";

interface ClientCardProps {
  client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 border rounded-lg shadow-sm bg-white"
    >
      <h3 className="text-lg font-semibold">
        {client.first_name} {client.last_name}
      </h3>
      <p className="text-gray-600">Phone: {client.phone_number}</p>
      <p className="text-gray-600">Area: {client.area_of_residence}</p>
      <p className="text-gray-600">Profession: {client.profession || "N/A"}</p>
      <Link href={`/admin/clients/${client.id}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          View Client
        </motion.button>
      </Link>
    </motion.div>
  );
}