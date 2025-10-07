const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = {}; // { roomName: [socketIds] }

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(socket.id);

    const players = rooms[room].length;

    // Assigne un rôle automatiquement
    const role = players === 1 ? "medic" : "tech";
    socket.emit("role_assigned", role);

    // Informe tous les joueurs de la room
    io.to(room).emit("player_joined", { players });
  });

  socket.on("action", (data) => {
    // Relay action to the other player
    socket.to(data.room).emit("update_state", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((id) => id !== socket.id);
      io.to(room).emit("player_left", rooms[room].length);
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`✅ Socket server running on port ${PORT}`));
