import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter: Ratelimit | null = null;
let attempted = false;

function getLimiter(): Ratelimit | null {
  if (attempted) return limiter;
  attempted = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const redis = new Redis({ url, token });
  limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 d"),
    analytics: true,
    prefix: "unvague",
  });
  return limiter;
}

export async function rateLimit(
  key: string,
  _limitPerDay: number,
): Promise<{ success: boolean; reset?: number }> {
  const l = getLimiter();
  if (!l) return { success: true };
  const r = await l.limit(key);
  return { success: r.success, reset: r.reset };
}
