# Bank Linking Flow — Analysis Draft

**Status:** Draft — For Review
**Date:** 2026-05-01

---

## Flow 1: OTP Verification (Simple — MVP)

No bank API needed. User verifies ownership via OTP sent to their bank-registered phone.

```
User                          System                      Bank (SMS)
 │                               │                            │
 │  1. Enter bank + card number  │                            │
 │─────────────────────────────►│                            │
 │                               │                            │
 │                        2. Call Bank OTP API               │
 │                        (send OTP to user's bank phone)    │
 │                               │───────────────────────────►│
 │                               │                            │
 │  3. User receives OTP         │                            │
 │  (bank sends to their phone)  │◄───────────────────────────│
 │                               │                            │
 │  4. Enter OTP                 │                            │
 │─────────────────────────────►│                            │
 │                               │                            │
 │                        5. Verify OTP with Bank             │
 │                               │───────────────────────────►│
 │                               │  6. OTP valid? YES/NO       │
 │                               │◄───────────────────────────│
 │                               │                            │
 │  7. If valid → tokenize card  │                            │
 │                               │  8. Store: bank_code,      │
 │                               │     account_token (PCI),   │
 │                               │     last_four_digits       │
 │                               │───────────────────────────│
 │                               │                            │
 │  8. Success                   │                            │
 │◄─────────────────────────────│                            │
```

### Pros
- No bank API integration needed
- Fast to implement
- Works with any bank

### Cons
- Less secure than bank API verification
- Depends on bank's SMS service

---

## Flow 2: Bank API Verification (Production)

Direct API call to bank to verify account ownership and get token.

```
User                          System                      Bank API
 │                               │                            │
 │  1. Enter bank + card number  │                            │
 │─────────────────────────────►│                            │
 │                               │                            │
 │                        2. Bank API: verify + tokenize     │
 │                           POST /link-account               │
 │                           { cardNumber, userName, CCCD }   │
 │                               │───────────────────────────►│
 │                               │                            │
 │                               │  3. Bank verifies owner    │
 │                               │     Returns: { token,      │
 │                               │       accountHolderName,   │
 │                               │       lastFourDigits }     │
 │                               │◄───────────────────────────│
 │                               │                            │
 │  4. Verification result       │                            │
 │◄─────────────────────────────│                            │
```

### Pros
- Bank guarantees identity match
- Full PCI DSS compliance
- More professional

### Cons
- Need bank API credentials
- Per-bank implementation (Vietcombank vs Techcombank different APIs)
- Longer to set up

---

## Data Flow — What Happens to Card Number

```
Raw card number: 1234567890123456
         │
         ▼
    Bank API returns token
         │
         ▼
account_token: "tok_vcb_a8f3k2..."  ← Stored in DB (safe)
         │
         ▼
last_four_digits: "3456"  ← For display only
```

**What we NEVER store:** raw card number

---

## linked_banks Table — Full Design

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users.id |
| bank_code | VARCHAR(10) | VCB or TCB |
| account_token | VARCHAR(500) | Token from bank (PCI safe) |
| account_holder_name | VARCHAR(255) | Name returned from bank |
| last_four_digits | VARCHAR(4) | For display |
| link_status | VARCHAR(20) | LINKED / UNLINKED |
| verified_at | TIMESTAMP | When bank verified |
| linked_at | TIMESTAMP | When user linked |
| unlinked_at | TIMESTAMP | When user unlinked |

### Max 2 banks per user (BR-ACC-04) — enforced in application layer
### Unlink only when wallet balance = 0 (BR-ACC-03) — checked before unlink

---

## Bank Unlink Flow

```
User clicks "Unlink Bank"
         │
         ▼
Check: wallet.balance == 0 ?
         │
    ┌────┴────┐
    │ NO      │ YES
    │         │
    │ Show error:    Call Bank API
    │ "Cannot unlink │ to deactivate token
    │ if balance ≠ 0"│
    │         │               │
    │         │        Update: link_status = UNLINKED
    │         │        Set: unlinked_at = NOW()
    │         │
    └─────────┘
```

---

## Questions to Resolve

1. **Which flow for MVP?** Flow 1 (OTP) is faster — we can upgrade to Flow 2 later
2. **Bank credentials?** Who provides API keys for Vietcombank/Techcombank?
3. **Test environment?** Do VCB/TCB have sandbox APIs for development?

---

## Recommended Approach

| Phase | Approach |
|-------|----------|
| MVP (Phase 02) | Flow 1 — OTP verification |
| Later (production) | Flow 2 — Bank API integration |

This lets us ship faster and add bank verification later without changing the table design (account_token works for both flows).