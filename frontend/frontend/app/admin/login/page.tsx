"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "../../../lib/auth"
import { motion } from "framer-motion"
import { Eye, EyeOff, LogIn, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(email, password)
      router.push("/admin/programs")
    } catch (err) {
      setError("Invalid email or password")
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/assets/images/home.jpg')" }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-8 py-10 mx-4"
      >
        <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/40 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg">
              <LogIn className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-2">Healthcare Admin</h1>
          <p className="text-center text-white/80 mb-8">Sign in to access your dashboard</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-white rounded-lg p-3 mb-6 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500/50"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-300 hover:text-blue-200 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <LogIn className="ml-2 h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70 text-sm">
              Don't have an account?{" "}
              <a href="#" className="font-medium text-blue-300 hover:text-blue-200 transition-colors">
                Contact administrator
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} Healthcare Management System. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
