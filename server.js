const express = require("express");
const axios = require("axios");
const cors = require("cors");
const Redis = require("redis");
const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");

const {
  REDIS_PORT,
  REDIS_HOST,
  REDIS_PASSWORD,
  APP_PORT,
  DEFAULT_EXPIRATION
} = require("./config");

const redisClient = Redis.createClient(REDIS_PORT, REDIS_HOST);
redisClient.connect();

const app = express();
app.use(cors());

app.get("/photos", async (req, res) => {
  const photos = await redisClient.get("photos");

  if (photos != null) {
    console.log("Retrieve data from Redis Cache");
    return res.json(JSON.parse(photos));
  } else {
    console.log("Retrieve data from external API");
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/photos?_start=0&_limit=3"
    );

    redisClient.setEx("photos", DEFAULT_EXPIRATION, JSON.stringify(data));
    res.json(data);
  }
});

app.get("/photos/:id", async (req, res) => {
  const photo = await redisClient.get(`photo:${req.params.id}`);

  if (photo != null) {
    return res.json(JSON.parse(photo));
  } else {
    const { data } = await axios
      .get(`https://jsonplaceholder.typicode.com/photos/${req.params.id}`)
      .then((data) => {
        console.log(data);
      });

    redisClient.setEx(
      `photo:${req.params.id}`,
      DEFAULT_EXPIRATION,
      JSON.stringify(data)
    );
    res.json(data);
  }
});

app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

app.listen(APP_PORT, () => {
  console.log(`listening at http://localhost:${APP_PORT}`);
});
