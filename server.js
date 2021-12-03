const express = require("express");
const axios = require("axios");
const cors = require("cors");
const Redis = require("redis");

const redisClient = Redis.createClient();
const app = express();
app.use(cors());

app.get("/photos", async (req, res) => {
  await redisClient.connect();
  
  const value = await redisClient.get("name")

  const albumId = req.query.albumId;
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/photos",
    { params: { albumId } }
  );

  redisClient.setEx("photos", 3600, JSON.stringify(data));
  res.json(data);
  console.log(value);

});

app.get("/photos/:id", async (req, res) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
  );
  res.json(data);
});

app.listen(3000, () => {
  console.log("listening at http://localhost:3000");
});
