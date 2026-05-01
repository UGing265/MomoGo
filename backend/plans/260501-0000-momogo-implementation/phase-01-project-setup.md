# Phase 01: Project Setup

## Context Links

- SRS: `D:\AShiroru\ProgramCode\Project\Team\MomoGo\docs\srs.md`
- Architecture: `D:\Users\HP\.claude\plans\composed-soaring-noodle.md`

## Overview

- **Priority:** P1 (Critical)
- **Status:** pending
- **Description:** Create Maven/Gradle projects for user-service and wallet-service with clean architecture structure, PostgreSQL schemas, Redis configuration, shared common module, and API Gateway stub.

## Key Insights from Research

1. Spring Boot 3.2+ with Java 17+ required for latest security features
2. Flyway for database migrations (not Hibernate auto-DDL)
3. Redis needed for: JWT blacklist, OTP storage, session management, daily limit tracking
4. API Gateway can be Kong or Spring Cloud Gateway; start with Spring Cloud Gateway for simplicity
5. Shared common module prevents code duplication across services

## Requirements

### Functional
- Create 2 Spring Boot Maven projects: user-service, wallet-service
- Package structure following Clean Architecture: domain/application/infrastructure/presentation
- PostgreSQL databases: user_db, wallet_db
- Redis configuration for session and cache management
- API Gateway with JWT validation stub
- Shared common module with DTOs, utilities, constants

### Non-Functional
- Each service runs on separate port (8081, 8082)
- Gateway on port 8080
- Clean separation of concerns via layers
- No circular dependencies between layers

## Architecture

```
momogo/
├── common/                    # Shared module
│   └── src/main/java/
│       └── com.momogo.common/
│           ├── dto/          # Shared DTOs
│           ├── constants/    # Business rules constants
│           ├── exception/    # Shared exceptions
│           └── util/         # Utilities
├── api-gateway/              # Port 8080
│   └── src/
├── user-service/             # Port 8081
│   └── src/
│       └── java/com.momogo.user/
│           ├── domain/
│           ├── application/
│           ├── infrastructure/
│           └── presentation/
└── wallet-service/          # Port 8082
    └── src/
        └── java/com.momogo.wallet/
            ├── domain/
            ├── application/
            ├── infrastructure/
            └── presentation/
```

## Related Code Files

### Create
- `pom.xml` files for each module
- `application.yml` for each service
- PostgreSQL Flyway migration scripts
- Redis configuration classes
- API Gateway JWT filter stub
- Base entity classes and audit fields

### Delete
- None

## Implementation Steps

1. **Create Maven multi-module project structure**
   - Parent pom.xml with dependency management
   - Module declarations for: common, api-gateway, user-service, wallet-service

2. **Create common module**
   - Shared DTOs (Money, PhoneNumber, etc.)
   - Business rules constants (MinDeposit, MaxDailyWithdraw, etc.)
   - Custom exceptions (InsufficientBalanceException, etc.)
   - Utility classes (EncryptionUtil, etc.)

3. **Setup user-service**
   - Spring Boot application with port 8081
   - PostgreSQL configuration (user_db)
   - Flyway migration: V1__create_user_schema.sql
   - Clean architecture package structure

4. **Setup wallet-service**
   - Spring Boot application with port 8082
   - PostgreSQL configuration (wallet_db)
   - Flyway migration: V1__create_wallet_schema.sql
   - Clean architecture package structure

5. **Setup API Gateway**
   - Spring Cloud Gateway on port 8080
   - JWT validation filter stub (mock for now)
   - Route configuration to user-service and wallet-service
   - Rate limiting configuration (Bucket4j)

6. **Configure Redis**
   - Redis configuration for all services
   - RedisTemplate setup for OTP, session, rate limiting
   - Connection pooling (Lettuce)

7. **Setup Flyway migrations**
   - User schema: users, kyc_submissions, bank_accounts, transaction_pins, admin_users
   - Wallet schema: wallets, transactions, ledger_entries, qr_codes, idempotency_records, outbox_events

## Todo List

- [ ] Create parent Maven project with multi-module structure
- [ ] Create common module with shared DTOs and constants
- [ ] Create user-service with clean architecture packages
- [ ] Create wallet-service with clean architecture packages
- [ ] Create API Gateway with JWT filter stub
- [ ] Configure PostgreSQL connections for both services
- [ ] Configure Redis for both services
- [ ] Create Flyway migration scripts for user_db
- [ ] Create Flyway migration scripts for wallet_db
- [ ] Verify all services compile successfully

## Success Criteria

1. All 4 modules (common, api-gateway, user-service, wallet-service) compile without errors
2. PostgreSQL databases created and migrations applied
3. Redis connection established and functional
4. API Gateway routes requests to correct services
5. Clean architecture layers properly separated with no cross-layer dependencies

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Maven dependency conflicts | Medium | Medium | Use dependency management in parent pom |
| Flyway migration conflicts | Low | High | Version-prefixed migration files |
| Redis connection pooling issues | Low | Medium | Use Lettuce with sensible pool settings |

## Security Considerations

- Database credentials via environment variables, not config files
- No sensitive data in application.yml (use placeholder)
- Redis without password for dev; require password in prod
- API Gateway as single entry point (no direct service access)

## Next Steps

- Phase 02: user-service Core implementation