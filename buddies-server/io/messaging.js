const socketioJwt = require("@thream/socketio-jwt");

const config = require("../config");
const { ioRequiresRole } = require("../lib/auth");
const Chatroom = require("../models/Chatroom");
const User = require("../models/User");

const init = (io) => {
  const namespace = io.of("/message");
  namespace.use(
    socketioJwt.authorize({
      secret: config.SECRET_KEY,
    })
  );

  namespace.use(async (socket, next) => {
    const { _id } = socket.decodedToken;

    if (!(await User.findById(_id))) {
      return next(new Error("unauthorized"));
    }

    socket.user = socket.decodedToken;

    next();
  });

  namespace.use(ioRequiresRole("user"));

  namespace.on("connection", async (socket) => {
    // When a user logs in...
    const user = await User.findById(socket.user._id);
    if (!user) {
      throw new Error("unauthorized");
    }
    console.log(`User ${user.username} has connected!`);

    // Join all chatrooms of the user
    user.chatrooms.forEach((chatroomId) => {
      socket.join(chatroomId);
    });

    socket.on("sendMessage", async ({ chatroomId, message }) => {
      // When a user sends a message to this server...
      const user = await User.findById(socket.user._id);

      if (!user) {
        throw new Error("unauthorized");
      }
      if (user.chatrooms.includes(chatroomId)) {
        const chatroom = await Chatroom.findById(chatroomId);
        chatroom.messages.push({ from: socket.user_id, message });

        await chatroom.updateOne({ $set: chatroom });

        namespace.to(chatroomId).emit("receiveMessage", {
          from: socket.user._id,
          chatroomId,
          message,
        });
      } else {
        throw new Error("unauthorized");
      }
    });

    socket.on("disconnect", async () => {
      // When a user logs out...
      const user = await User.findById(socket.user._id);
      console.log(`User ${user.username} has disconnected!`);
    });
  });
};

module.exports = { init };
