# Phase 03: wallet-service Core

## Context Links

- SRS: `D:\AShiroru\ProgramCode\Project\Team\MomoGo\docs\srs.md`
- Research: `research/researcher-wallet-service-report.md`
- Phase 01: `phase-01-project-setup.md`

## Overview

- **Priority:** P1 (Critical)
- **Status:** pending
- **Description:** Implement wallet-service core: wallet management, deposit/withdraw, P2P transfers, QR code generation/scanning, daily limit tracking, and idempotency via Redis.

## Key Insights from Research

1. **Wallet Balance:** Available + pending balance tracked directly on wallet record
2. **Concurrency:** Optimistic locking (@Version) on wallet for reads; DB-level locking for fund movements
3. **Idempotency:** Handled via Redis TTL (app layer) — no DB table needed
4. **Outbox Pattern:** Deferred — wallet operations atomic within single DB transaction
5. **Daily Limits:** Redis sorted set for real-time tracking, PostgreSQL nightly reconciliation
6. **QR Generation:** ZXing javase 3.5.3; payload format: momogo://pay/{walletId}
7. **QR payments are P2P_OUT** — QR scan just initiates a P2P transfer

## Requirements

### Functional (FR-USR-03, FR-USR-04, FR-USR-05)

1. **Wallet Operations (FR-USR-03)**
   - Deposit from linked bank account (min 10K, max 100M/transaction, 500M/day)
   - Withdraw to linked bank account (min 20K, max 50M/transaction, 200M/day)
   - Balance inquiry (available + pending)
   - BR-WAL-01: eKYC approval required before operations

2. **P2P Transfer (FR-USR-04)**
   - Transfer by phone number (min 1K, max 50M/transaction, 100M/day)
   - Real-time debit/credit
   - BR-P2P-04: Cannot transfer to self
   - BR-P2P-05: Recipient must have active wallet

3. **QR Code Payment (FR-USR-05)**
   - Generate personal static QR (expires 30 days)
   - Scan QR to pay
   - BR-QR-02: Static QR requires manual amount entry

4. **Transaction History (FR-USR-04.2)**
   - View past transactions
   - Filter by date range, type

### Non-Functional

- P2P transfer response: <= 3 seconds
- QR payment response: <= 2 seconds
- Daily limit checks: <= 2ms (Redis)
- Idempotency: prevent double-spend
- Optimistic + pessimistic locking for balance updates

## Domain Entities

```
Wallet (aggregate root)
├── id: UUID
├── userId: UUID (unique)
├── availableBalance: Long (VND cents)
├── pendingBalance: Long (VND cents)
├── status: WalletStatus (ACTIVE|LOCKED|FROZEN)
├── version: Long (optimistic locking)
├── createdAt, updatedAt
└── transactions: List<Transaction> (1:N)

Transaction
├── id: UUID
├── senderWalletId: UUID (FK, nullable - null for deposits)
├── receiverWalletId: UUID (FK, nullable - null for withdrawals)
├── type: TransactionType (DEPOSIT|WITHDRAW|P2P_IN|P2P_OUT)
├── amount: Long (VND cents)
├── status: TransactionStatus (PENDING|COMPLETED|FAILED|REVERSED)
├── referenceCode: String (external reference)
├── description: String
├── createdAt, completedAt

QRCode
├── id: UUID
├── walletId: UUID (FK)
├── qrType: QRType (STATIC|DYNAMIC)
├── referenceId: String
├── amount: Long (for DYNAMIC)
├── expiresAt: Instant
├── status: QRStatus (ACTIVE|EXPIRED|USED)
└── createdAt
```

## Application Layer (Use Cases)

```
DepositUseCase
├── Input: userId, bankAccountId, amount
├── Output: DepositResult
└── Steps: validate limits, lock wallet, verify bank balance, create transaction, update wallet balance

WithdrawUseCase
├── Input: userId, bankAccountId, amount, pin
├── Output: WithdrawResult
└── Steps: validate PIN, check limits, lock wallet, create pending withdrawal, execute bank withdrawal, complete transaction

P2PTransferUseCase
├── Input: senderId, recipientPhone, amount, pin
├── Output: P2PTransferResult
└── Steps: validate PIN, check limits, lock both wallets, debit sender, credit recipient

GenerateQRUseCase
├── Input: userId, amount (optional for dynamic)
├── Output: QRCodeResult
└── Steps: generate UUID reference, create QR record, return QR data URI (ZXing)

ScanQRPayUseCase
├── Input: userId, qrReferenceId, amount, pin
├── Output: QRPaysResult
└── Steps: validate QR, validate amount, verify PIN, debit user, credit QR owner wallet

GetBalanceUseCase
├── Input: userId
├── Output: BalanceResult (available, pending)
└── Steps: fetch wallet, return balances

GetHistoryUseCase
├── Input: userId, filter (type, dateFrom, dateTo, page, size)
├── Output: Page<TransactionSummary>
└── Steps: query transactions with filters
```

## Infrastructure Components

```
Repositories (JPA)
├── JpaWalletRepository (with FOR UPDATE lock)
├── JpaTransactionRepository
└── JpaQRCodeRepository

Services
├── DailyLimitTracker (Redis sorted set)
├── IdempotencyService (Redis TTL)
└── QRCodeGenerator (ZXing)
```

## Presentation Layer

```
REST Controllers
├── WalletController (GET /api/v1/wallet/balance, GET /api/v1/wallet/history)
├── PaymentController (POST /api/v1/payments/deposit, POST /api/v1/payments/withdraw, POST /api/v1/payments/p2p)
└── QrController (POST /api/v1/qr/generate, POST /api/v1/qr/scan)
```

## Concurrency Strategy

```java
// Optimistic Locking (for reads)
@Version
private Long version;

// Pessimistic Locking (for fund movements)
@Query("SELECT w FROM Wallet w WHERE w.id = :id FOR UPDATE")
Optional<Wallet> findByIdWithLock(Long id);

// Redis Distributed Lock (for P2P - prevents double-spend across instances)
RLock lock = redissonClient.getLock("p2p:" + senderId);
lock.tryLock(30, 30, TimeUnit.SECONDS);
```

## Idempotency Implementation

```java
// 1. Check idempotency record
Optional<IdempotencyRecord> record = idempotencyRepository.findById(idempotencyKey);
if (record.isPresent() && record.get().getStatus() == COMPLETED) {
    return cachedResponse(record.get());
}

// 2. Create pending record
idempotencyRepository.save(new IdempotencyRecord(idempotencyKey, requestHash, PROCESSING));

// 3. Execute transaction
try {
    // business logic
    record.updateStatus(COMPLETED, response);
} catch (Exception e) {
    record.updateStatus(FAILED, null);
    throw e;
}
```

## Daily Limit Tracking (Redis)

```
Key: limit:{walletId}:deposit:{yyyyMMdd}
Score: timestamp (for expiration)
Member: transactionId:amount (JSON)

Operations:
- ZADD limit:{walletId}:deposit:20260501 {"tx123":50000000}
- ZCOUNT limit:{walletId}:deposit:20260501 -inf +inf (total count)
- ZREMRANGEBYSCORE for cleanup
```

## Implementation Steps

1. **Domain Entities**
   - Create Wallet, Transaction, QRCode entities
   - Add optimistic locking (@Version) to Wallet
   - Implement domain events for balance changes

2. **Repository Interfaces (Domain)**
   - Define repository interfaces
   - Custom query for findByUserId with lock

3. **Use Cases (Application Layer)**
   - Implement all use cases with idempotency checks (Redis)
   - Business rule enforcement (limits, self-transfer prevention)
   - Outbox event creation (deferred)

4. **Repository Implementations**
   - JPA repositories with pessimistic locking query
   - Ledger entry aggregation for balance

5. **Daily Limit Tracker**
   - Redis sorted set implementation
   - Limit checking before transactions
   - Scheduled reconciliation job

6. **QR Code Service**
   - ZXing integration for QR generation
   - QR payload format: momogo://pay/{walletId}?ref={qrId}
   - On-read expiration check (BR-QR-03: 30 days)

7. **Outbox Publisher** (Deferred to Phase 04)
   - Outbox pattern documented but not implemented in MVP
   - Future: scheduled polling of pending events, publish to message broker

8. **REST Controllers**
   - Request/Response DTOs with validation
   - Pagination for transaction history
   - Global exception handling

9. **Concurrency Control**
   - Pessimistic locking for deposit/withdraw/p2p
   - Redis distributed lock for cross-instance P2P
   - Retry with exponential backoff for OptimisticLockException

## Todo List

- [ ] Create domain entities (Wallet, Transaction, QRCode)
- [ ] Define repository interfaces with custom queries
- [ ] Implement DepositUseCase with Redis idempotency
- [ ] Implement WithdrawUseCase with Redis idempotency
- [ ] Implement P2PTransferUseCase with distributed lock
- [ ] Implement GenerateQRUseCase (ZXing)
- [ ] Implement ScanQRPayUseCase (uses P2P_OUT internally)
- [ ] Implement GetBalanceUseCase and GetHistoryUseCase
- [ ] Create JPA repository implementations with pessimistic locking
- [ ] Create DailyLimitTracker (Redis sorted set)
- [ ] Create IdempotencyService (Redis TTL)
- [ ] Create REST controllers
- [ ] Add global exception handler
- [ ] Write unit tests for use cases with concurrency tests

## Success Criteria

1. Deposit creates transaction and updates wallet balance (no ledger entries)
2. Withdrawal validates PIN and limits before execution
3. P2P transfer atomically debit sender and credit recipient
4. QR generation returns valid QR code (ZXing, momogo:// format)
5. QR scan and pay validates amount and authenticates
6. Idempotency prevents duplicate transactions on retry
7. Daily limits enforced via Redis (<=2ms check)
8. Unit tests pass including concurrency scenarios
9. Event publishing (Outbox) deferred to Phase 04+

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Double-spend | Low | Critical | Distributed lock + DB constraints |
| Optimistic lock conflict | Medium | Low | Retry with exponential backoff |
| Redis unavailable for limits | Low | Medium | Fall back to DB with degraded performance |
| Outbox event loss | Low | High | Polling with acknowledgment |

## Security Considerations

- **PIN Verification:** Required for all financial operations (BR-SEC-02)
- **Amount Validation:** Server-side validation of all amounts
- **Idempotency:** Client-provided key prevents replay attacks
- **Audit Trail:** Transaction records with timestamps for all balance changes
- **QR Security:** Signed payload to prevent QR forgery

## Next Steps

- Phase 04: Integration (after both user-service and wallet-service core complete)
- Phase 05: Admin & Reconciliation (can run parallel with Phase 04)