"use client";
import { useState } from "react";
import BrainPuzzle from "@/components/BrainPuzzle";

export default function Mission() {
  // Liste des étapes (organes)
  const [currentOrgan, setCurrentOrgan] = useState<"brain" | "heart" | "lungs" | "dna">("brain");
  const [solved, setSolved] = useState(false);

  const handleSolve = () => {
    setSolved(true);

    // Passage automatique à l’étape suivante
    setTimeout(() => {
      if (currentOrgan === "brain") setCurrentOrgan("heart");
      else if (currentOrgan === "heart") setCurrentOrgan("lungs");
      else if (currentOrgan === "lungs") setCurrentOrgan("dna");
      else if (currentOrgan === "dna") alert("✅ Mission terminée !");
      setSolved(false);
    }, 1000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">🧠 Inside the Human Body</h1>

      {currentOrgan === "brain" && (
        <>
          <h2 className="text-2xl mb-4 text-cyan-400">Phase 1 : Cerveau</h2>
          <BrainPuzzle onSolve={() => setSolved(true)} />
        </>
      )}

      {currentOrgan === "heart" && (
        <h2 className="text-2xl text-red-500">❤️ Prochaine étape : le cœur (à venir)</h2>
      )}

      {currentOrgan === "lungs" && (
        <h2 className="text-2xl text-blue-400">🫁 Étape suivante : les poumons (à venir)</h2>
      )}

      {currentOrgan === "dna" && (
        <h2 className="text-2xl text-green-400">🧬 Dernière étape : ADN (à venir)</h2>
      )}

      <div className="mt-8">
        {solved && (
          <button
            onClick={handleSolve}
            className="px-4 py-2 bg-cyan-600 rounded-xl hover:bg-cyan-700 transition cursor-pointer"
          >
            Passer à l'étape suivante
          </button>
        )}
        {!solved && (
          <p className="text-gray-500 italic">Résous l'étape pour continuer...</p>
        )}
      </div>

    </main>
  );
}


