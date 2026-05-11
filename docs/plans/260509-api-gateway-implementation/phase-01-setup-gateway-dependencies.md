# Phase 01: Setup Gateway Dependencies

## Overview

- **Priority:** P1
- **Status:** Completed
- **Effort:** 1h

Add required dependencies to api-gateway pom.xml for JWT, rate limiting, circuit breaker, and load balancing.

## Context Links

- [Research Report](../research/research-01-gateway-be-communication-analysis.md)
- [api-gateway/pom.xml](../../../backend/api-gateway/pom.xml)

## Dependencies to Add

```xml
<!-- Spring Cloud LoadBalancer (for lb:// routing) -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>

<!-- Spring Security (for JWT filter) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Redis (for rate limiting) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
</dependency>

<!-- Resilience4j (for circuit breaker) -->
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
    <version>2.2.0</version>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
```

## Todo List

- [ ] Add Spring Cloud LoadBalancer dependency
- [ ] Add Spring Security dependency
- [ ] Add Redis dependency
- [ ] Add Resilience4j dependency
- [ ] Add JJWT dependencies
- [ ] Verify Maven build succeeds

## Success Criteria

- `mvn clean compile` succeeds in api-gateway
- All new dependencies resolve without conflicts

## Next Steps

Phase 02: Configure routes and load balancing after dependencies are added