"use client"

import { useState } from "react"
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Client, Program, Enrollment } from "../lib/types"

interface ExportButtonProps {
  clients: Client[]
  programs: Program[]
  enrollments: Enrollment[]
  dateRange?: { from: Date; to: Date }
}

export function ExportButton({ clients, programs, enrollments, dateRange }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const filterDataByDateRange = <T extends { created_at: string }>(data: T[]) => {
    if (!dateRange?.from || !dateRange?.to) return data

    return data.filter((item) => {
      const itemDate = new Date(item.created_at)
      return itemDate >= dateRange.from && itemDate <= dateRange.to
    })
  }

  const exportToCSV = (data: any[], filename: string) => {
    setIsExporting(true)

    try {
      // Get headers from first object
      const headers = Object.keys(data[0] || {})

      // Convert data to CSV format
      const csvContent = [
        headers.join(","), // Header row
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header]
              // Handle values that need quotes (strings with commas, etc.)
              if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
                return `"${value.replace(/"/g, '""')}"`
              }
              return value
            })
            .join(","),
        ),
      ].join("\n")

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Failed to export data. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportClients = () => {
    const filteredClients = filterDataByDateRange(clients)
    exportToCSV(filteredClients, "clients-export")
  }

  const handleExportPrograms = () => {
    exportToCSV(programs, "programs-export")
  }

  const handleExportEnrollments = () => {
    const filteredEnrollments = filterDataByDateRange(
      enrollments.map((enrollment) => ({
        ...enrollment,
        created_at: enrollment.created_at || "", // Ensure 'created_at' matches the actual date field in Enrollment
      }))
    )
    exportToCSV(filteredEnrollments, "enrollments-export")
  }

  const handleExportAll = () => {
    // Create a comprehensive report with all data
    const filteredClients = filterDataByDateRange(clients)
    const filteredEnrollments = filterDataByDateRange(
      enrollments.map((enrollment) => ({
        ...enrollment,
        created_at: enrollment.created_at || "", // Ensure 'created_at' is always a string
      }))
    )

    // Export each dataset
    exportToCSV(filteredClients, "all-clients-export")
    exportToCSV(programs, "all-programs-export")
    exportToCSV(filteredEnrollments, "all-enrollments-export")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleExportClients}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Export Clients</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPrograms}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Export Programs</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportEnrollments}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Export Enrollments</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportAll}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Export All Data</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
