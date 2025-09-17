interface RateLimit {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits = new Map<string, RateLimit>()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(key: string): boolean {
    const now = Date.now()
    const limit = this.limits.get(key)

    if (!limit || now > limit.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return true
    }

    if (limit.count >= this.maxRequests) {
      return false
    }

    limit.count++
    return true
  }

  getRemainingRequests(key: string): number {
    const limit = this.limits.get(key)
    if (!limit) return this.maxRequests

    return Math.max(0, this.maxRequests - limit.count)
  }

  getResetTime(key: string): number {
    const limit = this.limits.get(key)
    return limit?.resetTime || 0
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, limit] of this.limits.entries()) {
      if (now > limit.resetTime) {
        this.limits.delete(key)
      }
    }
  }
}

// Create rate limiters for different actions
export const voteRateLimit = new RateLimiter(20, 60000) // 20 votes per minute
export const productSubmissionRateLimit = new RateLimiter(5, 300000) // 5 products per 5 minutes
export const generalRateLimit = new RateLimiter(100, 60000) // 100 requests per minute

// Cleanup function to be called periodically
export function cleanupRateLimits() {
  voteRateLimit.cleanup()
  productSubmissionRateLimit.cleanup()
  generalRateLimit.cleanup()
}

// Set up automatic cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000)
}