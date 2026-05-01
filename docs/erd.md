# MomoGo - Entity Relationship Diagram (ERD)

**Version:** 1.0
**Date:** 2026-05-01
**Status:** Draft

---

## Database Split per Microservice

| Database | Service | Schema |
|----------|---------|--------|
| `user_db` | user-service | users, kyc_submissions, bank_accounts, transaction_pins, admin_users |
| `wallet_db` | wallet-service | wallets, transactions, ledger_entries, qr_codes, idempotency_records |

---

## user_db (user-service)

### Table: users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | User identifier |
| phone_number | VARCHAR(15) | UNIQUE, NOT NULL | Primary identifier (BR-ACC-01) |
| email | VARCHAR(255) | UNIQUE | Optional email |
| full_name | VARCHAR(255) | NOT NULL | Full name from KYC |
| password_hash | VARCHAR(255) | NOT NULL | BCrypt/Argon2 login password |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | PENDING → ACTIVE → SUSPENDED (BR-ACC-02) |
| kyc_status | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | PENDING → APPROVED → REJECTED |
| created_at | TIMESTAMP | NOT NULL | Account creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes:** `idx_users_phone` on phone_number, `idx_users_status` on status

---

### Table: kyc_submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | KYC submission identifier |
| user_id | UUID | FK → users.id, UNIQUE | One KYC per user |
| cccd_number | VARCHAR(50) | NOT NULL | Encrypted CCCD number |
| document_type | VARCHAR(20) | NOT NULL, DEFAULT 'CCCD' | ID_CARD, PASSPORT |
| front_image_url | VARCHAR(500) | NOT NULL | S3/MinIO URL |
| back_image_url | VARCHAR(500) | NOT NULL | S3/MinIO URL |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'SUBMITTED' | SUBMITTED → APPROVED → REJECTED |
| submitted_at | TIMESTAMP | NOT NULL | Submission time |
| reviewed_at | TIMESTAMP | NULL | Review completion time |
| admin_notes | TEXT | NULL | Rejection reason or notes |

**Indexes:** `idx_kyc_status` on status, `idx_kyc_submitted_at` on submitted_at

---

### Table: transaction_pins

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | PIN record identifier |
| user_id | UUID | FK → users.id, UNIQUE | One PIN per user |
| hashed_pin | VARCHAR(255) | NOT NULL | Argon2 hashed PIN |
| salt | VARCHAR(64) | NOT NULL | Unique salt per user |
| fail_count | INTEGER | NOT NULL, DEFAULT 0 | Consecutive wrong attempts |
| locked_until | TIMESTAMP | NULL | Lockout expiry (BR-SEC-01: 5 attempts) |
| created_at | TIMESTAMP | NOT NULL | PIN set time |
| updated_at | TIMESTAMP | NOT NULL | Last change time |

---

### Table: linked_banks

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Bank link identifier |
| user_id | UUID | FK → users.id, NOT NULL | Owner |
| bank_code | VARCHAR(10) | NOT NULL | VCB (Vietcombank), TCB (Techcombank) |
| account_token | VARCHAR(500) | NOT NULL | Tokenized account number (PCI DSS) |
| account_holder_name | VARCHAR(255) | NOT NULL | Name on account |
| last_four_digits | VARCHAR(4) | NOT NULL | Last 4 digits for display |
| link_status | VARCHAR(20) | NOT NULL, DEFAULT 'LINKED' | LINKED, UNLINKED |
| verified_at | TIMESTAMP | NULL | When bank verified ownership |
| linked_at | TIMESTAMP | NOT NULL | Link creation time |
| unlinked_at | TIMESTAMP | NULL | Unlink time |

**Indexes:** `idx_linked_banks_user` on user_id, `idx_linked_banks_status` on link_status

**Constraint:** Max 2 linked banks per user (BR-ACC-04) — enforced in application layer

---

### Table: admin_users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Admin identifier |
| username | VARCHAR(100) | UNIQUE, NOT NULL | Login username |
| password_hash | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| role | VARCHAR(20) | NOT NULL | SUPER, REVIEWER, VIEWER |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | ACTIVE, SUSPENDED |
| created_at | TIMESTAMP | NOT NULL | Account creation time |

---

## wallet_db (wallet-service)

### Table: wallets

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Wallet identifier |
| user_id | UUID | FK → users.id, UNIQUE | One wallet per user |
| available_balance | BIGINT | NOT NULL, DEFAULT 0 | Available balance in VND cents |
| pending_balance | BIGINT | NOT NULL, DEFAULT 0 | Pending transactions in VND cents |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | ACTIVE, LOCKED, FROZEN |
| currency | VARCHAR(3) | NOT NULL, DEFAULT 'VND' | Single currency (VND) for MVP |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |
| version | BIGINT | NOT NULL, DEFAULT 0 | Optimistic locking |

**Indexes:** `idx_wallets_user` on user_id, `idx_wallets_status` on status

---

### Table: transactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Transaction identifier |
| sender_wallet_id | UUID | FK → wallets.id, NULL | NULL for deposits |
| receiver_wallet_id | UUID | FK → wallets.id, NULL | NULL for withdrawals |
| type | VARCHAR(20) | NOT NULL | DEPOSIT, WITHDRAW, P2P_IN, P2P_OUT, QR_PAY |
| amount | BIGINT | NOT NULL | Amount in VND cents |
| status | VARCHAR(20) | NOT NULL | PENDING, COMPLETED, FAILED, REVERSED |
| reference_code | VARCHAR(100) | UNIQUE | QR ID or external reference |
| description | TEXT | NULL | Optional description |
| idempotency_key | VARCHAR(100) | UNIQUE, NULL | Client-provided key |
| created_at | TIMESTAMP | NOT NULL | Transaction time |
| completed_at | TIMESTAMP | NULL | Completion time |

**Indexes:** `idx_tx_sender` on sender_wallet_id, `idx_tx_receiver` on receiver_wallet_id, `idx_tx_status` on status, `idx_tx_created` on created_at, `idx_tx_idem` on idempotency_key

---

### Table: ledger_entries

Double-entry bookkeeping — every financial transaction creates exactly 2 entries (DEBIT + CREDIT).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Entry identifier |
| transaction_id | UUID | FK → transactions.id, NOT NULL | Parent transaction |
| wallet_id | UUID | FK → wallets.id, NOT NULL | Affected wallet |
| entry_type | VARCHAR(10) | NOT NULL | DEBIT, CREDIT |
| amount | BIGINT | NOT NULL | Amount in VND cents |
| balance_after | BIGINT | NOT NULL | Wallet balance after this entry |
| created_at | TIMESTAMP | NOT NULL | Entry creation time |

**Indexes:** `idx_ledger_tx` on transaction_id, `idx_ledger_wallet` on wallet_id

---

### Table: qr_codes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | QR code identifier |
| wallet_id | UUID | FK → wallets.id, NOT NULL | Owner wallet |
| qr_type | VARCHAR(10) | NOT NULL | STATIC (MVP: dynamic deferred) |
| reference_id | VARCHAR(100) | UNIQUE, NOT NULL | Unique reference for QR payload |
| amount | BIGINT | NULL | Fixed amount (for future dynamic QR) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | ACTIVE, EXPIRED, USED |
| expires_at | TIMESTAMP | NOT NULL | 30-day expiry (BR-QR-03) |
| created_at | TIMESTAMP | NOT NULL | Creation time |

**Indexes:** `idx_qr_reference` on reference_id, `idx_qr_status` on status, `idx_qr_expires` on expires_at

---

### Table: idempotency_records

Prevents duplicate financial operations on retry.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| idempotency_key | VARCHAR(100) | PK | Client-provided key |
| request_hash | VARCHAR(64) | NOT NULL | SHA-256 of request body |
| response_body | TEXT | NULL | Cached response |
| status | VARCHAR(20) | NOT NULL | PROCESSING, COMPLETED, FAILED |
| created_at | TIMESTAMP | NOT NULL | Record creation |
| expires_at | TIMESTAMP | NOT NULL | Auto-cleanup (24h) |

---

## Relationship Diagram

```
user_db (user-service)                              wallet_db (wallet-service)
┌─────────────────────┐                    ┌─────────────────────┐
│       users         │                    │      wallets         │
│ ─────────────────── │                    │ ─────────────────── │
│ PK id (UUID)        │◄──────────────┐    │ PK id (UUID)        │
│    phone_number     │               │    │ FK user_id (UUID) ──┘
│    email            │               │    │    available_balance│
│    full_name        │               │    │    pending_balance  │
│    status           │               │    │    status           │
│    kyc_status       │               │    │    version          │
└─────────┬───────────┘               │    └─────────┬───────────┘
          │                           │              │
          │ 1:1                       │              │ 1:N
          ▼                           │              ▼
┌─────────────────────┐               │    ┌─────────────────────┐
│  transaction_pins   │               │    │    transactions      │
│ ─────────────────── │               │    │ ─────────────────── │
│ PK id (UUID)        │               │    │ PK id (UUID)        │
│ FK user_id (UUID) ──┘               │    │ FK sender_wallet_id  │──┐
│    hashed_pin       │               │    │ FK receiver_wallet_id│──┘
│    fail_count       │               │    │    type              │
└─────────────────────┘               │    │    amount            │
                                      │    │    status            │
          │                           │    │    idempotency_key   │
          │ 1:1                       │    └──────────┬──────────┘
          ▼                           │               │
┌─────────────────────┐               │               │ 1:N (each tx → 2 entries)
│   kyc_submissions   │               │               ▼
│ ─────────────────── │               │    ┌─────────────────────┐
│ PK id (UUID)        │               │    │   ledger_entries    │
│ FK user_id (UUID) ──┘               │    │ ─────────────────── │
│    cccd_number      │               │    │ PK id (UUID)        │
│    front_image_url  │               │    │ FK transaction_id   │
│    back_image_url    │               │    │ FK wallet_id        │
│    status           │               │    │    entry_type       │
└─────────────────────┘               │    │    amount            │
                                      │    │    balance_after     │
          │                           │    └─────────────────────┘
          │ 1:N                       │
          ▼                           │
┌─────────────────────┐               │    ┌─────────────────────┐
│    linked_banks      │               │    │     qr_codes         │
│ ─────────────────── │               │    │ ─────────────────── │
│ PK id (UUID)        │               │    │ PK id (UUID)        │
│ FK user_id (UUID) ──┘               │    │ FK wallet_id (UUID)  │
│    bank_code        │               │    │    reference_id      │
│    account_token    │               │    │    status            │
│    link_status      │               │    │    expires_at       │
└─────────────────────┘               │    └─────────────────────┘
                                      │
┌─────────────────────┐               │    ┌─────────────────────┐
│    admin_users      │               │    │ idempotency_records │
│ ─────────────────── │               │    │ ─────────────────── │
│ PK id (UUID)        │               │    │ PK idempotency_key  │
│    username         │               │    │    request_hash     │
│    password_hash    │               │    │    status           │
│    role             │               │    │    expires_at       │
└─────────────────────┘               │    └─────────────────────┘
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| UUID for all PKs | Better for distributed systems than auto-increment |
| BIGINT for amounts (VND cents) | Avoids floating-point precision issues |
| Separate ledger_entries table | Double-entry pattern for audit integrity |
| account_token (not raw account number) | PCI DSS compliance |
| idem_key UNIQUE NULL | Only financial ops use idempotency |
| version column on wallets | Optimistic locking for concurrency |
| One wallet per user (VND only) | MVP scope — multi-currency deferred |

---

## Migration File Locations (Flyway)

| Database | Migration Path |
|----------|---------------|
| user_db | `user-service/src/main/resources/db/migration/V1__create_user_schema.sql` |
| wallet_db | `wallet-service/src/main/resources/db/migration/V1__create_wallet_schema.sql` |