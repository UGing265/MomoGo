# MomoGo - System Requirements Specification (SRS)

**Version:** 1.0
**Date:** 2026-05-01
**Status:** Draft

---

## I. Business Overview

MomoGo provides a cashless payment solution focused on simplicity and efficiency. Core objective: secure digital wallet storage and QR-based payment transactions, with direct integration to domestic banking infrastructure to optimize speed and transaction costs.

---

## II. Project Scope

### In-Scope
- Personal wallet management (digital balance storage only)
- Direct API integration with 1-2 partner banks (Vietcombank/Techcombank)
- Deposit/Withdraw between wallet and linked bank account
- QR payment (static QR for receiving money)
- User-to-User (P2P) instant transfers
- Admin dashboard for system operations

### Out-of-Scope
- Financial investment services (savings, investment)
- Bill payment (electricity, water, internet)
- Lifestyle services (flights, movies, hotels)
- Mini-app and Loyalty systems
- Merchant/POS system
- Multi-currency support
- PayLater / Credit

---

## III. Actors

| Actor | Description |
|-------|-------------|
| **User** | Individual customer using app to deposit, pay, transfer |
| **Admin** | System administrator responsible for operations, reconciliation, approval |
| **Bank API** | External system representing partner bank infrastructure |

---

## IV. Business Workflow

1. **User Registration & Activation**
   - User registers with phone number (unique identifier)
   - OTP verification via SMS
   - eKYC with CCCD images (front/back)
   - Bank account linking

2. **Wallet Funding**
   - User initiates deposit from linked bank to wallet
   - System verifies bank balance via Bank API before execution

3. **P2P Transfer**
   - User enters recipient phone number
   - System authenticates via PIN or biometrics
   - Real-time debit/credit both wallets instantly

4. **QR Payment (Self)**
   - User generates personal static QR code for receiving transfers
   - Other users scan and pay to this QR

5. **Daily Reconciliation**
   - Admin reviews system-wide transaction flow
   - Balances reconciliation between Wallet and Bank accounts

---

## V. Functional Requirements

### Module: User (FR-USR)

#### FR-USR-01: Registration & eKYC

**FR-USR-01.1: Account Registration**
- Register using Phone Number as unique identifier
- OTP sent via SMS before account creation

**FR-USR-01.2: Electronic KYC (eKYC)**
- Upload front/back CCCD (National ID) images
- CCCD info must match registered phone number owner

---

#### FR-USR-02: Bank Linking

**FR-USR-02.1: Link Bank Account**
- Select bank (Vietcombank/Techcombank)
- Enter card number/account number
- System calls Bank API to verify ownership

**FR-USR-02.2: Unlink Bank Account**
- Allowed only when wallet balance = 0

---

#### FR-USR-03: Wallet Operations

**FR-USR-03.1: Deposit**
- Transfer funds from linked bank to wallet
- System verifies bank balance via Bank API before execution
- Daily/monthly limits apply

**FR-USR-03.2: Withdraw**
- Transfer funds from wallet to linked bank account
- Processing: Instant, 24/7

**FR-USR-03.3: Balance Inquiry**
- View current wallet balance
- View available vs pending balance

---

#### FR-USR-04: P2P Transfer

**FR-USR-04.1: Instant Transfer**
- Transfer to another user by phone number
- Real-time debit/credit, no batch delay

**FR-USR-04.2: Transaction History**
- View past transfers with timestamp, amount, status
- Filter by date range, transaction type

---

#### FR-USR-05: QR Code Payment

**FR-USR-05.1: Generate Personal QR**
- System generates static QR containing user wallet ID
- Display QR for receiving payments from others

**FR-USR-05.2: Scan QR to Pay**
- Access camera to scan another user's QR
- For static QR: enter amount manually before confirming
- Authentication via PIN or biometrics (FaceID/Fingerprint) before debit

---

#### FR-USR-06: Security Authentication

**FR-USR-06.1: Multi-Factor Authentication (MFA)**
- OTP + Biometrics (FaceID/Fingerprint) for sensitive transactions

**FR-USR-06.2: PIN Management**
- Set/change transaction PIN
- PIN required for all financial operations

---

### Module: Admin (FR-ADM)

#### FR-ADM-01: Account Management

**FR-ADM-01.1: Account Approval**
- Review pending eKYC submissions
- Approve/reject user accounts
- View user details and linked bank accounts

**FR-ADM-01.2: Account Suspension**
- Suspend accounts flagged for suspicious activity
- Reactivate upon review

---

#### FR-ADM-02: Dashboard & Monitoring

**FR-ADM-02.1: System Dashboard**
- Total system wallet balance
- Total bank account balances (aggregated)
- Daily transaction volume and count
- Active user count

**FR-ADM-02.2: Transaction Monitoring**
- Real-time transaction feed
- Flag and alert on anomalous patterns

---

#### FR-ADM-03: Reconciliation

**FR-ADM-03.1: Daily Reconciliation Report**
- Export daily transaction file
- Compare with bank statement data
- Identify discrepancies

---

## VI. Non-Functional Requirements

### Security
- SSL/TLS encryption for data in transit
- AES-256 encryption for sensitive data (PIN, card numbers)
- PCI DSS compliance for card data handling
- Tokenization: no raw card data stored
- MFA for all sensitive operations

### Availability
- System uptime: 99.9% (High Availability)
- 24/7 operation for core transactions

### Performance
- QR payment transaction response: ≤ 2 seconds
- P2P transfer response: ≤ 3 seconds

### Scalability
- Minimum 10,000 concurrent TPS (Transactions Per Second)
- Horizontal scaling via microservices architecture

---

## VII. Business Rules

### Wallet Rules
- **BR-WAL-01**: eKYC must be approved before user can link bank account
- **BR-WAL-02**: Minimum deposit amount: 10,000 VND
- **BR-WAL-03**: Maximum deposit per transaction: 100,000,000 VND
- **BR-WAL-04**: Maximum daily deposit aggregate: 500,000,000 VND
- **BR-WAL-05**: Minimum withdrawal amount: 20,000 VND
- **BR-WAL-06**: Maximum withdrawal per transaction: 50,000,000 VND
- **BR-WAL-07**: Maximum daily withdrawal aggregate: 200,000,000 VND
- **BR-WAL-08**: Maximum 1 pending withdrawal at a time; instant processing 24/7

### P2P Transfer Rules
- **BR-P2P-01**: Minimum P2P transfer: 1,000 VND
- **BR-P2P-02**: Maximum P2P transfer per transaction: 50,000,000 VND
- **BR-P2P-03**: Maximum P2P daily aggregate: 100,000,000 VND
- **BR-P2P-04**: Cannot transfer to self (same phone number)
- **BR-P2P-05**: Recipient must have active wallet account

### QR Payment Rules
- **BR-QR-01**: QR payments debited from user's VND balance only
- **BR-QR-02**: Static QR requires manual amount entry before confirmation
- **BR-QR-03**: QR code expires after 30 days

### Account Rules
- **BR-ACC-01**: Phone number is unique identifier — one account per phone
- **BR-ACC-02**: Account status lifecycle: PENDING → ACTIVE (eKYC approved) → SUSPENDED
- **BR-ACC-03**: Bank unlink only allowed when wallet balance = 0
- **BR-ACC-04**: Maximum 2 linked bank accounts per user

### Security Rules
- **BR-SEC-01**: PIN locked after 5 consecutive wrong attempts → requires OTP reset
- **BR-SEC-02**: Transaction PIN required for: deposit, withdrawal, P2P transfer, QR payment
- **BR-SEC-03**: Biometrics (FaceID/Fingerprint) optional but recommended
- **BR-SEC-04**: Session timeout after 15 minutes of inactivity

### Admin Rules
- **BR-ADM-01**: eKYC review must be completed within 24 hours of submission
- **BR-ADM-02**: Transaction threshold > 50,000,000 VND flagged for manual review
- **BR-ADM-03**: Daily reconciliation must be completed by 09:00 AM next business day

---

## VIII. Recommended Tech Stack

| Component | Technology |
|-----------|------------|
| **Mobile** | React Native |
| **Web/Admin** | Next.js |
| **Backend** | Java Spring Boot |
| **Database** | PostgreSQL (relational/transactional) |
| **Cache/Session** | Redis |
| **Architecture** | Microservices (User Module, Payment Module) |
| **Integration** | RESTful API / gRPC with Bank Gateway |
| **Authentication** | JWT + OAuth2 |
| **Monitoring** | Prometheus + Grafana |

---

## IX. Constraints & Assumptions

**Constraints:**
- System fully depends on partner Bank API stability
- Exchange rates sourced from external provider (central bank API or provider)

**Assumptions:**
- Users already have active bank accounts at supported banks
- CCCD is the primary identity document for Vietnamese users
- All transactions in VND unless multi-currency explicitly invoked