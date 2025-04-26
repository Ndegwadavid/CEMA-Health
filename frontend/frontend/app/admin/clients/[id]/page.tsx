// frontend/frontend/app/admin/clients/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchClient, fetchEnrollments } from "../../../../lib/api-services";
import { Client, Enrollment } from "../../../../lib/types";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import { motion } from "framer-motion";

export default function ClientDetailsPage() {
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientId = Number(id);
        const [clientData, enrollmentsData] = await Promise.all([
          fetchClient(clientId),
          fetchEnrollments(clientId),
        ]);
        setClient(clientData);
        setEnrollments(enrollmentsData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load client details");
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-4">Loading...</div>
      </ProtectedRoute>
    );
  }

  if (error || !client) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-4 text-red-500">{error || "Client not found"}</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-4"
      >
        <h1 className="text-3xl font-bold mb-4">
          {client.first_name} {client.last_name}
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-gray-600">Phone: {client.phone_number}</p>
          <p className="text-gray-600">Age: {client.age}</p>
          <p className="text-gray-600">Area: {client.area_of_residence}</p>
          <p className="text-gray-600">Profession: {client.profession || "N/A"}</p>
          <p className="text-gray-600">Created: {new Date(client.created_at).toLocaleDateString()}</p>
          <p className="text-gray-600">Updated: {new Date(client.updated_at).toLocaleDateString()}</p>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Enrolled Programs</h2>
          {enrollments.length > 0 ? (
            <ul className="list-disc pl-5">
              {enrollments.map((enrollment) => (
                <li key={enrollment.id}>
                  {enrollment.program_name} ({enrollment.program_short_code}) - Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No programs enrolled</p>
          )}
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}