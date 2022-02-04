const authMiddleware = require("express-jwt-permissions")();
const jwtMiddleware = require("express-jwt");
const jwt = require("jsonwebtoken");

const { compose } = require("./utils");
const config = require("../config");

const generateToken = ({ id, username, isAdmin }, { expiresIn }) => {
    const payload = {
        id,
        username,
        permissions: isAdmin ? "admin user" : "user"
    };

    const token = jwt.sign(payload, config.SECRET_KEY, {
        expiresIn: expiresIn || "7 days",
        algorithm: "HS256"
    });

    return token;
}

const ensureValid = (token) => {
    return jwt.verify(token, config.SECRET_KEY)
}

const requiresRole = (role) => {
    return compose([
        jwtMiddleware({ 
            secret: config.SECRET_KEY,
            algorithms: ["HS256"]
        }),
        authMiddleware.check(role)
    ])
}

module.exports = { generateToken, requiresRole, ensureValid }
