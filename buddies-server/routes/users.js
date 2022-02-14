const bcrypt = require("bcrypt");
const { celebrate, Joi, Segments } = require("celebrate");
const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();

const { requiresRole } = require("../lib/auth");
const User = require("../models/User");

// update user
router.put(
  "/:id",
  requiresRole("user"),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().min(4).max(20),
      email: Joi.string().lowercase().email(),
      password: Joi.string().min(6).max(40),
    }),
  }),
  asyncHandler(async (req, res) => {
    if (
      req.user._id === req.params.id ||
      req.user.permissions.includes("admin")
    ) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      return res.status(200).json("Account has been updated");
    } else {
      return res.status(403).json("You can update only your account!");
    }
  })
);

//delete user
router.delete(
  "/:id",
  requiresRole("user"),
  asyncHandler(async (req, res) => {
    if (
      req.user._id === req.params.id ||
      req.user.permissions.includes("admin")
    ) {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account has been deleted");
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  })
);

//get a user
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const { chatroomsAsGuest, chatroomsAsHost, password, updatedAt, ...other } =
      user._doc;

    return res.status(200).json(other);
  })
);

//get a user's chatrooms
router.get(
  "/:id/chatrooms",
  requiresRole("user"),
  asyncHandler(async (req, res) => {
    if (
      req.user._id === req.params.id ||
      req.user.permissions.includes("admin")
    ) {
      const user = await User.findById(req.params.id);

      return res.status(200).json({
        chatroomsAsGuest: user.chatroomsAsGuest,
        chatroomsAsHost: user.chatroomsAsHost,
      });
    } else {
      return res
        .status(403)
        .json("You can get chatrooms of only your account!");
    }
  })
);

// follow a user
router.put(
  "/:id/follow",
  requiresRole("user"),
  asyncHandler(async (req, res) => {
    if (req.user._id !== req.params.id) {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user._id);

      if (!user.followers.includes(req.user._id)) {
        await user.updateOne({ $push: { followers: req.user._id } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).json("user has been followed");
      } else {
        return res.status(403).json("you already follow this user");
      }
    } else {
      return res.status(403).json("you cant follow yourself");
    }
  })
);

// unfollow a user
router.put(
  "/:id/unfollow",
  requiresRole("user"),
  asyncHandler(async (req, res) => {
    if (req.user._id !== req.params.id) {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user._id);

      if (user.followers.includes(req.user._id)) {
        await user.updateOne({ $pull: { followers: req.user._id } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        return res.status(200).json("user has been unfollowed");
      } else {
        return res.status(403).json("you dont follow this user");
      }
    } else {
      return res.status(403).json("you cant unfollow yourself");
    }
  })
);

module.exports = router;
