"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchClients, searchClients, fetchEnrollments } from "../../../lib/api-services"
import type { Client, Enrollment } from "../../../lib/types"
import SearchBar from "../../../components/SearchBar"
import CreateClientForm from "../../../components/CreateClientForm"
import ClientCard from "../../../components/ClientCard"
import EnrollClientForm from "../../../components/EnrollClientForm"
import ProtectedRoute from "../../../components/ProtectedRoute"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, UserPlus, X, Users } from "lucide-react"
import useDebounce from "../../../hooks/useDebounce"
import { Pagination } from "../../../components/Pagination"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEnrollForm, setShowEnrollForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedClients, setPaginatedClients] = useState<Client[]>([])

  useEffect(() => {
    console.log("ClientsPage mounted")
    let isMounted = true

    const loadData = async () => {
      setIsLoading(true)
      try {
        const [clientsData, enrollmentsData] = await Promise.all([fetchClients(), fetchEnrollments()])
        if (isMounted) {
          setClients(clientsData)
          setEnrollments(enrollmentsData)
          setTotalPages(Math.ceil(clientsData.length / itemsPerPage))
        }
      } catch (err) {
        console.error("Failed to fetch data", err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
      console.log("ClientsPage unmounted")
    }
  }, [itemsPerPage])

  useEffect(() => {
    const handleSearch = async () => {
      setIsLoading(true)
      try {
        if (debouncedSearchQuery) {
          const results = await searchClients(debouncedSearchQuery)
          setClients(results)
          setTotalPages(Math.ceil(results.length / itemsPerPage))
          setCurrentPage(1) // Reset to first page on new search
        } else {
          const data = await fetchClients()
          setClients(data)
          setTotalPages(Math.ceil(data.length / itemsPerPage))
        }
      } catch (err) {
        console.error("Search failed", err)
      } finally {
        setIsLoading(false)
      }
    }

    handleSearch()
  }, [debouncedSearchQuery, itemsPerPage])

  useEffect(() => {
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedClients(clients.slice(startIndex, endIndex))
  }, [clients, currentPage, itemsPerPage])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleEnroll = async () => {
    try {
      const enrollmentsData = await fetchEnrollments()
      setEnrollments(enrollmentsData)
    } catch (err) {
      console.error("Failed to refresh enrollments", err)
    }
  }

  const getClientEnrollments = (clientId: number) => {
    return enrollments.filter((enrollment) => enrollment.client_id === clientId)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage your healthcare clients and their program enrollments
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="w-full md:w-2/3 relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search clients by name, phone, or area..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-600 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  </button>
                )}
              </div>
            </div>

            <div className="w-full md:w-auto flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateForm(true)}
                className="flex-1 md:flex-none px-4 py-2.5 bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Client
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEnrollForm(true)}
                className="flex-1 md:flex-none px-4 py-2.5 bg-white text-black border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors flex items-center justify-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Enroll Client
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showCreateForm && (
              <CreateClientForm
                onClose={() => setShowCreateForm(false)}
                onCreate={() => fetchClients().then(setClients)}
              />
            )}
            {showEnrollForm && <EnrollClientForm onClose={() => setShowEnrollForm(false)} onEnroll={handleEnroll} />}
          </AnimatePresence>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200/50 dark:border-gray-700/50 animate-pulse"
                >
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mt-6"></div>
                </div>
              ))}
            </div>
          ) : clients.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedClients.map((client) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                >
                  <ClientCard client={client} />
                  <div className="px-6 py-3 bg-gray-50/80 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enrolled Programs:</p>
                    {getClientEnrollments(client.id).length > 0 ? (
                      <ul className="space-y-1">
                        {getClientEnrollments(client.id).map((enrollment) => (
                          <li
                            key={enrollment.id}
                            className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                          >
                            <span className="w-2 h-2 rounded-full bg-black dark:bg-white mr-2"></span>
                            {enrollment.program_name} ({enrollment.program_short_code})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic">No programs enrolled</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50">
              <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">No clients found</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {searchQuery ? `No results for "${searchQuery}"` : "Get started by creating a new client"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="mt-4 text-sm text-black dark:text-white hover:underline focus:outline-none"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
          {!isLoading && clients.length > 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="py-4"
              />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
