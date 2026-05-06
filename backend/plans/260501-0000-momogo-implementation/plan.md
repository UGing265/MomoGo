---
title: "MomoGo Payment System Implementation"
description: "Comprehensive implementation plan for MomoGo cashless payment system with user-service and wallet-service"
status: pending
priority: P1
effort: 40h
branch: main
tags: [momogo, payment, spring-boot, microservices, clean-architecture]
created: 2026-05-01
---

# MomoGo Payment System Implementation Plan

## Overview

MomoGo is a cashless payment solution providing digital wallet storage and QR-based payment transactions with direct integration to Vietnamese banking infrastructure (Vietcombank/Techcombank).

## Services Architecture

| Service | Port | Database | Key Responsibilities |
|---------|------|----------|----------------------|
| user-service | 8081 | user_db (PostgreSQL) | Registration, eKYC, Auth, MFA, Bank Linking, Admin |
| wallet-service | 8082 | wallet_db (PostgreSQL) | Wallet, Deposit, Withdraw, P2P, QR, Transaction History |
| api-gateway | 8080 | - | JWT validation, routing, rate limiting |

## Database Schema (after ERD fixes)

### user_db (user-service)
- `users` — phone, email, kyc_status, status
- `kyc_submissions` — CCCD images, manual review status
- `linked_banks` — bank_code, account_token, account_holder_name, verified_at
- `transaction_pins` — hashed PIN with lockout
- `admin_users` — username/password, status only (no role column)

### wallet_db (wallet-service)
- `wallets` — available_balance, pending_balance, version (optimistic lock)
- `transactions` — sender/receiver wallet, type (DEPOSIT/WITHDRAW/P2P_IN/P2P_OUT), amount, status
- `qr_codes` — static QR, expires 30 days

### Idempotency: Handled via Redis TTL (app layer, not DB table)
### Ledger: Removed — transactions table records balance changes directly

## Phase Status

| Phase | Name | Status | Effort |
|-------|------|--------|--------|
| 01 | Project Setup (Folder Structure + Config) | **completed** | 3h |
| 02 | user-service Core | pending | 10h |
| 03 | wallet-service Core | pending | 12h |
| 04 | Integration | pending | 8h |
| 05 | Admin & Reconciliation | pending | 4h |

## Key Dependencies

- PostgreSQL 15+ (user_db, wallet_db)
- Redis (sessions, OTP, rate limiting, daily limits)
- Spring Boot 3.2+ with Java 17+
- Resilience4j for circuit breakers
- ZXing for QR generation

## Security Requirements

- JWT access token: 15-minute expiry
- PIN: Argon2 hashing, 5 attempts lockout
- Card data: AES-256 encryption, tokenization
- Session: 15-minute inactivity timeout
- PCI DSS compliance for card data handling

## Business Rules Summary

- eKYC required before bank linking (BR-WAL-01)
- Max 2 bank accounts per user (BR-ACC-04)
- Bank unlink only when balance = 0 (BR-ACC-03)
- Daily deposit limit: 500M VND (BR-WAL-04)
- Daily withdrawal limit: 200M VND (BR-WAL-07)
- P2P daily limit: 100M VND (BR-P2P-03)
- eKYC review SLA: 24 hours (BR-ADM-01)
- Transactions > 50M VND flagged (BR-ADM-02)

## Validation Log

### Session 1 — 2026-05-01
**Trigger:** Initial plan creation
**Questions asked:** 4

#### Questions & Answers

1. **[eKYC OCR]** eKYC uses OCR to extract CCCD info. Which OCR provider?
   - Options: FPT.AI (Recommended) | VNPT | Self-hosted Tesseract | Manual review only
   - **Answer:** Manual review only
   - **Rationale:** Skip OCR cost/complexity for MVP — admin manually reviews CCCD images

2. **[Architecture]** Project structure for the 4 modules (common, user-service, wallet-service, api-gateway)?
   - Options: Maven multi-module (Recommended) | Separate repositories
   - **Answer:** Maven multi-module (Recommended)
   - **Rationale:** Single repo simplifies CI/CD and dependency management for small team

3. **[Architecture]** user-service ↔ wallet-service communication (for P2P, wallet operations)?
   - Options: REST (Recommended) | gRPC
   - **Answer:** REST (Recommended)
   - **Rationale:** Simpler debugging, HTTP/JSON works well for this scale

4. **[Architecture]** Event publishing between services (for P2P debit/credit, deposit/withdraw events)?
   - Options: Outbox → Kafka (Recommended) | Outbox → RabbitMQ | In-memory events | Skip (MVP)
   - **Answer:** Skip (MVP) — explained in docs
   - **Rationale:** MVP: wallet-service handles within one DB transaction. Events pattern documented for future.

#### Confirmed Decisions
- eKYC: Manual admin review only — no OCR provider integration in MVP
- Project structure: Maven multi-module, single git repo
- Inter-service communication: REST (no gRPC)
- Event publishing: Skipped for MVP — noted as future enhancement in docs
- Outbox pattern: Documented in wallet-service phase but deferred until event-driven needs arise

#### Action Items
- [x] Update Phase 02: Remove OCR adapter, add manual review workflow
- [x] Update Phase 03: Mark outbox as deferred (Phase 04 or later)
- [x] Add "Event Publishing (Future)" section to plan.md for reference

#### Impact on Phases
- Phase 02 (user-service): Remove FptAiOcrAdapter from infrastructure, simplify SubmitKycUseCase
- Phase 03 (wallet-service): Outbox pattern remains in architecture docs but implementation deferred

### Session 2 — 2026-05-04
**Trigger:** ERD review and plan audit

#### Changes Made
1. **Removed `idempotency_records` table** — replaced with Redis TTL at app layer
2. **Removed `ledger_entries` table** — wallet balance updated directly via transactions
3. **Removed `admin_users.role` column** — no RBAC in MVP, status only
4. **Removed `QR_PAY` transaction type** — QR payments use P2P_OUT internally
5. **Added `verified_at`, `account_holder_name` to `linked_banks`** — already in SQL, confirmed matching ERD

#### Schema Summary (updated)
- user_db: users, kyc_submissions, linked_banks, transaction_pins, admin_users
- wallet_db: wallets, transactions, qr_codes
- Idempotency: Redis TTL (no DB table)
- Ledger: removed (transactions record balance changes)

---

## Next Steps

Proceed to [Phase 01: Project Setup](./phase-01-project-setup.md)