# Phase 02: user-service Core

## Context Links

- SRS: `D:\AShiroru\ProgramCode\Project\Team\MomoGo\docs\srs.md`
- Research: `research/researcher-user-service-report.md`
- Phase 01: `phase-01-project-setup.md`

## Overview

- **Priority:** P1 (Critical)
- **Status:** pending
- **Description:** Implement core user-service functionality: User registration, eKYC submission, bank account linking, OTP/SMS authentication, JWT/OAuth2, and admin KYC approval.

## Key Insights from Research

1. **CCCD Validation:** 12-digit format with province codes and gender/century indicators
2. **Bank Adapter Pattern:** VietcombankAdapter and TechcombankAdapter implementing BankAdapter interface with circuit breaker
3. **OTP Flow:** Redis storage with 5-minute TTL, rate limited (1/min, max 5/day)
4. **JWT Structure:** 15-minute access token, 7-day refresh token in Redis
5. **eKYC Pipeline:** S3 image upload -> OCR API -> Manual review queue
6. **State Machine:** PENDING -> ACTIVE (eKYC approved) -> SUSPENDED

## Requirements

### Functional (FR-USR-01, FR-USR-02, FR-USR-06 + Admin)

1. **Registration (FR-USR-01.1)**
   - Phone number as unique identifier
   - OTP verification before account creation
   - Initial status: PENDING

2. **eKYC (FR-USR-01.2)**
   - Front/back CCCD image upload to S3 (or local MinIO)
   - **No OCR in MVP** — CCCD info entered manually by user + image for admin review
   - Admin manually reviews image + info match
   - CCCD format validation (12 digits) — done by admin, not OCR
   - Admin approval queue with 24h SLA tracking

3. **Bank Linking (FR-USR-02)**
   - Link up to 2 bank accounts per user
   - Bank API verification of ownership
   - BR-WAL-01: eKYC must be approved first
   - BR-ACC-03: Unlink only when wallet balance = 0
   - BR-ACC-04: Max 2 bank accounts

4. **Authentication (FR-USR-06)**
   - SMS OTP for registration/login
   - Transaction PIN (Argon2 hashed)
   - 5 consecutive wrong PIN = lockout (BR-SEC-01)
   - 15-minute inactivity timeout (BR-SEC-04)

5. **Admin Functions**
   - KYC approval queue with 24h SLA
   - Account suspension/reactivation
   - KYC submission review

### Non-Functional

- Session timeout: 15 minutes (BR-SEC-04)
- OTP delivery: < 30 seconds
- eKYC processing: 24h SLA (BR-ADM-01)
- PCI DSS compliance for card data

## Domain Entities

```
User (aggregate root)
├── id: UUID
├── phoneNumber: String (unique)
├── status: AccountStatus (PENDING|ACTIVE|SUSPENDED)
├── fullName, email, createdAt, updatedAt
├── kycSubmission: KYCSubmission (1:1)
├── transactionPin: TransactionPin (1:1)
└── bankAccounts: List<BankAccount> (1:N, max 2)

KYCSubmission
├── id: UUID
├── userId: UUID (FK)
├── cccdNumber: String (encrypted)
├── frontImageUrl: String (S3 key)
├── backImageUrl: String (S3 key)
├── status: KYCStatus (SUBMITTED|APPROVED|REJECTED)
├── submittedAt, reviewedAt
└── adminNotes: String

BankAccount
├── id: UUID
├── userId: UUID (FK)
├── bankCode: String (VCB|TCB)
├── accountNumber: String (encrypted)
├── accountHolderName: String
├── linkStatus: BankLinkStatus (LINKED|UNLINKED)
├── linkedAt
└── unlinkedAt

TransactionPin
├── id: UUID
├── userId: UUID (FK, unique)
├── hashedPin: String (Argon2)
├── salt: String
├── failCount: Integer (default 0)
└── lockedUntil: Instant

AdminUser
├── id: UUID
├── username: String (unique)
├── passwordHash: String
├── role: AdminRole (SUPER|REVIEWER|VIEWER)
└── createdAt
```

## Application Layer (Use Cases)

```
RegisterUserUseCase
├── Input: phoneNumber
├── Output: UserRegistrationResult
└── Steps: validate phone, send OTP, create user (PENDING)

SubmitKycUseCase
├── Input: userId, cccdNumber, frontImage, backImage
├── Output: KYCSubmissionResult
└── Steps: validate cccdNumber (12 digits), upload images to S3, create submission (MANUAL REVIEW - no OCR)

ApproveKycUseCase
├── Input: kycId, adminId, approved, notes
├── Output: KYCApprovalResult
└── Steps: validate admin, update status, activate user if approved

LinkBankUseCase
├── Input: userId, bankCode, accountNumber, accountHolderName
├── Output: BankLinkResult
└── Steps: verify eKYC, call bank API, create bank account record

UnlinkBankUseCase
├── Input: userId, bankAccountId
├── Output: BankUnlinkResult
└── Steps: verify balance=0, call bank API unlink, update status

LoginUseCase
├── Input: phoneNumber, otpCode
├── Output: AuthTokens (access + refresh)
└── Steps: validate OTP, generate JWT, store refresh token in Redis

VerifyOtpUseCase
├── Input: phoneNumber, otpCode, purpose
├── Output: OtpVerificationResult
└── Steps: check Redis OTP, validate attempts, mark used

SetTransactionPinUseCase
├── Input: userId, newPin, confirmPin
├── Output: PinSetResult
└── Steps: validate match, hash with Argon2, store
```

## Infrastructure Components

```
Repositories (JPA)
├── JpaUserRepository
├── JpaKycSubmissionRepository
├── JpaBankAccountRepository
├── JpaTransactionPinRepository
└── JpaAdminUserRepository

External Adapters
├── S3ImageStorageAdapter (MinIO/AWS S3) - for CCCD images
├── VietcombankAdapter implements BankAdapter
├── TechcombankAdapter implements BankAdapter
├── SmsProviderAdapter (eSMS.vn/SpeedSMS.vn)
└── JwtServiceAdapter

Caching (Redis)
├── OtpCache (OTP:REG:{phone}, 5min TTL)
├── SessionCache (SESSION:{userId}, 15min TTL)
├── JwtBlacklist (JWT:{jti}, until token expiry)
└── RateLimitCache (rate:{phone}, sliding window)
```

## Presentation Layer

```
REST Controllers
├── UserController (POST /api/v1/users/register)
├── KycController (POST /api/v1/kyc/submit, GET /api/v1/kyc/status)
├── BankLinkController (POST /api/v1/bank-links, DELETE /api/v1/bank-links/{id})
├── AuthController (POST /api/v1/auth/login, POST /api/v1/auth/otp)
├── PinController (POST /api/v1/pin/set, POST /api/v1/pin/verify)
└── AdminController (GET /api/v1/admin/kyc/pending, POST /api/v1/admin/kyc/{id}/approve)
```

## Implementation Steps

1. **Domain Entities**
   - Create User, KYCSubmission, BankAccount, TransactionPin, AdminUser entities
   - Implement value objects (PhoneNumber, EncryptedString, Money)
   - Add JPA annotations and constraints
   - Implement domain events for state transitions

2. **Repository Interfaces (Domain)**
   - Define repository interfaces in domain layer
   - Include custom queries (findByPhoneNumber, findByStatus)

3. **Use Cases (Application Layer)**
   - Implement all use cases listed above
   - Input validation with Jakarta Validation
   - Business rule enforcement in use case layer
   - Return result objects, not entities

4. **Repository Implementations (Infrastructure)**
   - JPA repositories with custom queries
   - Transaction management

5. **External Service Adapters**
   - BankAdapter interface + VCB/TCB implementations
   - S3 storage adapter for images
   - SMS provider adapter for OTP
   - OCR adapter (FPT.AI)
   - Resilience4j circuit breaker per bank

6. **Security Configuration**
   - Spring Security with JWT
   - OAuth2 resource server configuration
   - Redis-backed session management
   - Password encoding (Argon2 for admin)

7. **REST Controllers**
   - Request/Response DTOs
   - Input validation
   - Exception handling (global handler)
   - API versioning (/api/v1/)

8. **OTP Service (Infrastructure)**
   - Redis-based OTP storage
   - Rate limiting (Bucket4j)
   - SMS provider integration

## Todo List

- [ ] Create domain entities (User, KYCSubmission, BankAccount, TransactionPin, AdminUser)
- [ ] Define repository interfaces in domain layer
- [ ] Implement RegisterUserUseCase
- [ ] Implement SubmitKycUseCase
- [ ] Implement ApproveKycUseCase
- [ ] Implement LinkBankUseCase and UnlinkBankUseCase
- [ ] Implement LoginUseCase and VerifyOtpUseCase
- [ ] Implement SetTransactionPinUseCase
- [ ] Create JPA repository implementations
- [ ] Create BankAdapter interface with VCB/TCB adapters
- [ ] Create S3 image storage adapter
- [ ] Create OTP service with Redis
- [ ] Create SMS provider adapter
- [ ] Configure Spring Security with JWT
- [ ] Create REST controllers
- [ ] Add global exception handler
- [ ] Write unit tests for use cases

## Success Criteria

1. User can register with phone and receive OTP
2. User can submit eKYC with CCCD images
3. Admin can approve/reject KYC submissions
4. User can link/unlink bank accounts (with business rules enforced)
5. User can login and receive JWT tokens
6. Transaction PIN can be set and verified
7. All business rules enforced per SRS
8. Unit tests pass with >80% coverage on use cases

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Bank API unavailable | Medium | High | Circuit breaker per bank; graceful degradation |
| OCR API failures | Medium | Medium | Manual review fallback; retry logic |
| OTP rate limit abuse | Medium | Medium | Bucket4j rate limiting |
| PCI DSS scope creep | Low | High | Tokenization vault for card data |

## Security Considerations

- **PIN Storage:** Argon2 with unique salt per user
- **CCCD Storage:** AES-256 encryption at rest
- **Card Numbers:** Tokenization, no raw data stored
- **JWT:** 15-min access, 7-day refresh, Redis blacklist
- **Session:** 15-min inactivity timeout
- **Audit:** Log all sensitive operations

## Next Steps

- Phase 03: wallet-service Core implementation (after user-service core completes)
- Phase 04: Integration (after both services core complete)