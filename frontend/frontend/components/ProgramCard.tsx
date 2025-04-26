"use client"

import { useState, useEffect } from "react"
import type { Program, Enrollment } from "../lib/types"
import { motion } from "framer-motion"
import { Calendar, Tag, Users } from "lucide-react"
import { fetchEnrollments } from "../lib/api-services"

interface ProgramCardProps {
  program: Program
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getEnrollments = async () => {
      try {
        const data = await fetchEnrollments()
        // Filter enrollments for this program
        const programEnrollments = data.filter((enrollment) => enrollment.program_id === program.id)
        setEnrollments(programEnrollments)
      } catch (error) {
        console.error("Error fetching enrollments:", error)
      } finally {
        setLoading(false)
      }
    }

    getEnrollments()
  }, [program.id])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-800/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{program.name}</h3>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/5 dark:bg-white/10">
            <Calendar className="h-4 w-4 text-black dark:text-white" />
          </div>
        </div>

        <div className="flex items-center mb-4">
          <Tag className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Code: {program.short_code}</span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-2">{program.description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {loading ? (
                <span className="inline-block w-6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
              ) : (
                `${enrollments.length} enrolled`
              )}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
