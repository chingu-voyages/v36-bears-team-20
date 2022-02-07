const { celebrate, Joi, Segments } = require("celebrate");
const asyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();

const { requiresRole } = require("../lib/auth");
const Chatroom = require("../models/Chatroom");
const User = require("../models/User");
const config = require("../config");

//get a chatroom
router.get(
  "/:id",
  requiresRole("user"),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (
      user.chatrooms.includes(req.params.id) ||
      req.user.permissions.includes("admin")
    ) {
      const chatroom = await Chatroom.findById(req.params.id, {
        chatroomType: 1,
        relatedId: 1,
      });

      return res.status(200).json(chatroom);
    } else {
      return res
        .status(403)
        .json("You can get chatrooms of only your account!");
    }
  })
);

//get a chatroom's messages
router.get(
  "/:id/messages",
  requiresRole("user"),
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      start: Joi.number().default(0),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { start } = req.query;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).send("unauthorized");
    }

    if (user.chatrooms.contains(req.params.id)) {
      const chatroom = await Chatroom.findById(req.params.id, {
        messages: {
          $slice: [
            start * -1 - config.MESSAGES_PER_REQUEST,
            config.MESSAGES_PER_REQUEST,
          ],
        },
      });

      return res.status(200).json(chatroom);
    } else {
      return res.status(404).send("chatroom not found or inaccessible");
    }
  })
);

module.exports = router;
