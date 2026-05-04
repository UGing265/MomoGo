CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    available_balance BIGINT NOT NULL DEFAULT 0,
    pending_balance BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_wallets_user ON wallets(user_id);
CREATE INDEX idx_wallets_status ON wallets(status);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_wallet_id UUID REFERENCES wallets(id),
    receiver_wallet_id UUID REFERENCES wallets(id),
    type VARCHAR(20) NOT NULL,
    amount BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    reference_code VARCHAR(100) UNIQUE,
    description TEXT,
    idempotency_key VARCHAR(100) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_tx_sender ON transactions(sender_wallet_id);
CREATE INDEX idx_tx_receiver ON transactions(receiver_wallet_id);
CREATE INDEX idx_tx_status ON transactions(status);
CREATE INDEX idx_tx_created ON transactions(created_at);
CREATE INDEX idx_tx_idem ON transactions(idempotency_key);

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    entry_type VARCHAR(10) NOT NULL,
    amount BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ledger_tx ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_wallet ON ledger_entries(wallet_id);

CREATE TABLE qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    qr_type VARCHAR(10) NOT NULL,
    reference_id VARCHAR(100) UNIQUE NOT NULL,
    amount BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_qr_reference ON qr_codes(reference_id);
CREATE INDEX idx_qr_status ON qr_codes(status);
CREATE INDEX idx_qr_expires ON qr_codes(expires_at);

CREATE TABLE idempotency_records (
    idempotency_key VARCHAR(100) PRIMARY KEY,
    request_hash VARCHAR(64) NOT NULL,
    response_body TEXT,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);