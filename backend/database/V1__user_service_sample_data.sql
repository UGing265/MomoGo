-- Sample data for user_db
-- Admin users for testing

-- Insert admin users
INSERT INTO admin_users (id, username, password_hash, status, created_at) VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyzpLaqF.mO', 'ACTIVE', NOW()),
    ('22222222-2222-2222-2222-222222222222', 'shiro', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyzpLaqF.mO', 'ACTIVE', NOW());
