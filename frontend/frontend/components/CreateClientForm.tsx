"use client";

import { useState } from "react";
import { createClient } from "../lib/api-services";
import { motion } from "framer-motion";

interface CreateClientFormProps {
  onClose: () => void;
  onCreate: () => void;
}

export default function CreateClientForm({ onClose, onCreate }: CreateClientFormProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    phone_number: "",
    area_of_residence: "",
    profession: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClient({
        ...formData,
        age: Number(formData.age),
      });
      onCreate();
      onClose();
    } catch (err) {
      setError("Failed to create client");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="modal bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="mb-4 text-xl font-semibold text-blue-700">Create Client</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              max="150"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
              pattern="\+?\d{9,15}"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area of Residence
            </label>
            <input
              type="text"
              value={formData.area_of_residence}
              onChange={(e) => setFormData({ ...formData, area_of_residence: e.target.value })}
              className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profession
            </label>
            <input
              type="text"
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Create
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}