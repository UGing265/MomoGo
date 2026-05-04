# Phase 01: Project Setup

## Context Links

- SRS: `D:\AShiroru\ProgramCode\Project\Team\MomoGo\docs\srs.md`
- ERD: `D:\AShiroru\ProgramCode\Project\Team\MomoGo\docs\erd.md`
- Plan: `D:\AShiroru\ProgramCode\Project\Team\MomoGo\backend\plans\260501-0000-momogo-implementation\plan.md`

## Overview

- **Priority:** P1 (Critical)
- **Status:** completed
- **Description:** Setup clean architecture folder structure for user-service, wallet-service, api-gateway — create application configs, Redis config, Flyway migrations. No common module (each service has its own DTOs/constants).

## Key Insights

1. Spring Boot 4.0.6 with Java 21
2. Flyway for database migrations (not Hibernate auto-DDL)
3. Redis needed for: JWT blacklist, OTP storage, session management, daily limit tracking
4. Spring Cloud Gateway for API Gateway (already in pom.xml)
5. No common module — each service self-contained

## Requirements

### Functional
- Clean Architecture package structure per service: domain/application/infrastructure/presentation
- PostgreSQL databases: user_db, wallet_db
- Redis configuration for session and cache management
- API Gateway with JWT validation stub
- Flyway migration scripts for both databases

### Non-Functional
- user-service on port 8081
- wallet-service on port 8082
- Gateway on port 8080
- Clean separation of concerns via layers

## Architecture

```
backend/
├── api-gateway/                      # Port 8080
│   └── src/main/java/com/momogo/gateway/
│       └── (gateway routes + filters)
├── user-service/                    # Port 8081
│   └── src/main/java/com/momogo/user/
│       ├── domain/
│       │   ├── entity/
│       │   ├── repository/
│       │   └── exception/
│       ├── application/
│       │   ├── dto/
│       │   ├── service/
│       │   └── usecase/
│       ├── infrastructure/
│       │   ├── persistence/
│       │   ├── redis/
│       │   └── external/
│       └── presentation/
│           ├── controller/
│           ├── request/
│           └── response/
├── wallet-service/                  # Port 8082
│   └── src/main/java/com/momogo/wallet/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
```

## Related Code Files

### Create
- `application.yml` for each service (PostgreSQL, Redis config)
- `RedisConfig.java` for each service
- Flyway migration: `V1__create_user_schema.sql`
- Flyway migration: `V1__create_wallet_schema.sql`
- Base entity classes with audit fields (created_at, updated_at)

### Modify
- `pom.xml` — add Flyway dependency to user-service and wallet-service

## Implementation Steps

### Step 1: Add Flyway dependency to user-service and wallet-service

```xml
<!-- In user-service/pom.xml and wallet-service/pom.xml -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

### Step 2: Create application.yml for user-service

```yaml
# user-service/src/main/resources/application.yml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/user_db
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:postgres}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 10
          max-idle: 5
          min-idle: 2

jwt:
  secret: ${JWT_SECRET:your-256-bit-secret-key-here-change-in-production}
  access-token-expiry: 900000  # 15 minutes
  refresh-token-expiry: 86400000  # 1 day
```

### Step 3: Create application.yml for wallet-service

```yaml
# wallet-service/src/main/resources/application.yml
server:
  port: 8082

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/wallet_db
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:postgres}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 10
          max-idle: 5
          min-idle: 2

jwt:
  secret: ${JWT_SECRET:your-256-bit-secret-key-here-change-in-production}
  access-token-expiry: 900000
```

### Step 4: Create application.yml for api-gateway

```yaml
# api-gateway/src/main/resources/application.yml
server:
  port: 8080

spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/users/**
        - id: wallet-service
          uri: http://localhost:8082
          predicates:
            - Path=/api/wallet/**
      default-filters:
        - StripPrefix=0
```

### Step 5: Create RedisConfig for user-service and wallet-service

```java
// com.momogo.user.infrastructure.redis.UserRedisConfig
@Configuration
public class RedisConfig {
    @Value("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;

    @Value("${spring.data.redis.password}")
    private String redisPassword;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        config.setHostName(redisHost);
        config.setPort(redisPort);
        if (redisPassword != null && !redisPassword.isEmpty()) {
            config.setPassword(redisPassword);
        }
        return new LettuceConnectionFactory(config);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));
        return template;
    }
}
```

### Step 6: Create Flyway migration — user_db

```sql
-- user-service/src/main/resources/db/migration/V1__create_user_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    kyc_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_status ON users(status);

CREATE TABLE kyc_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    cccd_number VARCHAR(50) NOT NULL,
    document_type VARCHAR(20) NOT NULL DEFAULT 'CCCD',
    front_image_url VARCHAR(500) NOT NULL,
    back_image_url VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    admin_notes TEXT
);

CREATE INDEX idx_kyc_status ON kyc_submissions(status);
CREATE INDEX idx_kyc_submitted_at ON kyc_submissions(submitted_at);

CREATE TABLE linked_banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    bank_code VARCHAR(10) NOT NULL,
    account_token VARCHAR(500) NOT NULL,
    account_holder_name VARCHAR(255) NOT NULL,
    last_four_digits VARCHAR(4) NOT NULL,
    link_status VARCHAR(20) NOT NULL DEFAULT 'LINKED',
    verified_at TIMESTAMP,
    linked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    unlinked_at TIMESTAMP
);

CREATE INDEX idx_linked_banks_user ON linked_banks(user_id);
CREATE INDEX idx_linked_banks_status ON linked_banks(link_status);

CREATE TABLE transaction_pins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    hashed_pin VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    fail_count INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Step 7: Create Flyway migration — wallet_db

```sql
-- wallet-service/src/main/resources/db/migration/V1__create_wallet_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    available_balance BIGINT NOT NULL DEFAULT 0,
    pending_balance BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_wallets_user ON wallets(user_id);
CREATE INDEX idx_wallets_status ON wallets(status);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_wallet_id UUID REFERENCES wallets(id),
    receiver_wallet_id UUID REFERENCES wallets(id),
    type VARCHAR(20) NOT NULL,
    amount BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    reference_code VARCHAR(100) UNIQUE,
    description TEXT,
    idempotency_key VARCHAR(100) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_tx_sender ON transactions(sender_wallet_id);
CREATE INDEX idx_tx_receiver ON transactions(receiver_wallet_id);
CREATE INDEX idx_tx_status ON transactions(status);
CREATE INDEX idx_tx_created ON transactions(created_at);
CREATE INDEX idx_tx_idem ON transactions(idempotency_key);

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    entry_type VARCHAR(10) NOT NULL,
    amount BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ledger_tx ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_wallet ON ledger_entries(wallet_id);

CREATE TABLE qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    qr_type VARCHAR(10) NOT NULL,
    reference_id VARCHAR(100) UNIQUE NOT NULL,
    amount BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_qr_reference ON qr_codes(reference_id);
CREATE INDEX idx_qr_status ON qr_codes(status);
CREATE INDEX idx_qr_expires ON qr_codes(expires_at);

CREATE TABLE idempotency_records (
    idempotency_key VARCHAR(100) PRIMARY KEY,
    request_hash VARCHAR(64) NOT NULL,
    response_body TEXT,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);
```

### Step 8: Create folder structure

Create empty marker classes to establish packages:

```
user-service/src/main/java/com/momogo/user/
├── domain/
│   ├── entity/
│   ├── repository/
│   └── exception/
├── application/
│   ├── dto/
│   ├── service/
│   └── usecase/
├── infrastructure/
│   ├── persistence/
│   ├── redis/
│   └── external/
└── presentation/
    ├── controller/
    ├── request/
    └── response/

wallet-service/src/main/java/com/momogo/wallet/
├── domain/
├── application/
├── infrastructure/
└── presentation/

api-gateway/src/main/java/com/momogo/gateway/
└── (routes, filters)
```

## Todo List

- [ ] Add Flyway dependency to user-service pom.xml
- [ ] Add Flyway dependency to wallet-service pom.xml
- [ ] Create application.yml for user-service
- [ ] Create application.yml for wallet-service
- [ ] Create application.yml for api-gateway
- [ ] Create RedisConfig for user-service
- [ ] Create RedisConfig for wallet-service
- [ ] Create V1__create_user_schema.sql migration
- [ ] Create V1__create_wallet_schema.sql migration
- [ ] Create clean architecture folder structure
- [ ] Verify all services compile (mvn compile)

## Success Criteria

1. All 3 services (user-service, wallet-service, api-gateway) compile without errors
2. Flyway migrations created for user_db and wallet_db
3. application.yml configs for all services
4. Redis configuration classes created

## Next Steps

- Phase 02: user-service Core implementation