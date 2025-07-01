const { Server } = require("socket.io");
const { handleSocketEvents } = require("../controllers/socketController");

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);
    handleSocketEvents(io, socket); // định nghĩa trong controller
  });
}

module.exports = setupSocket;
