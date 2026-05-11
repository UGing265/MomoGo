# Phase 03: Swagger Documentation for api-gateway

## Context Links

- Research: `research/researcher-02-gateway-swagger-report.md`
- Plan: `plan.md`
- Phase 1: `phase-01-swagger-user-service.md` (reference pattern)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-05-10 |
| Description | Add OpenAPI/Swagger UI to api-gateway (port 8080) |
| Priority | P2 |
| Status | pending |
| Effort | 2h |

## Key Insights

- **webflux** service requires different springdoc artifact
- Use `springdoc-openapi-starter-webflux:2.7.0` (NOT the 3.x series which is webmvc-only)
- springdoc-openapi-starter-webflux:3.0.x does not exist (webflux support discontinued)
- Route definitions in application.yml serve as OpenAPI path source
- Gateway routes to backend services; OpenAPI documents gateway routes, not proxied endpoints

## Requirements

### Functional
- Expose OpenAPI JSON spec at `/v3/api-docs/gateway`
- Swagger UI at `/swagger-ui.html`
- Document JWT Bearer auth scheme
- Document gateway routes (/api/users/**, /api/wallet/**)

### Non-Functional
- No breaking changes to existing routing
- Minimal code addition (< 100 lines)
- Compile cleanly

## Architecture

### File Changes

| Action | File |
|--------|------|
| MODIFY | `api-gateway/pom.xml` |
| CREATE | `api-gateway/src/main/java/com/momogo/api/gateway/config/OpenApiConfig.java` |

### WebFlux OpenApiConfig Differences

```java
@Configuration
public class OpenApiConfig {
    // GroupedOpenApi for gateway ("/api/**" or split by route)
    // OpenAPI bean with title "API Gateway"
    // SecurityScheme for JWT Bearer (via Authorization header)
}
```

- **WebFlux OpenApiConfig**: Manual OpenAPI bean defining routes manually
   - Gateway does NOT aggregate downstream specs (YAGNI)
   - Documents `/api/users/**` → user-service and `/api/wallet/**` → wallet-service routes

### Gateway Routes to Document

| Path | Destination |
|------|-------------|
| `/api/users/**` | user-service (lb://user-service) |
| `/api/wallet/**` | wallet-service (lb://wallet-service) |

## Related Code Files

**To modify:**
- `api-gateway/pom.xml` - add springdoc-webflux dependency

**To create:**
- `api-gateway/src/main/java/com/momogo/api/gateway/config/OpenApiConfig.java`

**Reference existing:**
- `api-gateway/src/main/java/com/momogo/api/gateway/security/SecurityConfig.java`

## Implementation Steps

1. **Add springdoc-webflux dependency to pom.xml**
   ```xml
   <dependency>
       <groupId>org.springdoc</groupId>
       <artifactId>springdoc-openapi-starter-webflux</artifactId>
       <version>2.7.0</version>
   </dependency>
   ```

2. **Create OpenApiConfig.java in config package**
   - Add @Configuration annotation
   - Create GroupedOpenApi bean for "gateway" group targeting "/api/**"
   - Create OpenAPI bean with title "API Gateway", version "1.0"
   - Add JWT Bearer security scheme with description "JWT Bearer token"
   - Add Server objects for localhost:8080

3. **Update SecurityConfig.java**
   - Add permit for `/v3/api-docs/**`
   - Add permit for `/swagger-ui/**`
   - Add permit for `/swagger-ui.html`
   - Keep existing JWT authentication filter

4. **Verify build compiles**
   - Run `mvn compile` in api-gateway directory

5. **Test endpoints manually (optional)**
   - GET `/v3/api-docs/gateway` returns JSON
   - GET `/swagger-ui.html` returns UI

## Todo List

- [ ] Add springdoc-openapi-starter-webflux:2.7.0 to api-gateway/pom.xml
- [ ] Create OpenApiConfig.java with grouped API for "/api/**"
- [ ] Configure JWT security scheme with Bearer type
- [ ] Update SecurityConfig for OpenAPI endpoint permit
- [ ] Verify compile with `mvn compile`
- [ ] Document added files in plan reports

## Success Criteria

- **Compile**: `mvn compile` succeeds with no errors
- **Spec accessible**: GET `/v3/api-docs/gateway` returns valid OpenAPI JSON
- **UI accessible**: GET `/swagger-ui.html` returns Swagger UI HTML
- **Security documented**: JWT Bearer scheme appears in spec
- **Routes documented**: /api/users/** and /api/wallet/** paths in spec

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| webflux version 2.7.0 instability | Medium | Medium | Test compile before proceeding |
| springdoc-webflux deprecated | High | Medium | Fallback to manual OpenAPI bean if needed |
| Security config blocks docs | Medium | High | Test permit list first |
| Route documentation incomplete | Medium | Low | Manually add PathItems if auto-scan fails |

## Security Considerations

- OpenAPI reveals gateway routing structure
- JWT Bearer scheme documented
- Authorization header passes to backend services
- Consider restricting OpenAPI endpoints in production (internal use only)

## Next Steps

- After all phases: Update `docs/project-changelog.md` with new feature
- After all phases: Review and close plan