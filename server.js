const express = require("express");
const axios = require("axios");
const cors = require("cors");
const Redis = require("redis");

const redisClient = Redis.createClient();
const DEFAULT_EXPIRATION = 3600;
redisClient.connect();

const app = express();
app.use(cors());

app.get("/photos", async (req, res) => {
  const photos = await redisClient.get("photos");

  if (photos != null) {
    return res.json(JSON.parse(photos));
  } else {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/photos",
      { params: { albumId } }
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
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
    );

    redisClient.setEx(
      `photo:${req.params.id}`,
      DEFAULT_EXPIRATION,
      JSON.stringify(data)
    );
    res.json(data);
  }
});

app.listen(3000, () => {
  console.log("listening at http://localhost:3000");
});
