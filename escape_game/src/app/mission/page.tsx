"use client";
import BrainPuzzle from "@/components/BrainPuzzle";
import { useGameStore } from "@/lib/store";

export default function Mission() {
  const { currentOrgan, setOrgan } = useGameStore();

  const handleSolve = () => {
    if (currentOrgan === "brain") setOrgan("heart");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <BrainPuzzle onSolve={handleSolve} />
    </main>
  );
}

