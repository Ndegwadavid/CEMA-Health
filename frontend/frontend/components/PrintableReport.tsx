"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Printer, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Client, Program, Enrollment } from "../lib/types"
import {
  BarChart,
  Bar,
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

interface PrintableReportProps {
  clients: Client[]
  programs: Program[]
  enrollments: Enrollment[]
  dateRange?: { from: Date; to: Date }
  onClose: () => void
  isOpen: boolean
}

export function PrintableReport({ clients, programs, enrollments, dateRange, onClose, isOpen }: PrintableReportProps) {
  const reportRef = useRef<HTMLDivElement>(null)

  // Fix: Use the correct property according to your version of react-to-print
  const handlePrint = useReactToPrint({
    documentTitle: "Healthcare Analytics Report",
    onAfterPrint: () => {
      console.log("Print completed")
    },
    // Use contentRef instead of content or printRef
    contentRef: reportRef,
  })

  if (!isOpen) return null

  // Filter data by date range if provided
  const filteredClients =
    dateRange?.from && dateRange?.to
      ? clients.filter((client) => {
          const date = new Date(client.created_at)
          return date >= dateRange.from && date <= dateRange.to
        })
      : clients

  const filteredEnrollments =
    dateRange?.from && dateRange?.to
      ? enrollments.filter((enrollment) => {
          const date = new Date(enrollment.enrolled_at)
          return date >= dateRange.from && date <= dateRange.to
        })
      : enrollments

  // Calculate key metrics
  const totalClients = filteredClients.length
  const totalPrograms = programs.length
  const totalEnrollments = filteredEnrollments.length
  const avgAge = totalClients
    ? Math.round(filteredClients.reduce((sum, client) => sum + client.age, 0) / totalClients)
    : 0

  // Process program enrollment data
  const programEnrollmentData = programs.map((program) => {
    const count = filteredEnrollments.filter((e) => e.program_id === program.id).length
    return {
      name: program.name,
      enrollments: count,
    }
  })

  // Process age distribution data
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

  const ageData = Object.entries(ageGroups).map(([name, value]) => ({ name, value }))

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b">
          <h2 className="text-xl font-bold">Healthcare Analytics Report</h2>
          <div className="flex gap-2">
            <Button onClick={() => handlePrint?.()} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div ref={reportRef} className="p-8">
          {/* Report Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Healthcare Analytics Report</h1>
            {dateRange?.from && dateRange?.to && (
              <p className="text-gray-600">
                Period: {formatDate(dateRange.from)} to {formatDate(dateRange.to)}
              </p>
            )}
            <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          {/* Key Metrics */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Key Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">Total Clients</p>
                <p className="text-2xl font-bold">{totalClients}</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">Total Programs</p>
                <p className="text-2xl font-bold">{totalPrograms}</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">Total Enrollments</p>
                <p className="text-2xl font-bold">{totalEnrollments}</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">Average Age</p>
                <p className="text-2xl font-bold">{avgAge}</p>
              </div>
            </div>
          </div>

          {/* Program Enrollment Chart */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Program Enrollments</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={programEnrollmentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
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

          {/* Age Distribution Chart */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Age Distribution</h2>
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
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Program Summary Table */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Program Summary</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Program Name</th>
                    <th className="border p-2 text-left">Code</th>
                    <th className="border p-2 text-left">Enrollments</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => {
                    const enrollmentCount = filteredEnrollments.filter((e) => e.program_id === program.id).length
                    return (
                      <tr key={program.id}>
                        <td className="border p-2">{program.name}</td>
                        <td className="border p-2">{program.short_code}</td>
                        <td className="border p-2">{enrollmentCount}</td>
                        <td className="border p-2">{program.description}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm mt-12 pt-4 border-t">
            <p>This report is confidential and intended for authorized personnel only.</p>
            <p>© {new Date().getFullYear()} Healthcare Management System</p>
          </div>
        </div>
      </div>
    </div>
  )
}