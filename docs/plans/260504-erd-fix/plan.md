# ERD Fix Plan - user-service & wallet-service

**Task:** Fix ERD inconsistencies between `docs/erd.md` and actual Flyway migration SQL files for user-service and wallet-service.

---

## Issues Found

### user-service (`V1__create_user_schema.sql`)

| Issue | Description |
|-------|-------------|
| 1 | `linked_banks` table missing `verified_at` column — ERD defines it |
| 2 | `linked_banks` table missing `account_holder_name` column — ERD defines it |
| 3 | `admin_users` table missing `version` or `updated_at` columns |

### wallet-service (`V1__create_wallet_schema.sql`)

| Issue | Description |
|-------|-------------|
| 1 | `ledger_entries` table missing `entry_type` column — ERD defines it (DEBIT/CREDIT) |

---

## Fix Instructions

### Step 1: Fix user-service migration

Create `V1__alter_user_schema.sql` to add missing columns to `linked_banks`:

```sql
ALTER TABLE linked_banks ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;
ALTER TABLE linked_banks ADD COLUMN IF NOT EXISTS account_holder_name VARCHAR(255) NOT NULL DEFAULT '';
```

### Step 2: Fix wallet-service migration

The `ledger_entries` table in wallet migration is **missing `entry_type`** column entirely. Need to recreate or alter.

```sql
-- Option A: Recreate ledger_entries (preferred for clean schema)
DROP TABLE IF EXISTS ledger_entries;

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    entry_type VARCHAR(10) NOT NULL,
    amount BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Step 3: Update `docs/erd.md`

No changes needed to ERD doc — it already reflects correct schema. Fix SQL to match ERD.

---

## Files to Modify

| File | Change |
|------|--------|
| `backend/wallet-service/src/main/resources/db/migration/V1__create_wallet_schema.sql` | Add `entry_type` column to `ledger_entries` |
| `backend/user-service/src/main/resources/db/migration/V1__create_user_schema.sql` | Add `verified_at`, `account_holder_name` to `linked_banks` |
| `docs/erd.md` | No changes needed |

---

## Success Criteria

- [ ] `ledger_entries` table has `entry_type VARCHAR(10) NOT NULL` column
- [ ] `linked_banks` table has `verified_at TIMESTAMP` column
- [ ] `linked_banks` table has `account_holder_name VARCHAR(255)` column
- [ ] SQL files compile without errors when run against PostgreSQL
