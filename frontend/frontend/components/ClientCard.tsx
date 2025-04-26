"use client"

import type { Client } from "../lib/types"
import { motion } from "framer-motion"
import { Phone, MapPin, Briefcase, Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"

interface ClientCardProps {
  client: Client
}

export default function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Link href={`/admin/clients/${client.id}`} className="group">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:underline">
            {client.first_name} {client.last_name}
          </h3>
        </Link>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/10 dark:bg-white/10 text-gray-800 dark:text-gray-200">
          {client.age} years
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <Phone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">{client.phone_number}</span>
        </div>
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">{client.area_of_residence}</span>
        </div>
        {client.profession && (
          <div className="flex items-center text-sm">
            <Briefcase className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{client.profession}</span>
          </div>
        )}
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            Joined: {new Date(client.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-4 text-right">
        <Link href={`/admin/clients/${client.id}`}>
          <motion.span
            className="inline-flex items-center text-sm font-medium text-black dark:text-white hover:underline"
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            View details
            <ChevronRight className="h-4 w-4 ml-1" />
          </motion.span>
        </Link>
      </div>
    </div>
  )
}
