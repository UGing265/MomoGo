# Phase 04: P2P Transfer Research & Preparation

## Overview

**Priority:** P1 (High)
**Status:** Pending
**Effort:** 1h

Research and prepare for P2P transfer implementation between wallets.

## Context

P2P (Peer-to-Peer) transfer allows users to send money directly from their wallet to another user's wallet using phone number as identifier.

## Business Rules from SRS

| Rule ID | Description |
|---------|-------------|
| BR-P2P-01 | Minimum P2P transfer: 1,000 VND |
| BR-P2P-02 | Maximum P2P transfer per transaction: 50,000,000 VND |
| BR-P2P-03 | Maximum P2P daily aggregate: 100,000,000 VND |
| BR-P2P-04 | Cannot transfer to self (same phone number) |
| BR-P2P-05 | Recipient must have active wallet account |

## Key Implementation Considerations

### 1. Transfer Flow
```
1. Sender enters recipient phone number
2. System looks up recipient's wallet by phone (via user-service)
3. Sender enters amount (validate min/max)
4. Sender enters PIN to authorize
5. System debits sender wallet, credits receiver wallet atomically
6. Both parties see transaction in history
```

### 2. Atomicity Requirement
- Must use database transaction for double-entry bookkeeping
- If credit fails, debit must rollback
- Use optimistic locking (version field) on wallets

### 3. Daily Aggregate Tracking
- Track daily P2P total per user
- Reset at midnight
- Need to query today's transactions sum

### 4. Security
- PIN verification required before transfer
- BR-SEC-01: PIN locked after 5 wrong attempts
- Session validation

## Architecture Decisions (Final)

### Q1: Daily Aggregate Storage

| Option | Security | Performance | Complexity | Decision |
|--------|----------|-------------|------------|----------|
| **Redis** | Good (AUTH, TLS) | Fast (in-memory) | Need Redis infra | ❌ Not chosen |
| **Query transactions** | Excellent (DB is source of truth) | OK for MVP (<1000 tx/day) | Simple | ✅ **Chosen** |

**Why:** Daily aggregate is just a sum query. Redis adds complexity without enough benefit for MVP.

### Q2: Service Communication

| Option | Security | Performance | Complexity | Decision |
|--------|----------|-------------|------------|----------|
| **Direct call** | Lower (service coupling) | 1 hop | Hard (discovery) | ❌ Not chosen |
| **All via gateway** | Higher (single entry point) | 1 hop | Simple | ✅ **Chosen** |

**Why:** Gateway provides Auth, Rate limiting, Logging, Single entry point.

### Q3: PIN Verification

| Option | Security | Performance | Complexity | Decision |
|--------|----------|-------------|------------|----------|
| **Pre-verified token** | Good (short expiry, single-use) | 1 less call | Token mgmt | ❌ Not chosen |
| **Live verify** | Excellent (always fresh) | 1 extra call | Simple | ✅ **Chosen** |

**Why:** Simpler, no token management risk, always fresh verification.

---

## Final P2P Transfer Flow

```
1. Frontend → Gateway: POST /api/wallet/p2p/transfer
   { recipientPhone, amount, pin }

2. Gateway → Wallet-service: Verify PIN via user-service
   - user-service checks PIN (live)
   - If valid, process transfer

3. Wallet-service:
   - Check sender balance
   - Check daily aggregate (query transactions)
   - Validate amount limits (1K - 50M VND)
   - Atomic: Debit sender, Credit receiver
   - Record transaction

4. Return result via Gateway → Frontend
```

## Research Tasks

- [ ] Investigate wallet locking mechanism for concurrent transfers
- [ ] Research double-entry bookkeeping pattern in PostgreSQL
- [ ] Analyze daily aggregate reset strategy

## Todo List

- [ ] Research P2P transfer atomic transaction pattern
- [ ] Research wallet balance locking
- [ ] Document API endpoints needed
- [ ] Identify integration points with user-service

## Success Criteria

- Clear understanding of P2P transfer flow
- Identified all edge cases and business rule checks
- Documented API contract for P2P operations
- Ready to implement P2P after entities and migrations complete

## Next Steps

After this phase, implementation can begin for P2P transfer feature.