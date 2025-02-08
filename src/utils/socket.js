const initSocket = (server) => {
  const socket = require("socket.io");
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5123",
    },
  });

  io.on("connection", (socket) => []);
};

module.exports = { initSocket };
