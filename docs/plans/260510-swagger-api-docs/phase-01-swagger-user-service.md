# Phase 01: Swagger Documentation for user-service

## Context Links

- Research: `research/researcher-01-springdoc-openapi-report.md`
- Plan: `plan.md`

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-05-10 |
| Description | Add OpenAPI/Swagger UI to user-service (port 8081) |
| Priority | P2 |
| Status | in_progress |
| Effort | 2h |

## Key Insights

- springdoc-openapi-starter-webmvc-ui:3.0.3 compatible with Spring Boot 4.x
- Auto-generates OpenAPI from @RestController, @Operation annotations
- GroupedOpenApi splits docs by API group (e.g., "/api/users/**")
- @ParameterObject for Pageable parameters auto-documents pagination
- OpenAPI JSON at `/v3/api-docs/users`, Swagger UI at `/swagger-ui.html`

## Requirements

### Functional
- Expose OpenAPI JSON spec at `/v3/api-docs/users`
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
| MODIFY | `user-service/pom.xml` |
| CREATE | `user-service/src/main/java/com/momogo/user/presentation/config/OpenApiConfig.java` |

### OpenApiConfig.java Structure

```java
@Configuration
public class OpenApiConfig {
    // GroupedOpenApi for user endpoints
    // OpenAPI bean with info (title, version, description)
    // SecurityScheme for JWT Bearer
}
```

## Related Code Files

**To modify:**
- `user-service/pom.xml` - add springdoc dependency

**To create:**
- `user-service/src/main/java/com/momogo/user/presentation/config/OpenApiConfig.java`

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
   - Create GroupedOpenApi bean for "users" group targeting "/api/users/**"
   - Create OpenAPI bean with title "User Service API", version "1.0"
   - Add JWT Bearer security scheme

3. **Update SecurityConfig.java (if exists)**
   - Permit `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html`
   - NOTE: No controllers exist yet - springdoc config only (YAGNI)

4. ~~Add OpenAPI annotations to existing controllers~~ (SKIPPED - no controllers exist yet)
   - Will be implemented when controllers are added in future sprint

5. **Verify build compiles**
   - Run `mvn compile` in user-service directory

6. **Test endpoints manually (optional)**
   - GET `/v3/api-docs/users` returns JSON
   - GET `/swagger-ui.html` returns UI

## Todo List

- [ ] Add springdoc dependency to user-service/pom.xml
- [ ] Create OpenApiConfig.java with grouped API
- [ ] Configure JWT security scheme in OpenApiConfig
- [ ] Update SecurityConfig for OpenAPI endpoint permit
- [ ] ~~Add @Tag annotations to UserController~~ (SKIPPED - no controllers yet)
- [ ] Verify compile with `mvn compile`
- [ ] Document added files in plan reports

## Success Criteria

- **Compile**: `mvn compile` succeeds with no errors
- **Spec accessible**: GET `/v3/api-docs/users` returns valid OpenAPI JSON
- **UI accessible**: GET `/swagger-ui.html` returns Swagger UI HTML
- **Security documented**: JWT Bearer scheme appears in spec
- **Group defined**: Only `/api/users/**` endpoints appear in spec

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| springdoc version conflict | Low | Medium | Use explicit 3.0.3 version |
| Security config blocks OpenAPI | Medium | High | Test permit list first |
| Missing Javadoc annotations | Low | Low | Annotations optional, auto-generated |

## Security Considerations

- OpenAPI specs reveal API structure (acceptable for internal services)
- JWT scheme documented but not enforced by OpenAPI (server responsibility)
- Consider rate-limiting OpenAPI endpoints in production

## Next Steps

- Phase 2: wallet-service (same pattern, different group)
- Phase 3: api-gateway (webflux variant)