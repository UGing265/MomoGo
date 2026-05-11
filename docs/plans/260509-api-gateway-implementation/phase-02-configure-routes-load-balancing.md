# Phase 02: Configure Routes & Load Balancing

## Overview

- **Priority:** P1
- **Status:** Completed
- **Effort:** 1h

Configure Spring Cloud Gateway routes with `lb://` prefix for load balancing and proper path predicates.

## Context Links

- [Phase 01](./phase-01-setup-gateway-dependencies.md)
- [Current application.yml](../../../backend/api-gateway/src/main/resources/application.yml)

## Current State

```yaml
routes:
  - id: user-service
    uri: http://localhost:8081  # Static URL
    predicates:
      - Path=/api/users/**
  - id: wallet-service
    uri: http://localhost:8082  # Static URL
    predicates:
      - Path=/api/wallet/**
```

## Target Configuration

```yaml
server:
  port: 8080

spring:
  application:
    name: api-gateway

  cloud:
    gateway:
      # Load balancing config
      loadbalancer:
        cache:
          enabled: true
          ttl: 60s

      # Routes
      routes:
        - id: user-service
          uri: lb://user-service  # Load balanced
          predicates:
            - Path=/api/users/**
          filters:
            - name: CircuitBreaker
              args:
                name: userServiceCircuitBreaker
                fallbackUri: forward:/fallback/user-service

        - id: wallet-service
          uri: lb://wallet-service  # Load balanced
          predicates:
            - Path=/api/wallet/**
          filters:
            - name: CircuitBreaker
              args:
                name: walletServiceCircuitBreaker
                fallbackUri: forward:/fallback/wallet-service

      # CORS
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins:
              - "http://localhost:3000"  # Frontend dev
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders:
              - "*"
            allowCredentials: true
      default-filters:
        - StripPrefix=0
```

## Service Name Config (user-service)

In `user-service/src/main/resources/application.yml`:
```yaml
spring:
  application:
    name: user-service
```

In `wallet-service/src/main/resources/application.yml`:
```yaml
spring:
  application:
    name: wallet-service
```

## Fallback Endpoint

Create simple fallback controller:
```java
@RestController
public class FallbackController {
    @GetMapping("/fallback/{service}")
    public Map<String, Object> fallback(@PathVariable String service) {
        return Map.of(
            "error", "Service temporarily unavailable",
            "service", service,
            "timestamp", Instant.now().toString()
        );
    }
}
```

## Todo List

- [ ] Update application.yml with lb:// routes
- [ ] Add CORS configuration
- [ ] Add circuit breaker filters
- [ ] Set spring.application.name in user-service
- [ ] Set spring.application.name in wallet-service
- [ ] Create FallbackController
- [ ] Test gateway routes

## Success Criteria

- Gateway starts on port 8080
- Routes correctly forward to user-service:8081 and wallet-service:8082
- CORS headers present for localhost:3000
- Fallback returns 503 when service is down

## Next Steps

Phase 03: Implement JWT filter for authentication