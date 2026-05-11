# Phase 02: Swagger Documentation for wallet-service

## Context Links

- Research: `research/researcher-01-springdoc-openapi-report.md`
- Plan: `plan.md`
- Phase 1: `phase-01-swagger-user-service.md` (reference pattern)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-05-10 |
| Description | Add OpenAPI/Swagger UI to wallet-service (port 8082) |
| Priority | P2 |
| Status | pending |
| Effort | 2h |

## Key Insights

- Identical approach to user-service (both webmvc)
- GroupedOpenApi targets "/api/wallet/**" for wallet group
- Separate group name "wallet" to distinguish from user-service
- Same springdoc dependency version 3.0.3

## Requirements

### Functional
- Expose OpenAPI JSON spec at `/v3/api-docs/wallet`
- Swagger UI at `/swagger-ui.html`
- Document JWT Bearer auth scheme
- Group endpoints by context path

### Non-Functional
- No breaking changes to existing endpoints
- Minimal code addition (< 100 lines)
- Compile cleanly

## Architecture

### File Changes

| Action | File |
|--------|------|
| MODIFY | `wallet-service/pom.xml` |
| CREATE | `wallet-service/src/main/java/com/momogo/wallet/presentation/config/OpenApiConfig.java` |

### OpenApiConfig.java Structure

```java
@Configuration
public class OpenApiConfig {
    // GroupedOpenApi for wallet endpoints ("/api/wallet/**")
    // OpenAPI bean with title "Wallet Service API"
    // SecurityScheme for JWT Bearer
}
```

## Related Code Files

**To modify:**
- `wallet-service/pom.xml` - add springdoc dependency

**To create:**
- `wallet-service/src/main/java/com/momogo/wallet/presentation/config/OpenApiConfig.java`

## Implementation Steps

1. **Add springdoc dependency to pom.xml**
   ```xml
   <dependency>
       <groupId>org.springdoc</groupId>
       <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
       <version>3.0.3</version>
   </dependency>
   ```

2. **Create OpenApiConfig.java in presentation.config package**
   - Add @Configuration annotation
   - Create GroupedOpenApi bean for "wallet" group targeting "/api/wallet/**"
   - Create OpenAPI bean with title "Wallet Service API", version "1.0"
   - Add JWT Bearer security scheme

3. **Update SecurityConfig.java (if exists)**
   - Permit `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html`
   - NOTE: No controllers exist yet - springdoc config only (YAGNI)

4. ~~Add OpenAPI annotations to existing controllers~~ (SKIPPED - no controllers exist yet)
   - Will be implemented when controllers are added in future sprint

5. **Verify build compiles**
   - Run `mvn compile` in wallet-service directory

6. **Test endpoints manually (optional)**
   - GET `/v3/api-docs/wallet` returns JSON
   - GET `/swagger-ui.html` returns UI

## Todo List

- [ ] Add springdoc dependency to wallet-service/pom.xml
- [ ] Create OpenApiConfig.java with grouped API for "/api/wallet/**"
- [ ] Configure JWT security scheme in OpenApiConfig
- [ ] Update SecurityConfig for OpenAPI endpoint permit
- [ ] ~~Add @Tag annotations to WalletController, TransactionController~~ (SKIPPED - no controllers yet)
- [ ] Verify compile with `mvn compile`
- [ ] Document added files in plan reports

## Success Criteria

- **Compile**: `mvn compile` succeeds with no errors
- **Spec accessible**: GET `/v3/api-docs/wallet` returns valid OpenAPI JSON
- **UI accessible**: GET `/swagger-ui.html` returns Swagger UI HTML
- **Security documented**: JWT Bearer scheme appears in spec
- **Group defined**: Only `/api/wallet/**` endpoints appear in spec

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| springdoc version conflict | Low | Medium | Use explicit 3.0.3 version |
| Security config blocks OpenAPI | Medium | High | Test permit list first |
| Duplicate port usage | Low | High | wallet-service on 8082, separate from user-service |

## Security Considerations

- OpenAPI specs reveal API structure (acceptable for internal services)
- JWT scheme documented but not enforced by OpenAPI
- Consider rate-limiting OpenAPI endpoints in production

## Next Steps

- Phase 3: api-gateway (webflux variant with springdoc-openapi-starter-webflux:2.7.0)
- After all phases: Update project documentation