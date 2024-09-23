import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from 'redis';
import { REDIS_URL } from 'src/backend/config/constants';
import { HttpException } from 'src/backend/utils/HttpException';

interface RateLimitOptions {
  windowMs?: number;
  max?: number;
  message?: string;
  statusCode?: number;
}

export const createRateLimiter = (options: RateLimitOptions = {}) => {
  // Create a Redis client
  const redisClient = redis.createClient(REDIS_URL);

  // Create a RedisStore instance
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:',
  });

  // Set up default options
  const defaultOptions: RateLimitOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    statusCode: 429,
  };

  // Merge provided options with default options
  const mergedOptions = { ...defaultOptions, ...options };

  // Create and return the rate limit middleware
  return rateLimit({
    store: redisStore,
    windowMs: mergedOptions.windowMs,
    max: mergedOptions.max,
    handler: (req: Request, res: Response, next: NextFunction) => {
      throw new HttpException(mergedOptions.statusCode, mergedOptions.message);
    },
  });
};

// Human tasks:
// TODO: Implement unit tests for the createRateLimiter function
// TODO: Add documentation for the available options and their default values
// TODO: Implement different rate limit tiers for various API endpoints or user roles
// TODO: Add logging for rate limit hits and near-limit warnings
// TODO: Implement a mechanism to dynamically adjust rate limits based on server load
// TODO: Create a whitelist mechanism for certain IPs or API keys to bypass rate limiting
// TODO: Implement a fallback mechanism in case the Redis connection fails