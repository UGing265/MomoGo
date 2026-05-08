-- Sample data for wallet_db
-- Test users with wallets and transactions

-- Insert test users (for wallet FK references)
INSERT INTO users (id, phone_number, email, full_name, password_hash, status, kyc_status, created_at, updated_at) VALUES
    ('33333333-3333-3333-3333-333333333333', '0987654321', 'user1@test.com', 'Nguyen Van A', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyzpLaqF.mO', 'ACTIVE', 'APPROVED', NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444444', '0987654322', 'user2@test.com', 'Tran Thi B', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyzpLaqF.mO', 'ACTIVE', 'APPROVED', NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555555', '0987654323', 'user3@test.com', 'Le Van C', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyzpLaqF.mO', 'ACTIVE', 'APPROVED', NOW(), NOW());

-- Insert wallets with various balances
INSERT INTO wallets (id, user_id, available_balance, pending_balance, status, currency, created_at, updated_at, version) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 50000000, 0, 'ACTIVE', 'VND', NOW(), NOW(), 0),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 25000000, 0, 'ACTIVE', 'VND', NOW(), NOW(), 0),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', 0, 0, 'ACTIVE', 'VND', NOW(), NOW(), 0);

-- Insert sample deposit transactions
INSERT INTO transactions (id, sender_wallet_id, receiver_wallet_id, type, amount, status, reference_code, description, created_at, completed_at) VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', NULL, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DEPOSIT', 50000000, 'COMPLETED', 'DEP001', 'Initial deposit', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'DEPOSIT', 25000000, 'COMPLETED', 'DEP002', 'Initial deposit', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'P2P_TRANSFER', 10000000, 'COMPLETED', 'P2P001', 'P2P transfer from User1 to User2', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    ('99999999-9999-9999-9999-999999999999', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'P2P_TRANSFER', 5000000, 'COMPLETED', 'P2P002', 'P2P transfer from User2 to User1', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

-- Insert sample QR codes
INSERT INTO qr_codes (id, wallet_id, qr_type, reference_id, amount, status, expires_at, created_at) VALUES
    ('11111111-aaaa-bbbb-cccc-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'STATIC', 'QR001', NULL, 'ACTIVE', NOW() + INTERVAL '30 days', NOW()),
    ('11111111-aaaa-bbbb-cccc-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'DYNAMIC', 'QR002', 5000000, 'ACTIVE', NOW() + INTERVAL '30 days', NOW()),
    ('11111111-aaaa-bbbb-cccc-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'STATIC', 'QR003', NULL, 'ACTIVE', NOW() + INTERVAL '30 days', NOW());
