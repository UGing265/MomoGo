---
title: "OpenAPI/Swagger Documentation for Spring Boot Services"
description: "Add OpenAPI/Swagger documentation to user-service, wallet-service, and api-gateway"
status: in_progress
priority: P2
effort: 6h
branch: feat/be/gateway-spring-cloud
tags: [swagger, openapi, documentation, spring-boot]
created: 2026-05-10
last_updated: 2026-05-11
---

# OpenAPI/Swagger Documentation Implementation Plan

## Overview

Add OpenAPI 3.0 documentation via springdoc-openapi to 3 Spring Boot services in MomoGo project.

## Services Summary

| Service | Port | Type | OpenAPI Approach |
|---------|------|------|------------------|
| user-service | 8081 | webmvc | springdoc-openapi-starter-webmvc-ui:3.0.3 |
| wallet-service | 8082 | webmvc | springdoc-openapi-starter-webmvc-ui:3.0.3 |
| api-gateway | 8080 | webflux | springdoc-openapi-starter-webflux:2.7.0 |

## Phases

| Phase | File | Status | Effort |
|-------|------|--------|--------|
| 1 | phase-01-swagger-user-service.md | pending | 2h |
| 2 | phase-02-swagger-wallet-service.md | pending | 2h |
| 3 | phase-03-swagger-api-gateway.md | pending | 2h |

## Key Insights

- **user/wallet services**: Standard springdoc-starter, auto-generates from Spring components
- **api-gateway (webflux)**: springdoc-webflux is deprecated; use springdoc-openapi-starter-webflux:2.7.0
- All services use JWT authentication; SecurityConfig must permit OpenAPI endpoints
- GroupedOpenApi beans allow separate doc groups per service

## Dependencies to Add

**user-service & wallet-service (pom.xml):**
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>3.0.3</version>
</dependency>
```

**api-gateway (pom.xml):**
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webflux</artifactId>
    <version>2.7.0</version>
</dependency>
```

## Security Pattern (All Services)

```
/v3/api-docs/**     → permit all (API spec access)
/swagger-ui/**      → permit all (UI access)
/swagger-ui.html    → permit all (legacy redirect)
```

## Success Criteria

- [ ] All 3 services expose OpenAPI JSON at `/v3/api-docs/{group}`
- [ ] Swagger UI available at `/swagger-ui.html` for each service
- [ ] JWT security scheme documented in OpenAPI specs
- [ ] No compile errors after dependency addition
- [ ] Services start successfully with OpenAPI endpoints accessible

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| api-gateway webflux compatibility | Medium | Use webflux-compatible version 2.7.0 |
| Security config conflict | Medium | Test permit list before deployment |
| springdoc version conflict | Low | Use Boot managed version where possible |

## Validation Log

### Session 1 — 2026-05-10
**Trigger:** Initial plan creation - validate approach before implementation
**Questions asked:** 2

#### Questions & Answers

1. **[Scope]** user-service and wallet-service have NO REST controllers yet - only entities, repositories, and REST clients. Should I add placeholder controllers for the OpenAPI docs to document, or skip adding OpenAPI until actual controllers exist?
   - Options: Add springdoc + placeholder controllers | **Add springdoc only, wait for controllers (Selected)**
   - **Answer:** Add springdoc only, wait for controllers
   - **Rationale:** YAGNI - placeholder controllers add dead code that will be replaced when real controllers are implemented. springdoc dependency alone is sufficient to verify integration works.

2. **[Architecture]** For API Gateway, should it aggregate OpenAPI docs from downstream services (user-service/wallet-service) or just document its own routing layer?
   - Options: Document gateway routes only | **Document gateway routes only (Recommended) (Selected)**
   - **Answer:** Document gateway routes only
   - **Rationale:** Aggregation adds complexity and runtime dependency on downstream services being available. Simple routing docs are sufficient for API reference.

#### Confirmed Decisions
- user/wallet services: Add springdoc dependency + config only (no placeholder controllers)
- API Gateway: Document gateway routes only, no spec aggregation

#### Action Items
- [ ] Phase 1: Remove placeholder controller creation from implementation steps
- [ ] Phase 2: Remove placeholder controller creation from implementation steps
- [ ] Phase 3: Remove aggregation-related steps, focus on routing docs only

#### Impact on Phases
- Phase 1: Remove step 4 (Add OpenAPI annotations to existing controllers) - no controllers exist yet
- Phase 2: Remove step 4 (Add OpenAPI annotations to existing controllers) - no controllers exist yet
- Phase 3: Simplify - remove any aggregation logic, document routes manually via OpenAPI bean

## Next Steps

1. Execute Phase 1 (user-service) - springdoc dependency + config only
2. Execute Phase 2 (wallet-service) - springdoc dependency + config only
3. Execute Phase 3 (api-gateway) - springdoc-webflux + manual route docs
4. Update project documentation