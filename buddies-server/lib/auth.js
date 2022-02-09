const jwtMiddleware = require("express-jwt");
const authMiddleware = require("express-jwt-permissions")();
const jwt = require("jsonwebtoken");

const config = require("../config");
const { compose } = require("./utils");

const generateToken = ({ _id, username, isAdmin }, { expiresIn }) => {
  const payload = {
    _id,
    username,
    permissions: isAdmin ? "admin user" : "user",
  };

  const token = jwt.sign(payload, config.SECRET_KEY, {
    expiresIn: expiresIn || "7 days",
    algorithm: "HS256",
  });

  return token;
};

const ensureValid = (token) => {
  return jwt.verify(token, config.SECRET_KEY);
};

const requiresRole = (role) => {
  return compose([
    jwtMiddleware({
      secret: config.SECRET_KEY,
      algorithms: ["HS256"],
    }),
    authMiddleware.check(role),
  ]);
};

const ioRequiresRole = (role) => {
  return (socket, next) => authMiddleware.check(role)(socket, {}, next);
};

module.exports = { generateToken, requiresRole, ioRequiresRole, ensureValid };
