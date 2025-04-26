"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function HomePage() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950"
    >
      <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Healthcare System</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Secure access for healthcare professionals. Login to manage patients, appointments, and medical records.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/admin/login")}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Doctor Login
        </motion.button>
      </div>
    </motion.div>
  )
}
