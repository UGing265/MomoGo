# Phase 03: Implement JWT Filter

## Overview

- **Priority:** P1
- **Status:** Completed
- **Effort:** 2h

Implement JWT validation filter at gateway level. Extract user ID and add to X-User-Id header for downstream services.

## Context Links

- [Phase 02](./phase-02-configure-routes-load-balancing.md)

## Requirements

| Requirement | Description |
|-------------|-------------|
| Validate JWT | All requests except /api/auth/** |
| Extract user ID | From JWT subject claim |
| Forward user ID | Add X-User-Id header to downstream |
| Handle roles | Add X-User-Role header |
| Public endpoints | /api/auth/**, /actuator/**, /health |

## JWT Structure

```json
{
  "sub": "user-uuid-123",
  "role": "USER",
  "iat": 1715200000,
  "exp": 1715286400
}
```

## Implementation Steps

### 1. Create JwtService

```java
@Service
public class JwtService {
    private final String secretKey;

    public Claims getClaims(String token) {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
```

### 2. Create JwtAuthenticationFilter

```java
@Component
public class JwtAuthenticationFilter implements WebFilter {
    private final JwtService jwtService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().value();

        // Skip auth for public paths
        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        if (!jwtService.validateToken(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        Claims claims = jwtService.getClaims(token);
        String userId = claims.getSubject();
        String role = claims.get("role", String.class);

        // Add headers for downstream services
        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
            .header("X-User-Id", userId)
            .header("X-User-Role", role != null ? role : "USER")
            .build();

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    private boolean isPublicPath(String path) {
        return path.startsWith("/api/auth/")
            || path.startsWith("/actuator/")
            || path.equals("/health");
    }
}
```

### 3. Configure Security

```java
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http,
            JwtAuthenticationFilter jwtFilter) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
            .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/api/auth/**", "/actuator/**", "/health").permitAll()
                .anyExchange().authenticated()
            )
            .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
            .build();
    }
}
```

### 4. Application Config

```yaml
# In application.yml
jwt:
  secret: ${JWT_SECRET:your-256-bit-secret-key-for-development-only}
```

## Todo List

- [ ] Create JwtService class
- [ ] Create JwtAuthenticationFilter
- [ ] Create SecurityConfig
- [ ] Add jwt.secret to application.yml
- [ ] Test JWT validation flow
- [ ] Test X-User-Id header forwarded correctly

## Success Criteria

- Valid JWT → request passes, X-User-Id header added
- Invalid JWT → 401 Unauthorized
- Missing JWT on protected route → 401 Unauthorized
- Public routes (/api/auth/**) → no auth required

## Next Steps

Phase 04: Add rate limiting and circuit breaker