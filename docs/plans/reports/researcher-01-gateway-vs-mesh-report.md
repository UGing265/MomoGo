# Research Report: API Gateway vs Service Mesh Architecture

**Topic:** API Gateway vs Service Mesh for Java Spring Boot Microservices (MomoGo)
**Date:** 2026-05-09
**Author:** researcher agent

---

## 1. Architecture Overview

### API Gateway Pattern

Single entry point for all client requests. Routes requests to appropriate microservice. Handles cross-cutting concerns at the boundary.

```
Client → [API Gateway] → user-service
                        → wallet-service
```

### Service Mesh Pattern

Infrastructure layer that handles service-to-service communication. Proxy sidecar runs alongside each service instance. Distributed intelligence.

```
Client → [Sidecar Proxy] → user-service
                          → wallet-service
        [Service Discovery / Control Plane]
```

---

## 2. Gateway Failure Scenarios

### API Gateway Failure

| Scenario | Impact | Mitigation |
|----------|--------|------------|
| Gateway goes down | **Total system outage** - no requests reach services | Deploy gateway in HA mode (2+ replicas) with load balancer |
| Gateway crash | Requests queue/timeout | Health checks + auto-restart (Kubernetes) |
| Gateway overload | Latency spikes, dropped connections | Rate limiting, circuit breaker on gateway |
| Single AZ failure | Potential total outage if no multi-AZ | Multi-AZ deployment mandatory |

**Recovery Pattern:**
```
Kubernetes L4 LB → Gateway Pod 1
                → Gateway Pod 2 (hot standby)
                → Gateway Pod 3 (hot standby)
```

### Service Mesh Failure

| Scenario | Impact | Mitigation |
|----------|--------|------------|
| Sidecar dies | Single service instance down, traffic rerouted | Kubernetes auto-restarts, other pods unaffected |
| Control plane dies | Service-to-service communication continues (data plane autonomous) | New connections affected; existing connections persist |
| Too many sidecars | Resource overhead | Per-host proxy option (Envoy agent mode) |
| Network partition | Services can still communicate within mesh | Service mesh designed for this |

**Recovery Pattern:**
```
Pod A (service + sidecar) ↔ Pod B (service + sidecar)
                           ↔ Pod C (service + sidecar)
Mesh control plane restart →不影响 existing traffic
```

**Key Difference:** Service mesh failure is localized; API gateway failure is system-wide.

---

## 3. Fault Tolerance Patterns

### Circuit Breaker

**API Gateway (Spring Cloud Gateway):**
```java
// Spring Cloud Gateway with Resilience4j
@Bean
public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("wallet-service", r -> r
            .path("/api/wallet/**")
            .filters(f -> f
                .circuitBreaker(config -> config
                    .setName("walletCircuit")
                    .setFallbackUri("forward:/fallback/wallet")))
            .uri("lb://wallet-service"))
        .build();
}
```

**Service Mesh (Istio):**
```yaml
# Istio DestinationRule with circuit breaker
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: wallet-service
spec:
  host: wallet-service
  trafficPolicy:
    outlierDetection:
      consecutiveGatewayErrors: 5
      interval: 30s
      baseEjectionTime: 30s
```

### Load Balancing

| Pattern | API Gateway | Service Mesh |
|---------|------------|--------------|
| Round Robin | `spring.cloud.loadbalancer.ribbon.enabled=true` | Built-in (Envoy) |
| Weighted | Route rules | `VirtualService` weight |
| Session | Cookie-based sticky | `DestinationRule` subset |
| Least Request | Ribbon `ILoadBalancer` | Envoy `LEAST_REQUEST` |

### Fallback Patterns

**API Gateway Fallback:**
```yaml
# Spring Cloud Gateway fallback config
spring:
  cloud:
    gateway:
      routes:
        - id: wallet-service
          uri: lb://wallet-service
          filters:
            - name: CircuitBreaker
              args:
                fallbackUri: forward:/fallback/wallet
```

**Service Mesh Fallback:**
```yaml
# Istio - mirrors traffic to fallback service
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: wallet-service
spec:
  hosts:
  - wallet-service
  http:
  - route:
    - destination:
        host: wallet-service
        subset: v1
      weight: 70
    - destination:
        host: wallet-service-v2
        subset: fallback
      weight: 30
```

---

## 4. Cloud-Native Java Options Comparison

### Spring Cloud Gateway

| Aspect | Details |
|--------|---------|
| **Type** | API Gateway |
| **Pros** | Native Java/Spring, reactive (WebFlux), simple config, integrated with Spring Cloud |
| **Cons** | Single point of failure if not HA, limited to HTTP/WebSocket |
| **Circuit Breaker** | Resilience4j via `spring-cloud-starter-circuitbreaker-reactor-resilience4j` |
| **Rate Limiting** | Redis-based via `spring-cloud-gateway-starter` + `redisson` |
| **Best For** | Spring Boot microservices, teams already in Spring ecosystem |

### Apache APISIX

| Aspect | Details |
|--------|---------|
| **Type** | API Gateway (cloud-native) |
| **Pros** | High performance (Lua, Nginx), hot reload, rich plugins, multi-language support |
| **Cons** | Separate management plane, less Java-native integration |
| **Circuit Breaker** | Built-in `api-mirror` + `proxy-cache` |
| **Rate Limiting** | Built-in (counter, token bucket, sliding window) |
| **Best For** | High-throughput requirements, multi-cloud deployments |

### Kong

| Aspect | Details |
|--------|---------|
| **Type** | API Gateway |
| **Pros** | Mature ecosystem, declarative config, database (Postgres) or DB-less mode |
| **Cons** | Database dependency (if using Postgres mode), heavier resource footprint |
| **Circuit Breaker** | Plugin: `circuit-breaker` |
| **Rate Limiting** | Built-in + premium plugins |
| **Best For** | Teams needing admin dashboard, declarative config as code |

### Istio (Service Mesh)

| Aspect | Details |
|--------|---------|
| **Type** | Service Mesh |
| **Pros** | Sidecar proxy per pod, mTLS, traffic management, observability built-in |
| **Cons** | Complexity overhead, resource intensive (sidecar = ~50MB RAM/pod), steep learning curve |
| **Circuit Breaker** | `DestinationRule.outlierDetection` |
| **Rate Limiting** | `EnvoyFilter` or rate limit service |
| **Best For** | Large fleets, teams with dedicated DevOps, security-critical services |

### Linkerd (Service Mesh)

| Aspect | Details |
|--------|---------|
| **Type** | Service Mesh (simpler than Istio) |
| **Pros** | Lightweight (~10MB RAM), Kubernetes-native, simpler than Istio |
| **Cons** | Limited feature set, Rust-based control plane |
| **Circuit Breaker** | Via Envoy |
| **Best For** | Teams wanting service mesh benefits without Istio complexity |

### Comparison Matrix

| Criteria | Spring Cloud Gateway | Apache APISIX | Kong | Istio | Linkerd |
|----------|---------------------|--------------|------|-------|---------|
| **Complexity** | Low | Medium | Medium | High | Medium |
| **Java Integration** | Native | Good | Good | Good | Good |
| **Resource Overhead** | Low | Low | Medium | High (~50MB/pod) | Low (~10MB/pod) |
| **Circuit Breaker** | Yes (Resilience4j) | Yes | Yes | Yes | Yes |
| **mTLS** | No (external) | No | No | Yes (built-in) | Yes (built-in) |
| **Rate Limiting** | Redis | Built-in | Built-in | Via extension | Via extension |
| **Learning Curve** | Easy | Medium | Medium | Steep | Medium |
| **Ops Burden** | Low | Low | Medium | High | Medium |

---

## 5. Recommendations for Small Team (2-4 Devs)

### Decision Matrix

| Factor | Recommendation |
|--------|----------------|
| **Team Size** | 2-4 devs = API Gateway (lower ops burden) |
| **Project Phase** | MVP/early stage = API Gateway |
| **Security Requirements** | mTLS required = Service Mesh (Istio) |
| **Throughput** | >10K TPS = APISIX or custom gateway scaling |
| **Complexity Tolerance** | Low = Spring Cloud Gateway |

### Recommendation: **Spring Cloud Gateway (Initial) → Istio (When Ready)**

**Rationale for MomoGo:**
1. MomoGo is MVP stage with 2 services (user-service, wallet-service)
2. Small team (2-4 devs) cannot afford service mesh ops overhead
3. Spring Cloud Gateway integrates natively with Spring Boot services
4. Fallback/fault tolerance achievable with Resilience4j
5. Gateway failure handled via Kubernetes HA (multiple replicas + LB)

### Implementation Checklist for Spring Cloud Gateway

```
1. Deploy Spring Cloud Gateway with 2+ replicas (Kubernetes Deployment)
2. Configure Resilience4j circuit breaker for each upstream service
3. Set up Redis-based rate limiting
4. Add health check endpoint (/health)
5. Configure Kubernetes HPA (Horizontal Pod Autoscaler)
6. Set up Gateway pod disruption budget (PDB) for availability
```

### When to Consider Service Mesh

Consider transitioning to Istio when:
- Service count grows to 5+ microservices
- Team has dedicated DevOps/Platform engineer
- mTLS between services becomes mandatory
- Advanced traffic management needed (canary releases, mirroring)
- Observability requirements increase

---

## 6. MomoGo-Specific Architecture

### Current Design (per ERD and phase-04 research)
```
Frontend → [API Gateway] → user-service (port 8081)
                            → wallet-service (port 8082)
         [Redis] (rate limiting)
```

### Recommended Fault Tolerance Setup

```yaml
# Kubernetes Deployment for Gateway
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3  # Minimum for HA
  template:
    spec:
      containers:
        - name: gateway
          image: momogo/api-gateway:latest
          resources:
            requests:
              memory: "256Mi"
              cpu: "200m"
            limits:
              memory: "512Mi"
              cpu: "500m"
---
# Pod Disruption Budget
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: gateway-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api-gateway
```

### Resilience4j Configuration

```yaml
# application.yml for Spring Cloud Gateway
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - name: CircuitBreaker
              args:
                name: userServiceCircuit
                fallbackUri: forward:/fallback/user
        - id: wallet-service
          uri: lb://wallet-service
          predicates:
            - Path=/api/wallet/**
          filters:
            - name: CircuitBreaker
              args:
                name: walletServiceCircuit
                fallbackUri: forward:/fallback/wallet

resilience4j:
  circuitbreaker:
    configs:
      default:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
        permittedNumberOfCallsInHalfOpenState: 5
        slowCallDurationThreshold: 2s
        slowCallRateThreshold: 100
```

---

## 7. Unresolved Questions

1. **Will MomoGo need mTLS between services?** - If yes, consider Istio at later stage
2. **Expected TPS for MVP?** - Determines if Spring Cloud Gateway is sufficient or need APISIX
3. **Is there dedicated DevOps resource?** - If not, service mesh may be too heavy
4. **Kubernetes version in use?** - Some service mesh features require K8s 1.21+

---

## Sources

- [Spring Cloud Gateway Documentation](https://spring.io/projects/spring-cloud-gateway)
- [Resilience4j Circuit Breaker](https://resilience4j.readme.io/docs/circuitbreaker)
- [Istio Documentation](https://istio.io/latest/docs/)
- [Apache APISIX Documentation](https://apisix.apache.org/docs/)
- [Kong Documentation](https://docs.konghq.com/)
- [Linkerd Documentation](https://linkerd.io/2/overview/)
