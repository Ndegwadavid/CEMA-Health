"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createEnrollment, fetchClients, fetchPrograms } from "../lib/api-services"
import type { Client, Program } from "../lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { X, UserPlus, Search } from "lucide-react"

interface EnrollClientFormProps {
  onClose: () => void
  onEnroll: () => void
}

export default function EnrollClientForm({ onClose, onEnroll }: EnrollClientFormProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [formData, setFormData] = useState({
    clientId: "",
    programId: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [clientSearch, setClientSearch] = useState("")
  const [filteredClients, setFilteredClients] = useState<Client[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, programsData] = await Promise.all([fetchClients(), fetchPrograms()])
        setClients(clientsData)
        setFilteredClients(clientsData)
        setPrograms(programsData)
      } catch (err) {
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (clientSearch) {
      const filtered = clients.filter(
        (client) =>
          client.first_name.toLowerCase().includes(clientSearch.toLowerCase()) ||
          client.last_name.toLowerCase().includes(clientSearch.toLowerCase()) ||
          client.phone_number.includes(clientSearch),
      )
      setFilteredClients(filtered)
    } else {
      setFilteredClients(clients)
    }
  }, [clientSearch, clients])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createEnrollment(Number(formData.clientId), Number(formData.programId))
      onEnroll()
      onClose()
    } catch (err) {
      setError("Failed to enroll client")
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200/50 dark:border-gray-800/50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enroll Client in Program</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client</label>
                <div className="relative mb-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-400 transition-shadow"
                    placeholder="Search clients..."
                  />
                </div>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-400 transition-shadow"
                  required
                >
                  <option value="">Select a client</option>
                  {filteredClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.first_name} {client.last_name} ({client.phone_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Program</label>
                <select
                  value={formData.programId}
                  onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gray-400 transition-shadow"
                  required
                >
                  <option value="">Select a program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name} ({program.short_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-2.5 bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors flex items-center"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Enroll Client
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
