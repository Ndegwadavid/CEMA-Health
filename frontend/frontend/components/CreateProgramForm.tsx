"use client";

import { useState } from "react";
import { createProgram } from "../lib/api-services";
import { motion } from "framer-motion";

interface CreateProgramFormProps {
  onClose: () => void;
  onCreate: () => void;
}

export default function CreateProgramForm({ onClose, onCreate }: CreateProgramFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    short_code: "",
    description: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProgram(formData);
      onCreate();
      onClose();
    } catch (err) {
      setError("Failed to create program");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="modal bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="mb-4 text-xl font-semibold">Create Program</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Short Code
            </label>
            <input
              type="text"
              value={formData.short_code}
              onChange={(e) => setFormData({ ...formData, short_code: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn-primary"
            >
              Create
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}