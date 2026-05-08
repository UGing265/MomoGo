# Phase 02: Wallet Service - Code-First Entities

## Overview

**Priority:** P1 (High)
**Status:** Completed
**Effort:** 1h

Create Java JPA entities for wallet-service that will generate SQL migrations.

## Requirements

### Entities to Create

1. **Wallet** (`domain/entity/Wallet.java`)
   - id (UUID, PK)
   - userId (UUID) - No FK to external DB
   - availableBalance (BIGINT)
   - pendingBalance (BIGINT)
   - status (VARCHAR 20) - ACTIVE, LOCKED, FROZEN
   - currency (VARCHAR 3) - VND
   - version (BIGINT) - optimistic locking
   - createdAt, updatedAt (TIMESTAMP)

2. **Transaction** (`domain/entity/Transaction.java`)
   - id (UUID, PK)
   - senderWalletId (UUID, nullable)
   - receiverWalletId (UUID, nullable)
   - type (VARCHAR 20) - DEPOSIT, WITHDRAW, P2P_IN, P2P_OUT
   - amount (BIGINT)
   - status (VARCHAR 20) - PENDING, COMPLETED, FAILED, REVERSED
   - referenceCode (VARCHAR 100, UNIQUE)
   - description (TEXT)
   - createdAt, completedAt (TIMESTAMP)

3. **QRCode** (`domain/entity/QRCode.java`)
   - id (UUID, PK)
   - walletId (UUID, FK → Wallet)
   - qrType (VARCHAR 10) - STATIC
   - referenceId (VARCHAR 100, UNIQUE)
   - amount (BIGINT, nullable)
   - status (VARCHAR 20) - ACTIVE, EXPIRED, USED
   - expiresAt (TIMESTAMP)
   - createdAt (TIMESTAMP)

## Implementation Steps

1. Create package structure under `wallet-service/src/main/java/com/momogo/wallet/domain/entity/`

2. Write each entity with proper JPA annotations

3. Note: wallets.user_id has NO FK constraint - cross-DB reference handled in application logic

## Important Note

**No FK to users table** - wallet_db and user_db are separate databases. The FK reference in current migration will cause issues. Entity will NOT have @ManyToOne to User.

## Todo List

- [ ] Create Wallet entity (no user FK)
- [ ] Create Transaction entity
- [ ] Create QRCode entity
- [ ] Create repository interfaces

## Success Criteria

- All entities compile without errors
- SQL can be generated from entities
- No cross-DB FK constraints

## Next Steps

Phase 03 depends on this phase completing.