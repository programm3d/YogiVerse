const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

// Handle Redis errors
redis.on('error', (err) => {
    console.error('Redis error:', err.message);
});

// Optional: reconnect logs
redis.on('connect', () => console.log('Redis connected'));
redis.on('reconnecting', () => console.log('Redis reconnecting...'));


module.exports = redis;

