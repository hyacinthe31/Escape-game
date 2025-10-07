"use client";
import { motion } from "framer-motion";

export default function BrainPuzzle({ onSolve }: { onSolve: () => void }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Cerveau : Connecte les neurones</h2>
      <motion.div
        className="w-64 h-64 bg-cyan-900 rounded-xl flex items-center justify-center"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <button
          onClick={onSolve}
          className="bg-cyan-600 px-4 py-2 rounded-xl hover:bg-cyan-700"
        >
          Résoudre
        </button>
      </motion.div>
    </div>
  );
}
