const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  APP_PORT: process.env.APP_PORT,
  DEFAULT_EXPIRATION: process.env.DEFAULT_EXPIRATION,
};
