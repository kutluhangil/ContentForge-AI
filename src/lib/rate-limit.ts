import { redis } from '@/lib/redis';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Sliding-window rate limiter using Redis.
 * @param key   Unique key (e.g. `rl:${ip}` or `rl:user:${userId}`)
 * @param limit Max requests allowed in the window
 * @param windowSeconds Window duration in seconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;

  const multi = redis.multi();
  // Remove entries outside the current window
  multi.zremrangebyscore(key, 0, windowStart);
  // Add current request
  multi.zadd(key, now, `${now}:${Math.random()}`);
  // Count entries in window
  multi.zcard(key);
  // Set expiry to clean up the key eventually
  multi.expire(key, windowSeconds);

  const results = await multi.exec();
  const count = (results?.[2]?.[1] as number) ?? 0;

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt: new Date(now + windowMs),
  };
}

/**
 * IP-based rate limiter for API routes.
 * Default: 60 requests per minute.
 */
export async function rateLimitByIp(
  ip: string,
  limit = 60,
  windowSeconds = 60,
): Promise<RateLimitResult> {
  return rateLimit(`rl:ip:${ip}`, limit, windowSeconds);
}

/**
 * User-based rate limiter for authenticated API routes.
 * Default: 30 requests per minute.
 */
export async function rateLimitByUser(
  userId: string,
  limit = 30,
  windowSeconds = 60,
): Promise<RateLimitResult> {
  return rateLimit(`rl:user:${userId}`, limit, windowSeconds);
}
