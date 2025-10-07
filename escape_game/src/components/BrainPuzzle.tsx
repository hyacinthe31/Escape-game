"use client";
import { useState, useEffect } from "react";
import socket from "@/lib/socket";

export default function BrainPuzzle() {
  const [connections, setConnections] = useState<number[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    socket.on("role_assigned", (r) => setRole(r));

    socket.on("update_state", (data) => {
      if (data.type === "connect_neuron") {
        setConnections((prev) => [...prev, data.value]);
      }
    });

    return () => {
      socket.off("update_state");
      socket.off("role_assigned");
    };
  }, []);

  const handleClick = (id: number) => {
    socket.emit("action", { room: "patient-1", type: "connect_neuron", value: id });
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-4">Cerveau : {role === "medic" ? "Donne les instructions" : "Active les neurones"}</h2>
      {role === "tech" ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className="w-12 h-12 bg-cyan-700 rounded-full hover:bg-cyan-500"
            >
              {id}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-400">Neurones connectés :</p>
          <p className="text-lg">{connections.join(", ") || "Aucune connexion"}</p>
        </div>
      )}
    </div>
  );
}

