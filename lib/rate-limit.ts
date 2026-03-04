/**
 * Simple in-memory rate limiter for API routes
 * Note: In production with multiple instances, use Redis
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 60000); // Clean up every minute

export interface RateLimitConfig {
  limit: number;       // Max requests per window
  windowMs: number;    // Window size in milliseconds
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  '/api/ai/chat': { limit: 10, windowMs: 60000 },      // 10/min
  '/api/checkout': { limit: 5, windowMs: 60000 },       // 5/min
};

export function checkRateLimit(
  identifier: string, 
  path: string,
  customConfig?: RateLimitConfig
): RateLimitResult {
  const config = customConfig || DEFAULT_CONFIGS[path] || { limit: 30, windowMs: 60000 };
  const key = `${path}:${identifier}`;
  const now = Date.now();
  
  let entry = store.get(key);
  
  if (!entry || entry.resetAt < now) {
    // Create new window
    entry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    store.set(key, entry);
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetAt: entry.resetAt,
    };
  }
  
  if (entry.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }
  
  entry.count++;
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  };
}
