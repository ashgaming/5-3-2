const redis = require('redis');
const maxReconnectAttempts = 3; // Reduced from 5
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    retry_strategy: (options) => {
        if (options.attempt > maxReconnectAttempts) {
            return new Error('Max reconnect attempts reached');
        }
        if (options.total_retry_time > 1000 * 60 * 2) { // 2 minutes
            return new Error('Retry time exhausted');
        }
        return 1000; // Fixed 1-second delay
    }
});

console.log('connecting to the redis\n');

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('ready', () => console.log('Redis client ready'));
redisClient.on('end', () => console.log('Redis connection closed'));
//redisClient.on('reconnecting', () => console.log('Redis client reconnecting'));

(async () => {
    try {
       // await redisClient.connect();
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

module.exports = redisClient;