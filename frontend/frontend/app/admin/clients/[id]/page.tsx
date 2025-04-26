"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { fetchClient, fetchEnrollments } from "../../../../lib/api-services"
import type { Client, Enrollment } from "../../../../lib/types"
import ProtectedRoute from "../../../../components/ProtectedRoute"
import { motion } from "framer-motion"
import { Phone, MapPin, Briefcase, Calendar, User, Clock, ArrowLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function ClientDetailsPage() {
  const { id } = useParams()
  const [client, setClient] = useState<Client | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientId = Number(id)
        const [clientData, enrollmentsData] = await Promise.all([fetchClient(clientId), fetchEnrollments(clientId)])
        setClient(clientData)
        setEnrollments(enrollmentsData)
        setLoading(false)
      } catch (err) {
        setError("Failed to load client details")
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200/50 dark:border-gray-700/50 space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200/50 dark:border-gray-700/50 space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !client) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-center py-8">
                <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-600 dark:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  {error || "Client not found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't find the client you're looking for.</p>
                <Link
                  href="/admin/clients"
                  className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Clients
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              href="/admin/clients"
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Clients
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {client.first_name} {client.last_name}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black/10 dark:bg-white/10 text-gray-800 dark:text-gray-200">
                Client #{client.id}
              </span>
            </div>

            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-8">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</p>
                        <p className="text-gray-900 dark:text-white">{client.age} years</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-gray-900 dark:text-white">{client.phone_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Area</p>
                        <p className="text-gray-900 dark:text-white">{client.area_of_residence}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Profession</p>
                        <p className="text-gray-900 dark:text-white">{client.profession || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</p>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(client.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated</p>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(client.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Enrolled Programs</h2>

            {enrollments.length > 0 ? (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {enrollments.map((enrollment) => (
                    <li
                      key={enrollment.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{enrollment.program_name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Code: {enrollment.program_short_code} | ID: {enrollment.enrollment_id}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">This client is not enrolled in any programs.</p>
                <Link
                  href="/admin/clients"
                  className="inline-flex items-center mt-4 text-sm font-medium text-black dark:text-white hover:underline"
                >
                  Enroll in a program
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
