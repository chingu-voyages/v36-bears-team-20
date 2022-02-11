const { celebrate, Joi, Segments } = require("celebrate");
const express = require("express");
const asyncHandler = require("express-async-handler");

const { requiresRole } = require("../lib/auth");
const Chatroom = require("../models/Chatroom");
const Event = require("../models/Event");
const User = require("../models/User");

const router = express.Router();

// create event
router.post(
  "/",
  requiresRole("user"),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      activity: Joi.string().required(),
      date: Joi.date().required(),
      location: Joi.array().items(Joi.number()).length(2).required(),
    }),
  }),
  asyncHandler(async (req, res) => {
    req.body.userId = req.user._id;
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();

    return res.status(200).json(savedEvent);
  })
);

// update event
router.put(
  "/:id",
  requiresRole("user"),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string(),
      activity: Joi.string(),
      date: Joi.date(),
      location: Joi.array().items(Joi.number()).length(2),
    }),
  }),
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event.userId === req.user._id) {
      await event.updateOne({ $set: req.body });

      return res.status(200).json("you updated your event");
    } else {
      return res.status(403).json("You can only update your own posts");
    }
  })
);

// join event
router.put(
  "/join/:id",
  requiresRole("user"),
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    const userId = req.user._id;

    if (!event.guests.includes(userId)) {
      event.guests.push(userId);
      await event.updateOne({ $set: event });

      // Create new chatroom
      const chatroom = new Chatroom({
        chatroomType: "event",
        relatedId: event._id,
        host: event.userId,
        guest: userId,
      });

      await chatroom.save();

      const host = await User.findById(event.userId);
      const guest = await User.findById(userId);

      // Add this chatroom to user's list of chatrooms
      host.chatroomsAsHost.push(String(chatroom._id));
      guest.chatroomsAsGuest.push(String(chatroom._id));

      await host.updateOne({ $set: host });
      await guest.updateOne({ $set: guest });

      return res.status(200).json(event);
    } else {
      return res.status(403).json("You are already attending this event");
    }
  })
);

// leave event
router.put(
  "/leave/:id",
  requiresRole("user"),
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    const userId = req.user._id;

    if (event.guests.includes(userId)) {
      event.guests.splice(event.guests.indexOf(userId), 1);
      await event.updateOne({ $set: event });

      const chatroom = await Chatroom.findOne(
        {
          chatroomType: "event",
          relatedId: event._id,
          guest: userId,
        },
        { messages: 0 }
      );

      const host = await User.findById(event.userId);
      const guest = await User.findById(userId);

      host.chatroomsAsHost.splice(
        user.chatroomsAsHost.indexOf(chatroom._id),
        1
      );
      guest.chatroomsAsGuest.splice(
        user.chatroomsAsGuest.indexOf(chatroom._id),
        1
      );

      await host.updateOne({ $set: host });
      await guest.updateOne({ $set: guest });

      await Chatroom.findByIdAndDelete(chatroom._id);

      return res.status(200).json(event);
    } else {
      return res.status(403).json("You have not joined this event!");
    }
  })
);

// delete event
router.delete(
  "/:id",
  requiresRole("user"),
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event.userId === req.user._id) {
      await event.deleteOne();

      return res.status(200).json("Event has been deleted");
    } else {
      return res.status(403).json("You can only delete your own event");
    }
  })
);

// get Event
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    return res.status(200).json(event);
  })
);

// get Events
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const events = await Event.find();

    return res.status(200).json(events);
  })
);

module.exports = router;
