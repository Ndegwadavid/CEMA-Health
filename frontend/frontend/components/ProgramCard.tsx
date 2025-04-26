"use client";

import { Program } from "../lib/types";
import { motion } from "framer-motion";

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-lg font-semibold">{program.name}</h3>
      <p className="text-text-secondary">Code: {program.short_code}</p>
      <p className="mt-2">{program.description}</p>
    </motion.div>
  );
}