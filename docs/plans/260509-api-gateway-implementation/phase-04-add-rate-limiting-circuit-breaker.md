# Phase 04: Add Rate Limiting & Circuit Breaker

## Overview

- **Priority:** P2
- **Status:** Completed
- **Effort:** 1.5h

Add Redis-based rate limiting and Resilience4j circuit breaker for fault tolerance.

## Context Links

- [Phase 03](./phase-03-implement-jwt-filter.md)

## Rate Limiting

### Why Redis?

- Reactive Redis client works with WebFlux gateway
- Distributed rate limiting across multiple gateway instances
- Token bucket algorithm via Spring Cloud Gateway

### Configuration

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379

  cloud:
    gateway:
      default-filters:
        - name: RequestRateLimiter
          args:
            redis-rate-limiter.replenishRate: 100      # requests per second
            redis-rate-limiter.burstCapacity: 200     # max burst
            redis-rate-limiter.requestedTooManyTemplate:
              "/fallback/rate-limited"
```

### Route-Level Rate Limiting

```yaml
routes:
  - id: wallet-service
    uri: lb://wallet-service
    predicates:
      - Path=/api/wallet/**
    filters:
      - name: RequestRateLimiter
        args:
          redis-rate-limiter.replenishRate: 50   # Stricter for wallet
          redis-rate-limiter.burstCapacity: 100
```

## Circuit Breaker

### Resilience4j Config

```yaml
resilience4j:
  circuitbreaker:
    instances:
      userServiceCircuitBreaker:
        failureRateThreshold: 50
        slidingWindowSize: 10
        waitDurationInOpenState: 30s
        permittedNumberOfCallsInHalfOpenState: 3
        slidingWindowType: COUNT_BASED

      walletServiceCircuitBreaker:
        failureRateThreshold: 50
        slidingWindowSize: 10
        waitDurationInOpenState: 30s
        permittedNumberOfCallsInHalfOpenState: 3
        slidingWindowType: COUNT_BASED

  timelimiter:
    instances:
      userServiceCircuitBreaker:
        timeoutDuration: 3s
        cancelRunningFuture: true
```

### Fallback Response

```java
@RestController
public class FallbackController {

    @GetMapping("/fallback/{service}")
    public ResponseEntity<Map<String, Object>> fallback(
            @PathVariable String service,
            Exception e) {
        return ResponseEntity
            .status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(Map.of(
                "error", "Service temporarily unavailable",
                "service", service,
                "message", e.getMessage(),
                "timestamp", Instant.now().toString()
            ));
    }

    @GetMapping("/fallback/rate-limited")
    public ResponseEntity<Map<String, Object>> rateLimited() {
        return ResponseEntity
            .status(HttpStatus.TOO_MANY_REQUESTS)
            .body(Map.of(
                "error", "Rate limit exceeded",
                "retryAfter", 60,
                "timestamp", Instant.now().toString()
            ));
    }
}
```

## Optional for MVP

Rate limiting requires Redis. For MVP without Redis:

```yaml
# Skip rate limiter, rely on circuit breaker only
spring:
  cloud:
    gateway:
      default-filters: []  # No rate limiting
```

## Todo List

- [ ] Add Redis config to application.yml (if available)
- [ ] Add Resilience4j config to application.yml
- [ ] Create FallbackController with rate-limited handler
- [ ] Test circuit breaker opens on service failure
- [ ] Test fallback returns 503
- [ ] (Optional) Test rate limiting with Redis

## Success Criteria

- Circuit breaker trips after 50% failures in 10 calls
- Fallback returns 503 when circuit is open
- Rate limiting returns 429 when exceeded (with Redis)

## Next Steps

Phase 05: Implement BE↔BE direct communication