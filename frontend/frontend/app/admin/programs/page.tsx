"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchPrograms, searchPrograms } from "../../../lib/api-services";
import { Program } from "../../../lib/types";
import SearchBar from "../../../components/SearchBar";
import CreateProgramForm from "../../../components/CreateProgramForm";
import ProgramCard from "../../../components/ProgramCard";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { motion } from "framer-motion";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    console.log("ProgramsPage mounted");
    return () => {
      console.log("ProgramsPage unmounted");
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPrograms = async () => {
      try {
        const data = await fetchPrograms();
        if (isMounted) {
          setPrograms(data);
        }
      } catch (err) {
        console.error("Failed to fetch programs", err);
      }
    };

    loadPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    try {
      if (query) {
        const results = await searchPrograms(query);
        setPrograms(results);
      } else {
        const data = await fetchPrograms();
        setPrograms(data);
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  }, []);

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 md:ml-64"
      >
        <h1 className="mb-4">Programs</h1>
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <SearchBar onSearch={handleSearch} placeholder="Search programs..." />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create Program
          </motion.button>
        </div>
        {showCreateForm && (
          <CreateProgramForm
            onClose={() => setShowCreateForm(false)}
            onCreate={() => fetchPrograms().then(setPrograms)}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}