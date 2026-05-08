# Phase 06: Testing & Integration

## Overview

- **Priority:** P1
- **Status:** Pending
- **Effort:** 1h

End-to-end testing of gateway routing, JWT auth, and BE↔BE communication.

## Context Links

- All previous phases

## Test Scenarios

### 1. Gateway Routing Tests

| Test | Expected |
|------|----------|
| GET /api/users/123 with valid JWT | Returns 200, X-User-Id header forwarded |
| GET /api/wallet/balance with valid JWT | Returns 200, X-User-Id header forwarded |
| GET /api/users/123 without JWT | Returns 401 Unauthorized |
| GET /api/users/123 with invalid JWT | Returns 401 Unauthorized |
| GET /api/auth/login (public) | Returns 200, no auth required |
| GET /api/users/** with JWT wrong role | Depends on endpoint authorization |

### 2. Circuit Breaker Tests

| Test | Expected |
|------|----------|
| Call failing service 6/10 times | Circuit opens (60% > 50% threshold) |
| Subsequent calls after circuit open | Returns 503 fallback |
| Wait 30s in open state | Circuit half-open |
| Successful call in half-open | Circuit closes |

### 3. BE↔BE Communication Tests

| Test | Expected |
|------|----------|
| P2P transfer: call recipient check | Direct call to user-service succeeds |
| P2P transfer: insufficient balance | Error returned correctly |
| KYC approval: wallet activation | user-service calls wallet-service directly |
| Service down: getUserById | Timeout after 3s, error returned |

### 4. Load Balancing Tests (K8s)

| Test | Expected |
|------|----------|
| Multiple calls to lb://user-service | Distributed across pods |
| One pod down | Traffic routes to healthy pods |

## Integration Test Setup

```java
@SpringBootTest
class ApiGatewayIntegrationTest {
    @Autowired
    private WebTestClient webTestClient;

    @Test
    void shouldForwardToUserService() {
        webTestClient.get()
            .uri("/api/users/user-123")
            .header("Authorization", "Bearer " + validJwt)
            .exchange()
            .expectStatus().isOk()
            .expectHeader().exists("X-User-Id");
    }

    @Test
    void shouldRejectInvalidToken() {
        webTestClient.get()
            .uri("/api/users/user-123")
            .header("Authorization", "Bearer invalid-token")
            .exchange()
            .expectStatus().isUnauthorized();
    }
}
```

## Manual Testing Checklist

- [ ] Start user-service on 8081
- [ ] Start wallet-service on 8082
- [ ] Start api-gateway on 8080
- [ ] GET /api/users/test with JWT → 200 OK
- [ ] GET /api/users/test without JWT → 401
- [ ] POST /api/wallet/transfer with JWT → P2P works via direct call
- [ ] Stop wallet-service → fallback returns 503
- [ ] Restart wallet-service → circuit breaker closes

## Success Criteria

- All integration tests pass
- Manual testing checklist complete
- No gateway involvement in BE↔BE calls verified via logs
- Circuit breaker correctly trips and recovers

## Next Steps

- Update development-roadmap.md with completed work
- Update project-changelog.md with new features