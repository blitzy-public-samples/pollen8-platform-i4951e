import Redis from 'ioredis';
import { REDIS_URL, REDIS_PORT, REDIS_PASSWORD } from './constants';

function createRedisClient(): Redis {
  const redisOptions: Redis.RedisOptions = {
    host: REDIS_URL,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    retryStrategy: (times: number) => {
      // Exponential backoff with a maximum of 5 seconds
      return Math.min(times * 100, 5000);
    },
  };

  const client = new Redis(redisOptions);

  client.on('error', (error: Error) => {
    console.error('Redis connection error:', error);
    // TODO: Implement proper error handling and logging
  });

  client.on('connect', () => {
    console.log('Successfully connected to Redis');
    // TODO: Implement proper logging for different environments
  });

  return client;
}

export const redisClient = createRedisClient();

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  console.log('Closing Redis connection...');
  await redisClient.quit();
  console.log('Redis connection closed.');
  process.exit(0);
});