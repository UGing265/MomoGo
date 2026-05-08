---
title: "API Gateway Implementation Plan"
description: "Implement Spring Cloud Gateway with JWT auth, rate limiting, and BE↔BE direct communication for MomoGo microservices"
status: pending
priority: P1
effort: 8h
branch: feat/be/services-for-entities-sql
tags: [backend, api-gateway, microservices, security]
created: 2026-05-09
---

# API Gateway Implementation Plan

## Overview

Implement Spring Cloud Gateway (8080) as single entry point for frontend clients. Backend services (user-service, wallet-service) communicate directly via REST for internal calls.

## Architecture Decision

| Pattern | Choice | Rationale |
|---------|--------|-----------|
| Gateway | Spring Cloud Gateway | Java-native, reactive, low complexity |
| External routing | Via Gateway | JWT validation, rate limiting, CORS |
| BE↔BE | Direct invoke | Lower latency (1 hop), no SPOF, simpler |
| Load balancing | Spring Cloud LoadBalancer (`lb://`) | K8s DNS native |

## Phases

| # | Phase | Status | Effort | Link |
|---|-------|--------|--------|------|
| 1 | Setup Gateway Dependencies | Pending | 1h | [phase-01](./phase-01-setup-gateway-dependencies.md) |
| 2 | Configure Routes & Load Balancing | Pending | 1h | [phase-02](./phase-02-configure-routes-load-balancing.md) |
| 3 | Implement JWT Filter | Pending | 2h | [phase-03](./phase-03-implement-jwt-filter.md) |
| 4 | Add Rate Limiting & Circuit Breaker | Pending | 1.5h | [phase-04](./phase-04-add-rate-limiting-circuit-breaker.md) |
| 5 | Implement BE↔BE Direct Communication | Pending | 1.5h | [phase-05](./phase-05-implement-be-to-be-communication.md) |
| 6 | Testing & Integration | Pending | 1h | [phase-06](./phase-06-testing-integration.md) |

## Key Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `backend/api-gateway/pom.xml` | Modify | Add dependencies |
| `backend/api-gateway/src/main/resources/application.yml` | Modify | Routes, filters, LB config |
| `backend/api-gateway/src/main/java/com/momogo/api/gateway/` | Create | JWT filter, security config |
| `backend/user-service/src/main/resources/application.yml` | Modify | Service name |
| `backend/wallet-service/src/main/resources/application.yml` | Modify | Service name |

## Dependencies

- Spring Cloud LoadBalancer
- Spring Security (WebFlux)
- Redis (rate limiting)
- Resilience4j (circuit breaker)
- JJWT (JWT validation)

## Risks

| Risk | Mitigation |
|------|------------|
| JWT filter performance | Use efficient JWT parsing, cache public keys |
| Rate limiting Redis dependency | Make rate limiting optional for MVP |
| Service discovery | Start with static URLs, migrate to `lb://` later |