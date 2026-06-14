import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const submissionRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: false,
  prefix: 'simba:submission',
})

export const loginRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(5, '15 m'),
  analytics: false,
  prefix: 'simba:login',
})