const bcrypt = require("bcrypt");
const { celebrate, Joi, Segments } = require("celebrate");
const express = require("express");
const asyncHandler = require("express-async-handler");

const { generateToken, ensureValid } = require("../lib/auth");
const User = require("../models/User");

const router = express.Router();

router.post(
  "/register",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().min(4).max(20).required(),
      email: Joi.string().lowercase().email(),
      password: Joi.string().min(6).max(40).required(),
    }),
  }),
  asyncHandler(async (req, res) => {
    try {
      // password generator
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // create a new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      // save user
      const user = await newUser.save();

      const token = generateToken(
        {
          _id: user._id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
        { expiresIn: "7 days" }
      );

      return res.status(200).json({ token });
    } catch (err) {
      if (err.code === 11000) {
        const response = {
          message: "a user with the same username and/or email already exists",
        };

        return res.status(409).json(response);
      } else {
        throw err;
      }
    }
  })
);

// login
router.post(
  "/login",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().lowercase().email(),
      password: Joi.string().min(6).max(40).required(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send("user not found");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json("wrong password");
    }

    const token = generateToken(
      {
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      { expiresIn: "7 days" }
    );

    return res.status(200).json({ token });
  })
);

// verify
router.post(
  "/verify",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      token: Joi.string().required(),
    }),
  }),
  asyncHandler(async (req, res) => {
    try {
      const payload = ensureValid(req.body.token);

      return res.status(200).json(payload);
    } catch (err) {
      return res.status(400).send("jwt is not valid");
    }
  })
);

module.exports = router;
