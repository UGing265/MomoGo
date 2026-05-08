# Sample Data Directory

This folder contains sample data SQL files for development and testing.

## Files

- `V1__user_service_sample_data.sql` - Admin users and test users
- `V1__wallet_service_sample_data.sql` - Test wallets with balances

## Pre-built Users

| Username | Password | Role |
|----------|----------|------|
| admin | Hihihi123@ | Admin |
| shiro | Hihihi123@ | Admin |

## Running Sample Data

```bash
# Run after migrations
psql -U postgres -d user_db -f V1__user_service_sample_data.sql
psql -U postgres -d wallet_db -f V1__wallet_service_sample_data.sql
```

## For Development Only

These files are for local development and testing only. Do NOT run in production.