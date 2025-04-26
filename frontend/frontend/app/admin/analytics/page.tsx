// app/admin/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchClients } from "../../../lib/api-services";
import { Client } from "../../../lib/types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AnalyticsPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetchClients().then(setClients).catch(console.error);
  }, []);

  const ageGroups = {
    "0-18": 0,
    "19-30": 0,
    "31-50": 0,
    "51+": 0,
  };
  clients.forEach((client) => {
    if (client.age <= 18) ageGroups["0-18"]++;
    else if (client.age <= 30) ageGroups["19-30"]++;
    else if (client.age <= 50) ageGroups["31-50"]++;
    else ageGroups["51+"]++;
  });

  const ageData = {
    labels: Object.keys(ageGroups),
    datasets: [
      {
        data: Object.values(ageGroups),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const residenceGroups = clients.reduce((acc, client) => {
    acc[client.area_of_residence] = (acc[client.area_of_residence] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const residenceData = {
    labels: Object.keys(residenceGroups),
    datasets: [
      {
        data: Object.values(residenceGroups),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 md:ml-64"
      >
        <h1 className="mb-4">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="mb-4">Age Distribution</h2>
            <Pie data={ageData} />
          </div>
          <div className="card">
            <h2 className="mb-4">Residence Distribution</h2>
            <Pie data={residenceData} />
          </div>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}