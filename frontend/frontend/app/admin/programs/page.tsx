"use client"

import { useState, useEffect } from "react"
import { fetchPrograms } from "../../../lib/api-services"
import type { Program } from "../../../lib/types"
import CreateProgramForm from "../../../components/CreateProgramForm"
import ProgramCard from "../../../components/ProgramCard"
import ProtectedRoute from "../../../components/ProtectedRoute"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, X } from "lucide-react"
import { Pagination } from "../../../components/Pagination"

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedPrograms, setPaginatedPrograms] = useState<Program[]>([])

  useEffect(() => {
    console.log("ProgramsPage mounted")
    return () => {
      console.log("ProgramsPage unmounted")
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadPrograms = async () => {
      setIsLoading(true)
      try {
        const data = await fetchPrograms()
        if (isMounted) {
          setPrograms(data)
          setTotalPages(Math.ceil(data.length / itemsPerPage))
        }
      } catch (err) {
        console.error("Failed to fetch programs", err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPrograms()

    return () => {
      isMounted = false
    }
  }, [itemsPerPage])

  useEffect(() => {
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedPrograms(programs.slice(startIndex, endIndex))
  }, [programs, currentPage, itemsPerPage])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Programs</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage your healthcare programs and services
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateForm(true)}
              className="w-full md:w-auto px-6 py-2.5 bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Program
            </motion.button>
          </div>

          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Program</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <CreateProgramForm
                  onClose={() => setShowCreateForm(false)}
                  onCreate={() => {
                    fetchPrograms().then(setPrograms)
                    setShowCreateForm(false)
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-6"></div>
                </div>
              ))}
            </div>
          ) : programs.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedPrograms.map((program) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProgramCard program={program} />
                </motion.div>
              ))}
              {!isLoading && programs.length > 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="py-4"
                  />
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No programs found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new program</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
