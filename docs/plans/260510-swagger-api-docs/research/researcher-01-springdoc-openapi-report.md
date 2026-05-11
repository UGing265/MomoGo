# Springdoc-OpenAPI Report for Spring Boot 4

## 1. Correct Dependency Version

**Version: 3.0.3** (latest, supports Spring Boot 4 / Jakarta EE 10)

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>3.0.3</version>
</dependency>
```

Note: v2.x requires `spring-boot-starter-webflux` or `spring-boot-starter-webmvc` (v2.x = Spring Boot 3, v1.x = Spring Boot 2.x)

Sources:
- [Maven Repository](https://repo1.maven.org/maven2/org/springdoc/springdoc-openapi-starter-webmvc-ui/)
- [springdoc.org](https://springdoc.org/#quickstart)

---

## 2. Minimal Configuration (Auto-Generation)

No explicit OpenAPI bean required. Auto-generates from Spring components with `@Tag`, `@Operation`, `@ApiResponse`.

Default endpoints:
- Swagger UI: `/swagger-ui/index.html`
- OpenAPI JSON: `/v3/api-docs`
- OpenAPI YAML: `/v3/api-docs.yaml`

Optional config in `application.yml`:
```yaml
springdoc:
  swagger-ui:
    path: /swagger-ui.html
  api-docs:
    enabled: true
```

Sources:
- [springdoc.org](https://springdoc.org/#quickstart)

---

## 3. API Grouping by Tags

Use `GroupedOpenApi` beans for per-service grouping:

```java
@Configuration
public class OpenApiConfig {
    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder()
            .group("User API")
            .packagesToScan("com.momogo.user.presentation.controller")
            .build();
    }

    @Bean
    public GroupedOpenApi walletApi() {
        return GroupedOpenApi.builder()
            .group("Wallet API")
            .packagesToScan("com.momogo.wallet.presentation.controller")
            .build();
    }
}
```

Alternative: `.pathsToMatch("/api/users/**")`

Sources:
- [springdoc.org](https://springdoc.org/#configuration)

---

## 4. JWT Security Scheme

```java
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
```

On each protected controller/endpoint:
```java
@SecurityRequirement(name = "bearerAuth")
```

Spring Security permit list required (if using Spring Security):
```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
            .anyRequest().authenticated()
        );
    return http.build();
}
```

Sources:
- [springdoc.org](https://springdoc.org/spring-doc-openapi-security.html)

---

## 5. Spring Data JPA / Entity Scanning

springdoc-openapi auto-scans JPA entities. For REST controllers:
- Use `@ParameterObject` annotation on `Pageable` parameters
- Entities must have accessible getters/setters (Jackson serialized)
- `@Schema(hidden = true)` to exclude fields from spec

```java
@GetMapping
public Page<User> getUsers(@ParameterObject Pageable pageable) { ... }
```

springdoc.enable-data-rest (default: true) enables Spring Data Rest support.

Sources:
- [springdoc.org](https://springdoc.org/#configuration)

---

## Summary

| Item | Value |
|------|-------|
| Dependency | `springdoc-openapi-starter-webmvc-ui:3.0.3` |
| Auto-generated | Yes (no explicit bean needed) |
| Tag grouping | `GroupedOpenApi.builder().packagesToScan()` |
| JWT security | `@SecurityScheme` + `@SecurityRequirement` |
| JPA | `@ParameterObject` for Pageable; auto-scanned |

---

## Unresolved Questions

1. Whether springdoc-openapi v3.0.3 fully supports Spring Boot 4.0.6 (minor version mismatch possible - confirmed for SB4 but not tested with SB4.0.6 specifically)
2. Actual performance impact with large JPA entity scanning (may need `@Schema(hidden=true)` on large entities)
