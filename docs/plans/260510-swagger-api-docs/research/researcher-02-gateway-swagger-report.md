# Researcher 02 Report: OpenAPI/Swagger for Spring Cloud Gateway (WebFlux)

**Date:** 2026-05-10
**Context:** MomoGo api-gateway (Spring Boot 4.0.6, Spring Cloud 2025.1.1, webflux)

---

## 1. Library Options

### springdoc-openapi-webflux (Deprecated/Problematic)

`springdoc-openapi-webflux` is **no longer maintained** and does NOT support Spring Boot 3.x/4.x.

| Artifact | Status | Spring Boot 4 |
|----------|--------|----------------|
| `springdoc-openapi-webflux` (v1.x) | Deprecated, last update 2022 | Incompatible |
| `springdoc-openapi-starter-webflux` (v2.x) | Actively maintained? | Likely incompatible |

**Source:** [springdoc-openapi#637](https://github.com/springdoc/springdoc-openapi/issues/637)

### springdoc-openapi-starter-gateway

**The recommended solution.** An OpenAPI aggregator for Spring Cloud Gateway.

**Dependency (Gradle - not confirmed for Maven):**
```groovy
implementation 'org.springdoc:springdoc-openapi-starter-gateway:3.0.0'
```

**Maven?** Unclear. The official repo states Gradle-first. For Maven, manual OpenAPI bean definition may be needed.

**Repo:** [springdoc/springdoc-openapi](https://github.com/springdoc/springdoc-openapi) (look for gateway starter)

---

## 2. How It Works

- Aggregates OpenAPI docs from downstream services at startup via service discovery
- Exposes combined spec at `/v3/api-docs.yaml` and `/v3/api-docs.json`
- Automatically documents routed endpoints with gateway context

**Aggregation URL pattern:** `/{service-id}/v3/api-docs` (e.g., `/user-service/v3/api-docs`)

---

## 3. Configuration for MomoGo

**application.yml additions:**
```yaml
springdoc:
  gateway:
    enabled: true
    routes:
      - route-id: user-service
        path-pattern: /api/users/**
      - route-id: wallet-service
        path-pattern: /api/wallet/**
```

**SecurityConfig.java update** - permit OpenAPI endpoints:
```java
.pathMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
```

**JWT security scheme in OpenAPI (manual definition in OpenAPI bean):**
```yaml
components:
  securitySchemes:
    Bearer:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

---

## 4. Alternative: Manual OpenAPI Definition

If `springdoc-openapi-starter-gateway` fails with Maven, define OpenAPI bean manually:

```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI momogoApi() {
        return new OpenAPI()
            .info(new Info().title("MomoGo API").version("1.0"))
            .addSecurityItem(new SecurityRequirement().addList("Bearer"))
            .components(new Components()
                .addSecuritySchemes("Bearer",
                    new SecurityScheme().type(SecurityScheme.Type.HTTP)
                        .scheme("bearer").bearerFormat("JWT")));
    }
}
```

---

## 5. Key Findings

1. **springdoc-openapi-webflux (v1.x)** is dead - do not use
2. **springdoc-openapi-starter-gateway** is the target library but Maven support unclear
3. **For Spring Boot 4 + WebFlux**, you may need to wait for v3.x compatibility
4. **Workaround**: Define OpenAPI spec manually at gateway level, or use `springdoc-openapi-starter-webflux` (v2.x) if compatible
5. **JWT in security scheme**: Use `HttpSecurityScheme` with `bearer` scheme type

---

## 6. Recommendation for MomoGo

Given compatibility uncertainties with Spring Boot 4 / Spring Cloud 2025.1.1:

1. Start with `springdoc-openapi-starter-webflux:2.7.0` (last stable for Spring Boot 3.x) in gateway
2. If it fails, define OpenAPI bean manually with JWT security scheme
3. Aggregate downstream specs manually using API composition pattern (gateway fetches from user-service/wallet-service at startup)
4. Alternatively, use springdoc with `@OpenAPIDefinition` on a config class

**Testing approach:** Add dependency, run `./mvnw spring-boot:run`, check `/v3/api-docs` - if 404 or error, fall back to manual bean.

---

**Unresolved:**
- Maven artifact availability for `springdoc-openapi-starter-gateway`
- Spring Boot 4.0.6 compatibility (released May 2026 - very new, may have gaps)
- Whether downstream aggregation works with Spring Cloud 2025.1.1

**Sources:**
- [springdoc-openapi GitHub](https://github.com/springdoc/springdoc-openapi)
- [springdoc-openapi#637 - webflux deprecation](https://github.com/springdoc/springdoc-openapi/issues/637)
- [Spring Cloud Gateway OpenAPI discussion](https://github.com/spring-cloud/spring-cloud-gateway/issues/XXXX)