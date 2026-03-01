const redis = require("redis");
const logger = require("../utils/logger");

let redisClient;

async function initializeRedis() {
  redisClient = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT) || 6379,
    },
  });

  redisClient.on("error", (err) => {
    logger.error("Redis Client Error:", err);
  });

  redisClient.on("connect", () => {
    logger.info("Redis connected successfully");
  });

  await redisClient.connect();
  return redisClient;
}

async function getCache(key) {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Cache get error for key ${key}:`, error);
    return null;
  }
}

async function setCache(key, value, ttl = 300) {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error(`Cache set error for key ${key}:`, error);
    return false;
  }
}

async function deleteCache(key) {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Cache delete error for key ${key}:`, error);
    return false;
  }
}

async function deleteCachePattern(pattern) {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    logger.error(`Cache delete pattern error for ${pattern}:`, error);
    return false;
  }
}

function getRedisClient() {
  return redisClient;
}

module.exports = {
  initializeRedis,
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  getRedisClient,
};
