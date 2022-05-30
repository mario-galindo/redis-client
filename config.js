const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  REDIS_PORT: process.env.REDIS_PORT,
  PORT: process.env.PORT,
};
