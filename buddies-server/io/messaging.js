const socketioJwt = require("@thream/socketio-jwt");

const User = require("../models/User");
const config = require("../config");
const Chatroom = require("../models/Chatroom");
const { ioRequiresRole } = require("../lib/auth");

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
    const user = await User.findById(socket.user._id);

    if (!user) {
      throw new Error("unauthorized");
    }

    // join all chatrooms of the user
    user.chatrooms.forEach(({ chatroomId }) => {
      socket.join(chatroomId);
    });

    socket.on("sendMessage", async ({ chatroomId, message }) => {
      const user = await User.findById(socket.user._id);

      if (!user) {
        throw new Error("unauthorized");
      }

      if (user.chatrooms.some((x) => x.chatroomId === chatroomId)) {
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
  });
};

module.exports = { init };
