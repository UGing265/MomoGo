# Research Report: MomoGo User-Service Implementation

**Date:** 2026-05-01
**Service:** user-service (payment/wallet application)

---

## 1. Technology Choices & Libraries

### Core Stack
- **Framework:** Spring Boot 3.2+ with Java 17+
- **Database:** PostgreSQL 15+ (with Flyway for migrations)
- **Cache/Session:** Redis (JWT blacklist, OTP storage, session management)
- **API:** REST (public) + gRPC (internal service-to-service)

### Key Libraries
| Purpose | Library | Notes |
|---------|---------|-------|
| Clean Architecture | Custom layered structure | domain/application/infrastructure/presentation |
| JWT/OAuth2 | spring-security-oauth2-resource-server + jjwt | Access + Refresh tokens |
| Database | Spring Data JPA + Hibernate | With DDD aggregates |
| Mapping | MapStruct | For DTO↔Entity conversions |
| Resilience | Resilience4j | Circuit breaker, retry, rate limiter |
| SMS/OTP | eSMS.vn or SpeedSMS.vn (Vietnam providers) | Brandname OTP required |
| Image Storage | S3-compatible (MinIO/AWS S3) | UUID filenames, signed URLs |
| OCR | FPT.AI or VNPT eKYC API | Specialized for Vietnamese CCCD |

### Clean Architecture Layers
```
presentation/  → REST controllers, DTOs
application/   → Use cases, command handlers, DTOs
domain/        → Entities, value objects, repository interfaces, domain events
infrastructure/ → Repository implementations, external service adapters, persistence
```

---

## 2. eKYC Implementation (CCCD Image Upload & Validation)

### Image Storage Approach
- **S3-compatible storage (MinIO for dev, AWS S3 for prod)** - NOT database BLOB
- Store UUID-renamed files, never original filenames
- Strip EXIF metadata before storage
- Serve via signed URLs with 5-10 minute TTL

### OCR Pipeline
1. Client uploads front/back images → S3
2. Call FPT.AI or VNPT eKYC API for text extraction
3. Validate CCCD format (12 digits, province code, DOB cross-check)
4. Manual review queue for admin approval (BR-ADM-01: 24h SLA)

### CCCD Validation
Vietnam CCCD 12-digit format (no checksum):
- Digits 1-3: Province code
- Digit 4: Gender/Century (0=male 19xx, 1=female 19xx, 2=male 20xx, 3=female 20xx)
- Digits 5-6: Birth year (last 2 digits)
- Digits 7-12: Random sequence

---

## 3. Bank API Integration (Adapter Pattern + Circuit Breaker)

### Adapter Pattern Structure
```java
interface BankAdapter {
    BankLinkResponse linkAccount(BankLinkRequest request);
    void unlinkAccount(String linkId);
    BigDecimal getBalance(String linkId);
}
```

### Implementation
- `VietcombankAdapter` / `TechcombankAdapter` implement `BankAdapter`
- `BankAdapterFactory` resolves correct adapter by `bankCode`
- Use MapStruct for request/response mapping between canonical models and bank-specific DTOs

### Resilience4j Configuration
- `failureRateThreshold`: 50%
- `slidingWindowSize`: 10 calls
- `waitDurationInOpenState`: 30s
- Per-bank circuit breaker (failure in VCB doesn't affect TCB)

### Business Rules
- BR-ACC-03: Unlink only when balance = 0
- BR-ACC-04: Max 2 bank accounts per user
- Store bank tokens securely (not raw account numbers)

---

## 4. OTP Flow (SMS Provider)

### Recommended Provider
**eSMS.vn** or **SpeedSMS.vn** - both have robust REST APIs and Spring Boot support. Brandname registration is mandatory in Vietnam for OTP.

### OTP Storage (Redis)
```java
redisTemplate.opsForValue().set("OTP:REG:" + phone, code, 5, TimeUnit.MINUTES);
```

### Rate Limiting
- 1 SMS/minute, max 3-5 SMS/day per phone
- 3-5 failed verification attempts per OTP (then delete + block)
- Use Bucket4j with Redis for distributed limiting

### MFA Strategy
- **SMS OTP:** Registration, login verification
- **TOTP (Google Auth/Authy):** Sensitive operations (transactions, PIN change)

---

## 5. JWT + OAuth2 Setup

### Token Structure
- **Access Token:** 15-minute expiry, contains user_id, phone, roles
- **Refresh Token:** 7-day expiry, stored in Redis with user_id mapping

### Spring Security Configuration
```java
@Configuration
@EnableResourceServer
public class ResourceServerConfig {
    // Validate JWT signature, check expiration, extract claims
    // Stateless session with Redis backing for logout/blacklist
}
```

### Session Management
- BR-SEC-04: 15-minute inactivity timeout
- Last-activity tracking in Redis per session_id
- Invalidate on logout (add JWT to blacklist in Redis)

---

## 6. Key Domain Entities

```
User (aggregate root)
├── phoneNumber: String (unique)
├── status: AccountStatus (PENDING|ACTIVE|SUSPENDED)
├── fullName, email, createdAt
├── 1:1 KYCSubmission
├── 1:1 TransactionPin
└── 1:N BankAccount (max 2)

KYCSubmission
├── cccdNumber, frontImageUrl, backImageUrl
├── status: KYCStatus (SUBMITTED|APPROVED|REJECTED)
├── reviewedAt, adminNotes

BankAccount
├── bankCode, accountNumber (encrypted), accountHolderName
├── linkStatus: BankLinkStatus (LINKED|UNLINKED)
├── linkedAt

TransactionPin
├── hashedPin (Argon2), salt
├── failCount, lockedUntil
```

### State Transitions
- PENDING → ACTIVE (eKYC approved)
- PENDING/ACTIVE → SUSPENDED (admin/system)
- SUSPENDED → ACTIVE (manual review)

---

## 7. Unresolved Questions / Trade-offs

1. **Biometric Storage:** Where to store FaceID templates - on-device or server? Server enables cross-device but raises privacy/compliance concerns.

2. **eKYC OCR Provider:** FPT.AI vs VNPT vs self-hosted Tesseract - accuracy vs cost vs data privacy trade-off.

3. **PCI DSS Scope:** PIN storage (AES-256) - will require annual PCI DSS assessment. Consider using tokenization vault (Stripe/Braintree) to reduce scope.

4. **Bank API Availability:** VCB/TCB Open Banking APIs - production availability and SLA? May need mock for initial development.

5. **gRPC vs REST:** Internal service communication - gRPC benefits vs added complexity. Consider REST for now, migrate later if needed.

---

*Report generated: 2026-05-01*
*Research limited by API rate constraints; content supplemented by domain expertise.*