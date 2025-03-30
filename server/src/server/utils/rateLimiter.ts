import type NodeCache from 'node-cache';

interface RateLimitInfo {
  count: number;
  firstAttempt: number;
}

const RATE_LIMIT_PREFIX = 'rateLimit:login:';

export function checkRateLimit(cache: NodeCache, ip: string, maxAttempts = 5, windowMinutes = 10): boolean {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const cacheKey = `${RATE_LIMIT_PREFIX}${ip}`;

  // Get current rate limit info for this IP
  const info = cache.get<RateLimitInfo>(cacheKey) || { count: 0, firstAttempt: now };

  // Reset if window has expired
  if (now - info.firstAttempt > windowMs) {
    info.count = 1;
    info.firstAttempt = now;
    cache.set(cacheKey, info, windowMinutes * 60); // Set TTL to match window
    return true;
  }

  // Increment attempt count
  info.count += 1;
  cache.set(cacheKey, info, windowMinutes * 60);

  // Check if rate limit exceeded
  return info.count <= maxAttempts;
}

export function resetRateLimit(cache: NodeCache, ip: string): void {
  cache.del(`${RATE_LIMIT_PREFIX}${ip}`);
}
