"use client"

import { useState, useEffect } from "react"
import { fetchClients, fetchPrograms, fetchEnrollments } from "../../../lib/api-services"
import type { Client, Program, Enrollment } from "../../../lib/types"
import ProtectedRoute from "../../../components/ProtectedRoute"
import { motion } from "framer-motion"
import type { DateRange } from "react-day-picker"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Users, Calendar, BarChart3, Activity, Filter, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DateRangeFilter } from "../../../components/DateRangeFilter"
import { ExportButton } from "../../../components/ExportButton"
import { DemographicCharts } from "../../../components/DemographicCharts"
import { PrintableReport } from "../../../components/PrintableReport"

export default function AnalyticsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showPrintableReport, setShowPrintableReport] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [clientsData, programsData, enrollmentsData] = await Promise.all([
          fetchClients(),
          fetchPrograms(),
          fetchEnrollments(),
        ])
        setClients(clientsData)
        setFilteredClients(clientsData)
        setPrograms(programsData)
        setEnrollments(enrollmentsData)
        setFilteredEnrollments(enrollmentsData)
      } catch (err) {
        console.error("Failed to fetch analytics data", err)
        setError("Failed to load analytics data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply date range filter
  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) {
      setFilteredClients(clients)
      setFilteredEnrollments(enrollments)
      return
    }

    const filteredClientData = clients.filter((client) => {
      const date = new Date(client.created_at)
      return date >= dateRange.from! && date <= dateRange.to!
    })

    const filteredEnrollmentData = enrollments.filter((enrollment) => {
      const date = new Date(enrollment.enrolled_at)
      return date >= dateRange.from! && date <= dateRange.to!
    })

    setFilteredClients(filteredClientData)
    setFilteredEnrollments(filteredEnrollmentData)
  }, [dateRange, clients, enrollments])

  // Age distribution data
  const ageGroups = {
    "0-18": 0,
    "19-30": 0,
    "31-50": 0,
    "51+": 0,
  }

  filteredClients.forEach((client) => {
    if (client.age <= 18) ageGroups["0-18"]++
    else if (client.age <= 30) ageGroups["19-30"]++
    else if (client.age <= 50) ageGroups["31-50"]++
    else ageGroups["51+"]++
  })

  const ageData = Object.keys(ageGroups).map((group) => ({
    name: group,
    value: ageGroups[group as keyof typeof ageGroups],
  }))

  // Residence distribution data
  const residenceGroups = filteredClients.reduce(
    (acc, client) => {
      acc[client.area_of_residence] = (acc[client.area_of_residence] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const residenceData = Object.keys(residenceGroups).map((area) => ({
    name: area,
    value: residenceGroups[area],
  }))

  // Client growth data (by month)
  const clientGrowthData = (() => {
    if (!filteredClients.length) return []

    const monthlyData: Record<string, number> = {}

    filteredClients.forEach((client) => {
      const date = new Date(client.created_at)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0
      }
      monthlyData[monthYear]++
    })

    // Sort by date
    return Object.entries(monthlyData)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, count], index, array) => {
        // Calculate cumulative count
        const cumulativeCount = array.slice(0, index + 1).reduce((sum, [, currentCount]) => sum + currentCount, 0)

        return {
          date,
          newClients: count,
          totalClients: cumulativeCount,
        }
      })
  })()

  // Program enrollment data
  const programEnrollmentData = programs.map((program) => {
    const enrollmentCount = filteredEnrollments.filter((e) => e.program_id === program.id).length
    return {
      name: program.name,
      enrollments: enrollmentCount,
    }
  })

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  // Loading state
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200/50 dark:border-gray-700/50 h-32"
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200/50 dark:border-gray-700/50 h-80"
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Error state
  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{error}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  We couldn't load the analytics data. Please try again later.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
                >
                  Retry
                </button>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {/* Header with filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>

              <div className="flex flex-col md:flex-row gap-3">
                <Button
                  variant="outline"
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>

                <ExportButton
                  clients={filteredClients}
                  programs={programs}
                  enrollments={filteredEnrollments}
                />

                <Button
                  variant="outline"
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                  onClick={() => setShowPrintableReport(true)}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>

            {/* Date Range Filter */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Data</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date Range
                      </label>
                      <DateRangeFilter onChange={setDateRange} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 mr-4">
                    <Users className="h-6 w-6 text-black dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{filteredClients.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 mr-4">
                    <Calendar className="h-6 w-6 text-black dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Programs</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{programs.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 mr-4">
                    <BarChart3 className="h-6 w-6 text-black dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Enrollments</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{filteredEnrollments.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 mr-4">
                    <Activity className="h-6 w-6 text-black dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Age</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {filteredClients.length
                        ? Math.round(
                            filteredClients.reduce((sum, client) => sum + client.age, 0) / filteredClients.length,
                          )
                        : 0}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Growth Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Client Growth</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={clientGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "0.5rem",
                          border: "1px solid rgba(229, 231, 235, 0.5)",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="newClients"
                        name="New Clients"
                        stroke="#00C49F"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="totalClients"
                        name="Total Clients"
                        stroke="#0088FE"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Program Enrollment Chart */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Program Enrollments</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={programEnrollmentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "0.5rem",
                          border: "1px solid rgba(229, 231, 235, 0.5)",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="enrollments" name="Enrollments" fill="#8884d8">
                        {programEnrollmentData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Demographic Charts */}
            <DemographicCharts clients={filteredClients} />

            {/* Age and Residence Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Age Distribution</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {ageData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} clients`, "Count"]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "0.5rem",
                          border: "1px solid rgba(229, 231, 235, 0.5)",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Residence Distribution</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={residenceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {residenceData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} clients`, "Count"]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "0.5rem",
                          border: "1px solid rgba(229, 231, 235, 0.5)",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Printable Report Modal */}
      <PrintableReport
        clients={filteredClients}
        programs={programs}
        enrollments={filteredEnrollments}
        dateRange={dateRange?.from && dateRange?.to ? { from: dateRange.from, to: dateRange.to } : undefined}
        onClose={() => setShowPrintableReport(false)}
        isOpen={showPrintableReport}
      />
    </ProtectedRoute>
  )
}
