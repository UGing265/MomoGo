# Phase 03: Sample Data & Admin Users

## Overview

**Priority:** P1 (High)
**Status:** Completed
**Effort:** 1h

Create sample data SQL files with admin users for both services.

## Requirements

### Sample Users (user_db)

1. **Admin User**
   - Username: admin
   - Password: Hihihi123@ (BCrypt hashed)
   - Status: ACTIVE

2. **Shiro User**
   - Username: shiro
   - Password: Hihihi123@ (BCrypt hashed)
   - Status: ACTIVE

3. **Test Users for P2P**
   - 2-3 mock users with wallets for testing transfers

### Sample Wallets (wallet_db)

- Create wallets for test users
- Initial balance: some users with balance, some with 0

## Output Location

All SQL files go in `database/` folder at project root:

```
database/
├── V1__user_service_sample_data.sql
├── V1__wallet_service_sample_data.sql
└── README.md
```

## Password Hash Generation

Use BCrypt with strength 12:

```
BCrypt hash for "Hihihi123@":
$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaqF.mO
```

## SQL Structure

```sql
-- user_db sample data
INSERT INTO admin_users (id, username, password_hash, status, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin', '$2a$12$...', 'ACTIVE', NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'shiro', '$2a$12$...', 'ACTIVE', NOW());

-- wallet_db sample data
INSERT INTO wallets (id, user_id, available_balance, status, currency, created_at, updated_at)
VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 5000000, 'ACTIVE', 'VND', NOW(), NOW());
```

## Todo List

- [ ] Create database/V1__user_service_sample_data.sql
- [ ] Create database/V1__wallet_service_sample_data.sql
- [ ] Add admin user (admin/Hihihi123@)
- [ ] Add admin user (shiro/Hihihi123@)
- [ ] Add test users with wallets
- [ ] Add some balance to test wallets

## Success Criteria

- SQL files are valid PostgreSQL
- Passwords are properly BCrypt hashed
- Data can be inserted without errors
- Test P2P can be performed with sample users

## Next Steps

Phase 04 for P2P research depends on this.