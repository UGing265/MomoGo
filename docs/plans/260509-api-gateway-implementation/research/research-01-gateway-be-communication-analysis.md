# API Gateway & BE↔BE Communication Research & Analysis

**Project:** MomoGo Digital Wallet Platform
**Date:** 2026-05-09
**Focus:** API Gateway architecture + BE↔BE communication patterns

---

## 1. Decision: API Gateway Choice

### Chosen: Spring Cloud Gateway

**Rationale:**
- Java/Spring-native → team already knows Spring Boot
- Reactive (WebFlux) → handles high concurrency
- Low complexity vs Kong/Istio
- Current codebase already has basic setup

### Gateway Responsibilities (What it DOES)

| Responsibility | Description |
|----------------|-------------|
| **External Routing** | Route client requests (FE → BE) to appropriate service |
| **JWT Validation** | Validate tokens, extract user ID, add `X-User-Id` header |
| **Rate Limiting** | Redis-based per-user rate limits |
| **Circuit Breaker** | Resilience4j for fault tolerance |
| **CORS** | Handle cross-origin for FE |
| **Load Balancing** | `lb://` prefix for service discovery |

### Gateway Responsibilities (What it DOES NOT)

| Responsibility | Reason |
|----------------|--------|
| **BE↔BE Routing** | Adds latency, single point of failure for internal calls |
| **Service-to-service orchestration** | Services should call each other directly |

---

## 2. Decision: BE↔BE Communication Pattern

### Chosen: Direct Invoke (NOT via Gateway)

```
┌─────────────┐         ┌──────────────┐
│user-service │◄───────►│wallet-service│
│   (8081)    │  direct  │    (8082)    │
└─────────────┘   REST   └──────────────┘
```

### Comparison: Direct vs Gateway Routing

| Factor | Direct Invoke | Via Gateway |
|--------|--------------|-------------|
| **Latency** | 1 hop | 2 hops |
| **Single Point of Failure** | None | Gateway dies = P2P fails |
| **Complexity** | Services know each other | Services stay dumb |
| **Monitoring** | Per-service logs | Centralized (but adds complexity) |
| **Load** | Distributed | Gateway bottleneck |
| **Use case** | Internal trusted traffic | External client traffic |

### Why Direct Invoke Wins for MomoGo

1. **Resilience** — If gateway dies, external clients can't reach services. Internal P2P transfers should still work between services
2. **Latency** — P2P transfer: user-service → gateway → wallet-service (2 hops) vs direct (1 hop)
3. **Scale** — Gateway handles external traffic load; BE↔BE adds unnecessary burden
4. **Simplicity** — For 2 services, direct calls are trivial to debug
5. **YAGNI** — Service mesh/gateway routing for BE↔BE adds complexity we don't need yet

### When Gateway Routing Would Be Better

- 5+ services requiring centralized routing logic
- Need centralized audit logging of ALL inter-service calls
- Canary deployments with traffic splitting
- Dedicated platform/DevOps team

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTS                              │
│                   (Mobile App / Web FE)                      │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (8080)                        │
│  - JWT Validation                                            │
│  - Rate Limiting (Redis)                                     │
│  - Circuit Breaker (Resilience4j)                            │
│  - Load Balancing (lb://)                                   │
│  - CORS                                                      │
└────────┬────────────────────────────────────┬───────────────┘
         │                                    │
         │ X-User-Id header                  │ X-User-Id header
         ▼                                    ▼
┌──────────────────┐              ┌──────────────────────────┐
│  user-service    │              │     wallet-service       │
│    (8081)         │◄────────────►│        (8082)             │
│                  │   DIRECT     │                          │
│ - User CRUD      │   REST       │ - Wallet operations      │
│ - KYC            │   (WebClient/│ - P2P Transfer            │
│ - Bank linking   │   RestTemplate)│ - QR codes             │
└──────────────────┘              └──────────────────────────┘
```

### Traffic Flow Summary

| Traffic Type | Path | Via Gateway? |
|--------------|------|--------------|
| FE → user-service | Client → Gateway → user-service | ✅ Yes |
| FE → wallet-service | Client → Gateway → wallet-service | ✅ Yes |
| user-service → wallet-service (P2P) | user-service → wallet-service | ❌ No |
| wallet-service → user-service (balance check) | wallet-service → user-service | ❌ No |

---

## 4. Implementation Requirements

### API Gateway Dependencies Needed

```xml
<!-- Already present -->
spring-cloud-starter-gateway-server-webflux

<!-- Need to add -->
spring-cloud-starter-loadbalancer        # For lb:// routing
spring-boot-starter-data-redis-reactive   # Rate limiting
spring-boot-starter-security             # JWT filter
io.jsonwebtoken:jjwt-api                  # JWT validation
resilience4j-spring-boot3                  # Circuit breaker
```

### BE↔BE Communication

```java
// Pattern: RestTemplate with @LoadBalanced (simpler, blocking)
// OR WebClient (reactive, better performance)

@Service
public class WalletServiceClient {
    private final RestTemplate restTemplate;

    public WalletResponse checkUserBalance(String userId) {
        // Direct call - no gateway in path
        return restTemplate.getForObject(
            "http://user-service:8081/api/users/{id}/balance",
            WalletResponse.class,
            userId
        );
    }
}
```

### JWT Forwarding

```
1. Client sends: Authorization: Bearer <jwt>
2. Gateway validates JWT
3. Gateway adds: X-User-Id: <user_id> header
4. Downstream services use X-User-Id header (trust gateway)
```

---

## 5. Why This Architecture is Production-Ready

| Requirement | How Addressed |
|-------------|---------------|
| **Fault Tolerance** | 3+ gateway replicas + Resilience4j circuit breaker |
| **Scalability** | Horizontal scaling via Kubernetes |
| **Security** | JWT at gateway, X-User-Id trust boundary |
| **Performance** | Direct BE↔BE = lowest latency |
| **Simplicity** | YAGNI - only add what we need |

---

## 6. Unresolved Questions

1. **Kubernetes deployment?** If yes, use `lb://` with Kubernetes DNS. If no, use static URLs or Eureka
2. **Redis available?** Needed for rate limiting (can skip for MVP)
3. **JWT secret management?** HashiCorp Vault, AWS Secrets Manager, or K8s secrets for production
4. **Service mesh later?** When to consider Istio/Linkerd (5+ services, dedicated DevOps)

---

## 7. Summary

| Decision | Choice | Reason |
|----------|--------|--------|
| Gateway type | Spring Cloud Gateway | Java-native, low complexity |
| External routing | Via Gateway | Centralized auth, rate limiting |
| BE↔BE pattern | Direct invoke | Lower latency, no SPOF, simpler |
| Load balancing | Spring Cloud LoadBalancer | Native K8s DNS integration |
| JWT handling | Gateway validates, X-User-Id forwarded | Trust boundary at gateway |

**Total effort estimate:** 6-8 hours for MVP implementation