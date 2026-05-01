# Wallet Service Implementation Research Report

**Service:** wallet-service (MomoGo)
**Tech Stack:** Java Spring Boot, PostgreSQL, Redis, REST API/gRPC, JWT+OAuth2
**Date:** 2026-05-01

---

## 1. Ledger/Double-Entry Pattern

**Recommendation:** Implement a financial ledger with two-entry accounting for audit trail integrity.

**Approach:**
- `Wallet` entity has `availableBalance` and `pendingBalance` (ISO 4217 VND cents)
- `Transaction` entity records: `transactionId`, `type` (DEPOSIT/WITHDRAW/P2P/QR), `amount`, `status` (PENDING/COMPLETED/FAILED/REVERSED), `referenceId`, `idempotencyKey`, `createdAt`
- Each transaction creates two ledger entries: DEBIT and CREDIT to `wallet_accounts` table
- `wallet_accounts`: `accountId`, `walletId`, `entryType` (DEBIT/CREDIT), `amount`, `transactionId`, `createdAt`

**Benefits:**
- Immutable audit log; no balance updates, only new entries
- Enables historical reconstruction and reconciliation
- Supports reversal transactions (negative amount entries)

**Trade-off:** Higher storage cost, more complex queries for balance. Mitigation: Materialized view or trigger aggregates balance into `Wallet.availableBalance`.

---

## 2. QR Code Generation Library

**Recommendation:** Use **ZXing** (zebra crossing) over QrCode4j.

**Rationale:**
- ZXing is mature (2008+), multi-format 2D barcode library
- `javase` module provides `MatrixToImageWriter` for QR generation
- No Android dependency; pure Java SE works in Spring Boot
- QrCode4j is less maintained; limited Spring integration

**Maven Dependency:**
```xml
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>javase</artifactId>
    <version>3.5.3</version>
</dependency>
```

**Usage:**
```java
QRCodeWriter writer = new QRCodeWriter();
BitMatrix bitMatrix = writer.encode(walletId, BarcodeFormat.QR_CODE, 300, 300);
MatrixToImageWriter.writeToPath(bitMatrix, "PNG", qrPath);
```

**QR Payload for MomoGo:** Encode `momogo://pay/{walletId}?ref={transactionId}` for scan-and-pay flow. Static QR expires after 30 days (BR-QR-03).

---

## 3. Idempotency for Financial Transactions

**Recommendation:** Use `idempotencyKey` (client-generated UUID) stored in `idempotency_records` table.

**Design:**
```sql
CREATE TABLE idempotency_records (
    idempotency_key VARCHAR(64) PRIMARY KEY,
    request_hash VARCHAR(64) NOT NULL,
    response_body TEXT,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);
```
- `request_hash` prevents parameter tampering
- `expires_at` for cleanup (e.g., 24h for financial ops)
- On duplicate key: return cached `response_body` with HTTP 200

**Key for P2P:** Combined idempotency key from sender + reference to prevent double debit.

---

## 4. Concurrency Handling (Balance Locking)

**Recommendation:** Hybrid approach — **optimistic locking** for reads, **pessimistic locking** for fund movements.

**Optimistic Locking (JPA @Version):**
```java
@Entity
public class Wallet {
    @Version Long version;
    Long availableBalance;
    Long pendingBalance;
}
```
- Good for read-heavy, low-contention scenarios
- Throw `OptimisticLockException` → retry with exponential backoff

**Pessimistic Locking (SELECT FOR UPDATE):**
```java
@Query("SELECT w FROM Wallet w WHERE w.id = :id FOR UPDATE")
Optional<Wallet> findByIdWithLock(Long id);
```
- Use for DEPOSIT/WITHDRAW/P2P critical sections
- Wrap in `@Transactional(propagation = REQUIRES_NEW)` for independent lock scope

**Redis Distributed Lock (Redisson):**
- For cross-service coordination (e.g., preventing double-spend across instances)
- `RLock` with 30s TTL, auto-renewal
- Combine with DB-level constraints for financial safety

---

## 5. Transactional Outbox Pattern

**Recommendation:** Implement outbox pattern to guarantee event publishing.

**Design:**
```sql
CREATE TABLE outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(50),
    aggregate_id VARCHAR(64),
    event_type VARCHAR(100),
    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING'
);
```

**Flow:**
1. Business transaction writes to `transactions` + `outbox_events` in same DB transaction
2. `OutboxRelay` (scheduled task or CDC via Debezium) polls `outbox_events WHERE status = 'PENDING'`
3. Publishes to message broker (Kafka/RabbitMQ)
4. Marks `status = 'PUBLISHED'`

**Trade-offs:**
- **Polling publisher:** Simple, but slight delay (seconds)
- **CDC/Debezium:** Near real-time, more operational complexity
- **Eventuate Tram:** Framework support if team accepts dependency

---

## 6. Daily Limit Tracking Approach

**Recommendation:** Redis sorted set for real-time limits; nightly batch reconciliation with PostgreSQL.

**Redis Design (Sorted Set):**
```
Key: limit:{walletId}:deposit:{yyyyMMdd}
Score: timestamp (millis)
Member: transactionId
```
- `ZADD` to add each transaction
- `ZCOUNT` to sum amounts within date range (use members as JSON `{txId: amount}`)
- Or use `ZINCRBY` with amount as score; `ZRANGEBYSCORE` for window sum

**Alternative (Redis Counter with TTL):**
```
INCRBY limit:{walletId}:deposit:daily:{yyyyMMdd} {amount}
EXPIRE 86400
```
- Simpler, but harder to track individual transactions

**Hybrid Approach:**
- Redis: Fast check before transaction (within 2ms SLA)
- PostgreSQL: Nightly aggregation job reconciles; triggers alert on drift > 1%
- Action: If daily deposit sum > 500M VND, reject new deposit (BR-WAL-04)

**Performance:** Redis ZCOUNT with 1k entries ≈ 0.1ms; easily handles 10k TPS.

---

## 7. Domain Entities and Relationships

```
User (1) ----< (1) Wallet
Wallet (1) ----< (N) Transaction
Wallet (1) ----< (N) LedgerEntry
Wallet (1) ----< (N) OutboxEvent
Transaction (1) ----< (2) LedgerEntry (DEBIT + CREDIT)
BankAccount (N) ----< (1) Wallet (linked)
Wallet (1) ----< (N) DailyLimitSnapshot
```

**Core Entities:**

| Entity | Key Fields | Notes |
|--------|------------|-------|
| `Wallet` | id, userId, availableBalance, pendingBalance, status, version | eKYC required before bank link |
| `Transaction` | id, walletId, type, amount, status, idempotencyKey, referenceId, createdAt | All financial ops flow here |
| `LedgerEntry` | id, transactionId, walletId, entryType, amount | Immutable append-only |
| `BankAccount` | id, walletId, bankCode, accountNumber, status | BR-WAL-01: eKYC gate |
| `DailyLimit` | walletId, limitType, amount, resetAt | Aggregate tracked via Redis + DB |
| `QRCode` | id, walletId, qrType, referenceId, expiresAt | BR-QR-03: 30-day expiry |

---

## 8. Unresolved Questions / Trade-offs

| # | Question | Trade-off | Recommended Action |
|---|----------|-----------|-------------------|
| 1 | **Pessimistic lock scope** | Row-level (`FOR UPDATE`) vs table-level | Row-level; monitor lock wait time |
| 2 | **Outbox relay frequency** | Polling (1s delay) vs CDC (complexity) | Start with polling; migrate to Debezium if SLA requires <500ms |
| 3 | **Redis vs DB for limits** | Redis speed vs DB consistency | Hybrid; Redis for checks, DB for reconciliation |
| 4 | **QR expiration cron job** | On-read expiry check vs scheduled cleanup | On-read check simpler; no background job needed |
| 5 | **Pending withdrawal timeout** | Auto-cancel after X hours vs manual retry | Configurable; start with 24h auto-cancel (BR-WAL-08) |
| 6 | **gRPC vs REST for internal calls** | gRPC perf vs REST simplicity | REST for external; gRPC for wallet-to-payment-service internal |
| 7 | **Reversal handling** | Compensation vs double-entry reversal | Double-entry reversal (negative entries) keeps audit clean |
| 8 | **PIN verification frequency** | Per-transaction vs session-based | Per-transaction for financial ops (BR-SEC-02) |

---

## Summary

| Area | Recommendation |
|------|----------------|
| Ledger | Double-entry append-only with materialized balance |
| QR Lib | ZXing javase 3.5.3 |
| Idempotency | `idempotencyKey` + request hash in dedicated table |
| Concurrency | Optimistic (`@Version`) + pessimistic (`FOR UPDATE`) + Redis `RLock` |
| Outbox | Polling outbox table → Kafka; Eventuate Tram optional |
| Daily Limits | Redis sorted set (real-time) + PostgreSQL (nightly reconcile) |
| Entities | Wallet, Transaction, LedgerEntry, BankAccount, QRCode, DailyLimitSnapshot |
