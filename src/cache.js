const redis = require("redis");


const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

let hasLoggedError = false;
redisClient.on("error", (err) => {
  if (!hasLoggedError) {
    console.error(" Redis connection error: ", err);
    hasLoggedError = true;
  }
});

// --------------- Connect to redis cloud -------------------------------------------------------------------------------
(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to redis cloud Successfully");
  } catch (err) {
    console.log("Redis connection failed", err.message);
  }
})();

module.exports = { redisClient };
