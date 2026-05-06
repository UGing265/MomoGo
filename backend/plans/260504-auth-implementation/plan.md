# Auth Implementation Plan — user-service & admin

**Version:** 1.0
**Date:** 2026-05-04
**Status:** Draft
**Priority:** P1

---

## Overview

Implement authentication for:
1. **Admin login** — username + password (BCrypt), simple, no OTP
2. **User registration** — phone + password + OTP verify
3. **User login** — phone + password + OTP

Future: User login will be phone-only (no password) after initial setup.

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Admin login | username + password | Simple MVP, no OTP overhead |
| Admin password | BCrypt hash | Better security than SHA-256 |
| User registration | phone + password + OTP | Secure initial auth |
| User login | phone + password + OTP | Extra layer for financial app |
| Password storage | BCrypt | Industry standard, adaptive |

---

## Auth Flow

### Admin Login
```
POST /api/v1/admin/auth/login
Body: { "username": "...", "password": "..." }
Response: { "accessToken": "...", "expiresIn": 900 }
```
- BCrypt verify password
- Generate JWT (15-min expiry)
- No refresh token for admin (MVP)

### User Registration
```
Step 1: POST /api/v1/auth/register/init
Body: { "phoneNumber": "0912345678", "password": "securePass123" }
→ Creates user (status=PENDING), sends OTP to Redis (5min TTL)

Step 2: POST /api/v1/auth/register/verify
Body: { "phoneNumber": "0912345678", "otpCode": "123456" }
→ Validates OTP, sets user status=ACTIVE, returns JWT
```

### User Login
```
POST /api/v1/auth/login
Body: { "phoneNumber": "0912345678", "password": "securePass123" }
→ BCrypt verify, generates OTP, sends SMS

POST /api/v1/auth/login/verify
Body: { "phoneNumber": "0912345678", "otpCode": "123456" }
→ Validates OTP, returns JWT
```

---

## Database Changes

### admin_users (already exists in schema)
```sql
-- Add password_hash column (already exists, ensure BCrypt)
-- No role column (per ERD fix)
```

### users (already exists)
```sql
-- Add password_hash if not present
-- Ensure phone_number UNIQUE
-- status: PENDING → ACTIVE after OTP verify
```

---

## Implementation Steps

### Step 1: Add BCrypt dependency (if not present)

Check `user-service/pom.xml` for spring-security-crypto or add it.

### Step 2: Create domain entities

```
com.momogo.user.domain.entity
├── User.java
├── AdminUser.java

com.momogo.user.domain.repository
├── UserRepository.java (interface)
├── AdminUserRepository.java (interface)
```

### Step 3: Create application layer (use cases)

```
com.momogo.user.application.usecase.auth
├── RegisterUserInitUseCase    — create user, send OTP
├── RegisterUserVerifyUseCase   — verify OTP, activate, return JWT
├── LoginUserInitUseCase       — verify password, send OTP
├── LoginUserVerifyUseCase     — verify OTP, return JWT
├── LoginAdminUseCase          — verify credentials, return JWT
```

### Step 4: Create infrastructure (JWT + Redis)

```
com.momogo.user.infrastructure.security
├── JwtService.java            — generate/validate JWT
├── JwtAuthenticationFilter.java

com.momogo.user.infrastructure.redis
├── OtpService.java            — generate/store/validate OTP (Redis)
```

### Step 5: Create REST controllers

```
com.momogo.user.presentation.controller
├── AuthController.java        — /api/v1/auth/*
└── AdminAuthController.java   — /api/v1/admin/auth/*
```

### Step 6: Configure Spring Security

```java
// SecurityConfig.java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/register/init", "/api/v1/admin/auth/login").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

---

## Redis OTP Keys

| Key Pattern | Value | TTL |
|-------------|-------|-----|
| `otp:reg:{phone}` | 6-digit code | 5 min |
| `otp:login:{phone}` | 6-digit code | 5 min |
| `otp:attempts:{phone}` | count | 24h (rate limit) |

---

## JWT Structure

```json
{
  "sub": "{userId or adminId}",
  "type": "USER | ADMIN",
  "iat": 1715000000,
  "exp": 1715000900
}
```

- Access token: 15-minute expiry
- No refresh token for MVP (re-login required)

---

## API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/admin/auth/login` | Admin login | None |
| POST | `/api/v1/auth/register` | Start user registration | None |
| POST | `/api/v1/auth/register/otp` | Verify OTP, activate user | None |
| POST | `/api/v1/auth/login` | Start user login | None |
| POST | `/api/v1/auth/login/otp` | Verify OTP, get JWT | None |
| GET | `/api/v1/users/me` | Get current user | JWT (USER) |
| GET | `/api/v1/admin/dashboard` | Admin dashboard | JWT (ADMIN) |

---

## Files to Create/Modify

### Create
- `domain/entity/User.java`
- `domain/entity/AdminUser.java`
- `domain/repository/UserRepository.java`
- `domain/repository/AdminUserRepository.java`
- `application/usecase/auth/RegisterUserInitUseCase.java`
- `application/usecase/auth/RegisterUserVerifyUseCase.java`
- `application/usecase/auth/LoginUserInitUseCase.java`
- `application/usecase/auth/LoginUserVerifyUseCase.java`
- `application/usecase/auth/LoginAdminUseCase.java`
- `infrastructure/security/JwtService.java`
- `infrastructure/security/JwtAuthenticationFilter.java`
- `infrastructure/security/SecurityConfig.java`
- `infrastructure/redis/OtpService.java`
- `presentation/controller/AuthController.java`
- `presentation/controller/AdminAuthController.java`
- `presentation/request/LoginRequest.java`
- `presentation/request/RegisterInitRequest.java`
- `presentation/request/VerifyOtpRequest.java`
- `presentation/response/AuthResponse.java`

### Modify
- `UserServiceApplication.java` — add @EnableMethodSecurity if needed
- `application.yml` — add JWT secret config

---

## Success Criteria

- [ ] Admin can login with username + password, receive JWT
- [ ] User can start registration with phone + password, receive OTP
- [ ] User can verify OTP, account activates, receives JWT
- [ ] User can login with phone + password, receive OTP
- [ ] User can verify OTP on login, receives JWT
- [ ] Protected endpoints reject requests without valid JWT
- [ ] OTP expires after 5 minutes
- [ ] Rate limiting: max 5 OTP requests per phone per 24h

---

## Next Steps

1. Implement this auth phase
2. After auth is working: implement user profile / me endpoint
3. Then: wallet-service integration (JWT validation at gateway)