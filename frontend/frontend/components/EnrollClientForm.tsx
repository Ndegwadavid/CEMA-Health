"use client";

import { useState, useEffect } from "react";
import { fetchClients, fetchPrograms, createEnrollment } from "../lib/api-services";
import { Client, Program } from "../lib/types";
import { motion } from "framer-motion";

interface EnrollClientFormProps {
  onClose: () => void;
  onEnroll: () => void;
}

export default function EnrollClientForm({ onClose, onEnroll }: EnrollClientFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, programsData] = await Promise.all([
          fetchClients(),
          fetchPrograms(),
        ]);
        setClients(clientsData);
        setPrograms(programsData);
      } catch (err) {
        setError("Failed to load clients or programs");
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!selectedClientId || !selectedProgramId) {
      setError("Please select a client and a program");
      setIsSubmitting(false);
      return;
    }

    try {
      await createEnrollment(selectedClientId, selectedProgramId);
      onEnroll();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to enroll client");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="modal bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="mb-4 text-xl font-semibold text-blue-700">Enroll Client in Program</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              value={selectedClientId || ""}
              onChange={(e) => setSelectedClientId(Number(e.target.value))}
              className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>
                Select a client
              </option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.first_name} {client.last_name} ({client.phone_number})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Program
            </label>
            <select
              value={selectedProgramId || ""}
              onChange={(e) => setSelectedProgramId(Number(e.target.value))}
              className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>
                Select a program
              </option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.short_code})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              disabled={isSubmitting}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enrolling..." : "Enroll"}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}