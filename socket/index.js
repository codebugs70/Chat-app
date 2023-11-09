const { Server } = require("socket.io");

const io = new Server({ cors: "https://chat-app-sable-seven.vercel.app" });

let onlineUsers = [];

io.on("connection", (socket) => {
  // Add user when online
  socket.on("addNewUser", (userId) => {
    if (!userId) return;
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

    io.emit("getOnlineUsers", onlineUsers);
  });

  // Send and get messages
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.receiverId);

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  // Remove user when offline
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(8000);
