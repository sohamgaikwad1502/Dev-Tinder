const { Chat } = require("../models/chats");

const initSocket = (server) => {
  const socket = require("socket.io");
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId, firstName }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      // console.log("Joining Room ID : " + "of" + firstName, roomId);
      socket.join(roomId);
    }),
      socket.on(
        "sendMessage",
        async ({ firstName, targetUserId, userId, text }) => {
          try {
            const roomId = [userId, targetUserId].sort().join("_");
            let chat = await Chat.findOne({
              participants: { $all: [userId, targetUserId] },
            });

            if (!chat) {
              chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
              });
            }

            chat.messages.push({
              senderId: userId,
              text,
            });

            await chat.save();
            socket
              .to(roomId)
              .emit("messageReceived", { firstName, text, userId });
          } catch (error) {
            console.log(error);
          }
        }
      ),
      socket.on("Disconnect", () => {});
  });
};

module.exports = { initSocket };
