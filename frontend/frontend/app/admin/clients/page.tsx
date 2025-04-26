"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchClients, searchClients, fetchEnrollments } from "../../../lib/api-services";
import { Client, Enrollment } from "../../../lib/types";
import SearchBar from "../../../components/SearchBar";
import CreateClientForm from "../../../components/CreateClientForm";
import ClientCard from "../../../components/ClientCard";
import EnrollClientForm from "../../../components/EnrollClientForm";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { motion } from "framer-motion";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEnrollForm, setShowEnrollForm] = useState(false);

  useEffect(() => {
    console.log("ClientsPage mounted");
    let isMounted = true;

    const loadData = async () => {
      try {
        const [clientsData, enrollmentsData] = await Promise.all([
          fetchClients(),
          fetchEnrollments(),
        ]);
        if (isMounted) {
          setClients(clientsData);
          setEnrollments(enrollmentsData);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    loadData();

    return () => {
      isMounted = false;
      console.log("ClientsPage unmounted");
    };
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    try {
      if (query) {
        const results = await searchClients(query);
        setClients(results);
      } else {
        const data = await fetchClients();
        setClients(data);
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  }, []);

  const handleEnroll = async () => {
    try {
      const enrollmentsData = await fetchEnrollments();
      setEnrollments(enrollmentsData);
    } catch (err) {
      console.error("Failed to refresh enrollments", err);
    }
  };

  const getClientEnrollments = (clientId: number) => {
    return enrollments.filter((enrollment) => enrollment.client_id === clientId);
  };

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-4"
      >
        <h1 className="text-3xl font-bold mb-4">Clients</h1>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <SearchBar onSearch={handleSearch} placeholder="Search clients..." />
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Create Client
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEnrollForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Enroll Client
            </motion.button>
          </div>
        </div>
        {showCreateForm && (
          <CreateClientForm
            onClose={() => setShowCreateForm(false)}
            onCreate={() => fetchClients().then(setClients)}
          />
        )}
        {showEnrollForm && (
          <EnrollClientForm
            onClose={() => setShowEnrollForm(false)}
            onEnroll={handleEnroll}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div key={client.id}>
              <ClientCard client={client} />
              <div className="mt-2">
                <p className="text-sm text-gray-500">Enrolled Programs:</p>
                {getClientEnrollments(client.id).length > 0 ? (
                  <ul className="list-disc pl-5 text-sm">
                    {getClientEnrollments(client.id).map((enrollment) => (
                      <li key={enrollment.id}>
                        {enrollment.program_name} ({enrollment.program_short_code}) - {enrollment.enrollment_id}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">No programs enrolled</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}