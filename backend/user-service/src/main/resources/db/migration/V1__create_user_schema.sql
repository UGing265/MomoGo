CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    kyc_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_status ON users(status);

CREATE TABLE kyc_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    cccd_number VARCHAR(50) NOT NULL,
    document_type VARCHAR(20) NOT NULL DEFAULT 'CCCD',
    front_image_url VARCHAR(500) NOT NULL,
    back_image_url VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    admin_notes TEXT
);

CREATE INDEX idx_kyc_status ON kyc_submissions(status);
CREATE INDEX idx_kyc_submitted_at ON kyc_submissions(submitted_at);

CREATE TABLE linked_banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    bank_code VARCHAR(10) NOT NULL,
    account_token VARCHAR(500) NOT NULL,
    account_holder_name VARCHAR(255) NOT NULL,
    last_four_digits VARCHAR(4) NOT NULL,
    link_status VARCHAR(20) NOT NULL DEFAULT 'LINKED',
    verified_at TIMESTAMP,
    linked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    unlinked_at TIMESTAMP
);

CREATE INDEX idx_linked_banks_user ON linked_banks(user_id);
CREATE INDEX idx_linked_banks_status ON linked_banks(link_status);

CREATE TABLE transaction_pins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    hashed_pin VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    fail_count INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);