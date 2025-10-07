const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const rooms = {};

function generateNeurons() {
  return Array.from({ length: 16 }).map((_, i) => ({
    id: i + 1,
    x: Math.random() * 550 + 25,
    y: Math.random() * 350 + 25,
  }));
}

io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    if (!rooms[room]) {
      rooms[room] = {
        players: new Set(),
        roles: new Map(),
        neurons: generateNeurons(),
      };
    }
    const r = rooms[room];
    r.players.add(socket.id);
    socket.join(room);

    // rôle
    const rolesUsed = new Set(r.roles.values());
    let role = "tech";
    if (!rolesUsed.has("medic")) role = "medic";
    else if (!rolesUsed.has("tech")) role = "tech";
    else role = "spectator";

    r.roles.set(socket.id, role);
    socket.emit("role_assigned", role);

    // envoie les neurones à tout le monde
    socket.emit("neurons_data", r.neurons);

    const players = [...r.roles.values()].filter((v) => v === "medic" || v === "tech").length;
    io.to(room).emit("player_joined", { players });

    console.log(`Room ${room}: ${players} joueurs`);
  });

  socket.on("action", (data) => {
    socket.to(data.room).emit("update_state", data);
  });

  socket.on("disconnect", () => {
    for (const [roomName, r] of Object.entries(rooms)) {
      if (r.players.delete(socket.id)) {
        r.roles.delete(socket.id);
        const players = [...r.roles.values()].filter((v) => v === "medic" || v === "tech").length;
        io.to(roomName).emit("player_left", players);
        if (r.players.size === 0) delete rooms[roomName];
      }
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`✅ Socket server running on port ${PORT}`));



