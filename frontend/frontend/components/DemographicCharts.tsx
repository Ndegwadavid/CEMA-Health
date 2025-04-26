"use client"

import { useMemo } from "react"
import type { Client } from "../lib/types"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface DemographicChartsProps {
  clients: Client[]
}

export function DemographicCharts({ clients }: DemographicChartsProps) {
  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  // Process profession data
  const professionData = useMemo(() => {
    const professions: Record<string, number> = {}

    clients.forEach((client) => {
      const profession = client.profession || "Not Specified"
      professions[profession] = (professions[profession] || 0) + 1
    })

    // Convert to array and sort by count
    return Object.entries(professions)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6) // Take top 6 professions
  }, [clients])

  // Process age group data with more detailed breakdown
  const ageGroupData = useMemo(() => {
    const ageGroups = {
      "0-18": 0,
      "19-25": 0,
      "26-35": 0,
      "36-45": 0,
      "46-55": 0,
      "56-65": 0,
      "66+": 0,
    }

    clients.forEach((client) => {
      const age = client.age
      if (age <= 18) ageGroups["0-18"]++
      else if (age <= 25) ageGroups["19-25"]++
      else if (age <= 35) ageGroups["26-35"]++
      else if (age <= 45) ageGroups["36-45"]++
      else if (age <= 55) ageGroups["46-55"]++
      else if (age <= 65) ageGroups["56-65"]++
      else ageGroups["66+"]++
    })

    return Object.entries(ageGroups).map(([name, value]) => ({ name, value }))
  }, [clients])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profession Distribution */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profession Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={professionData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" stroke="#888888" />
              <YAxis dataKey="name" type="category" stroke="#888888" width={100} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(229, 231, 235, 0.5)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar dataKey="value" name="Clients" fill="#8884d8">
                {professionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Age Distribution */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Detailed Age Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ageGroupData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {ageGroupData.map((_, index) => (
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
  )
}
