const dotenv = require("dotenv");

dotenv.config();

const env = process.env.NODE_ENV || "development";

const config = {
    NODE_ENV: env,
    MONGO_URL: process.env.MONGO_URL,
    SECRET_KEY: process.env.SECRET_KEY || (
        env === "development"
            ? require('crypto').randomBytes(48).toString('hex')
            : undefined
    )
}

module.exports = config
