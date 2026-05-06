# MomoGo - Agents Instructions

**Project:** MomoGo Digital Wallet Platform
**Version:** 1.0
**Last Updated:** 2026-05-06

---

## 1. Project Overview

MomoGo is a cashless payment solution providing secure digital wallet storage and QR-based payment transactions with direct integration to domestic Vietnamese banking infrastructure (Vietcombank/Techcombank).

### Project Structure

```
MomoGo/
├── frontend/          # Next.js web app (user-facing + admin dashboard)
├── backend/           # Java Spring Boot microservices
│   ├── user-service/     # User management, KYC, authentication
│   ├── wallet-service/   # Wallet, transactions, QR codes
│   └── api-gateway/      # API gateway
├── mobile/            # React Native mobile app (placeholder)
├── docs/              # System documentation (SRS, ERD, flows) + plans
└── plans/             # (Moved to docs/plans/)
```

### Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend (Web/Admin)** | Next.js App Router, TypeScript, shadcn/ui, Tailwind CSS |
| **Backend** | Java Spring Boot, PostgreSQL, Redis |
| **Mobile** | React Native (Expo) |
| **Architecture** | Microservices (user-service, wallet-service) |

---

## 2. Actor Context

### 2.1 Admin User (Web Only)
- Admin dashboard for system operations, monitoring, reconciliation
- Access via web browser only
- Separate authentication from regular users

### 2.2 Regular User (Both Mobile + Web)
- Mobile app for wallet operations (deposit, withdraw, P2P transfer, QR payment)
- Web access for viewing/management
- Phone number as primary identifier

---

## 3. Multi-Agent Orchestration

**IMPORTANT:** When working on tasks, ALWAYS spawn appropriate agents using the `Agent` tool.

### 3.1 Available Agents

| Task Type | Agent Type | Purpose |
|-----------|------------|---------|
| **Research** | `researcher` | Investigate libraries, patterns, best practices |
| **Planning** | `planner` | Create implementation plans with phases |
| **Scouting/Exploration** | `Explore` / `scout` | Understand existing codebase structure |
| **Implementation** | `fullstack-developer` | Execute specific implementation phases |
| **Testing** | `tester` | Run tests, validate functionality |
| **Code Review** | `code-reviewer` | Review code quality |
| **UI/UX Design** | `ui-ux-designer` | Design review, visual QA |
| **Project Management** | `project-manager` | Track progress, update plans/docs |
| **Debugging** | `debugger` | Investigate issues, analyze errors |
| **Documentation** | `docs-manager` | Maintain project documentation |

### 3.2 Workflow Chain

```
User Request
    │
    ▼
[Research] ──► [Planning] ──► [Implementation] ──► [Testing]
                                   │                      │
                                   ▼                      ▼
                              [Simplify]            [Code Review]
                                   │                      │
                                   ▼                      ▼
                              [Integration] ◄───── [Fix if needed]
                                   │
                                   ▼
                            [Update Docs]
```

### 3.3 Delegation Context Template

When spawning subagents via `Agent` tool, **ALWAYS include**:

```
Work context: {project_path}
Reports: {project_path}/docs/plans/reports/
Plans: {project_path}/docs/plans/
```

**Example delegation:**
```
Task: "Implement user registration API"
Work context: D:\AShiroru\ProgramCode\Project\Team\MomoGo\backend
Reports: D:\AShiroru\ProgramCode\Project\Team\MomoGo\docs\plans\reports\
Plans: D:\AShiroru\ProgramCode\Project\Team\MomoGo\docs\plans\
```

### 3.4 Spawning Templates

#### Research Agent
```
Agent: researcher
Prompt: "Research [topic] for MomoGo project.
Work context: {path}
Reports: {path}/plans/reports/
Plans: {path}/plans/"
```

#### Implementation Agent
```
Agent: fullstack-developer
Prompt: "Implement [feature] following phase [N] plan.
Work context: {path}
Phase file: {path}/plans/{date}-{plan}/phase-0N-*.md"
```

#### Testing Agent
```
Agent: tester
Prompt: "Run tests for [module/service].
Work context: {path}
Code: {path}/backend/[service]/src/"
```

#### Code Review Agent
```
Agent: code-reviewer
Prompt: "Review code in [files/directories] for MomoGo.
Work context: {path}
Standards: Follow KISS, DRY, YAGNI principles"
```

---

## 4. Code Standards

### 4.1 Core Principles

**ALWAYS follow these principles:**
- **YAGNI** (You Aren't Gonna Need It) - Don't add functionality early
- **KISS** (Keep It Simple, Stupid) - Simplicity over cleverness
- **DRY** (Don't Repeat Yourself) - Extract shared logic

### 4.2 File Naming

| Type | Convention | Example |
|------|------------|---------|
| **Java/Kotlin** | PascalCase | `UserService.java`, `WalletController.java` |
| **TypeScript/React** | PascalCase for components, camelCase for utilities | `UserProfile.tsx`, `useAuth.ts` |
| **SQL Migration** | kebab-case with version prefix | `V1__create_user_schema.sql` |
| **Config files** | kebab-case | `application-dev.yml`, `docker-compose.yml` |

### 4.3 File Size Limits

| Language | Max Lines | Action if Exceeded |
|----------|-----------|-------------------|
| Any | **200 lines** | Split into smaller modules |

### 4.4 Java/Spring Boot Standards

```
backend/
├── user-service/
│   └── src/main/java/com/momogo/user/
│       ├── domain/
│       │   ├── entity/          # JPA entities
│       │   ├── repository/     # Repository interfaces
│       │   └── exception/      # Domain exceptions
│       ├── application/
│       │   ├── dto/            # Data transfer objects
│       │   ├── service/       # Application services
│       │   └── usecase/       # Use case classes
│       ├── infrastructure/
│       │   ├── persistence/    # JPA implementations
│       │   ├── redis/          # Redis configuration
│       │   └── external/      # External API clients
│       └── presentation/
│           ├── controller/     # REST controllers
│           ├── request/        # Request DTOs
│           └── response/       # Response DTOs
```

### 4.5 Frontend/Next.js Standards

```
frontend/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (user)/            # User dashboard
│   ├── (admin)/           # Admin dashboard
│   └── api/               # API routes
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── shared/           # Shared components
│   └── [feature]/        # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, API clients
├── stores/               # State management (Zustand)
└── types/                # TypeScript types
```

### 4.6 Mobile/React Native Standards

```
mobile/
├── src/
│   ├── app/              # Expo Router screens
│   ├── components/
│   ├── hooks/
│   ├── services/         # API integration
│   └── utils/
└── app.json
```

---

## 5. Functional Requirements Summary

### 5.1 User Module (FR-USR)

| ID | Feature | Priority |
|----|---------|----------|
| FR-USR-01 | Registration & eKYC | P0 |
| FR-USR-02 | Bank Linking | P0 |
| FR-USR-03 | Wallet Operations (Deposit/Withdraw) | P0 |
| FR-USR-04 | P2P Transfer | P0 |
| FR-USR-05 | QR Code Payment | P1 |
| FR-USR-06 | Security (MFA, PIN) | P0 |

### 5.2 Admin Module (FR-ADM)

| ID | Feature | Priority |
|----|---------|----------|
| FR-ADM-01 | Account Management | P0 |
| FR-ADM-02 | Dashboard & Monitoring | P1 |
| FR-ADM-03 | Reconciliation | P1 |

### 5.3 Key Business Rules

| Rule | Description |
|------|-------------|
| BR-WAL-01 | eKYC approved before bank linking |
| BR-WAL-02/03 | Min/max deposit limits (10K - 100M VND) |
| BR-WAL-05/06 | Min/max withdrawal limits (20K - 50M VND) |
| BR-P2P-01/02 | Min/max P2P limits (1K - 50M VND) |
| BR-ACC-03 | Bank unlink only when balance = 0 |
| BR-ACC-04 | Max 2 linked banks per user |
| BR-SEC-01 | PIN locked after 5 wrong attempts |
| BR-QR-03 | QR code expires after 30 days |

---

## 6. Database Design

### 6.1 User Service (user_db)

| Table | Purpose |
|-------|---------|
| `users` | User accounts, phone as unique identifier |
| `kyc_submissions` | eKYC data (CCCD images) |
| `linked_banks` | Bank account links (tokenized) |
| `transaction_pins` | PIN storage with attempt tracking |
| `admin_users` | Admin accounts |

### 6.2 Wallet Service (wallet_db)

| Table | Purpose |
|-------|---------|
| `wallets` | User wallets with balance tracking |
| `transactions` | All transaction records |
| `qr_codes` | QR code generation and tracking |

---

## 7. API Integration

### 7.1 Bank Integration

**MVP Approach (Phase 1):** OTP verification via bank's SMS service
**Production (Phase 2):** Direct Bank API verification

**Supported Banks:**
- Vietcombank (VCB)
- Techcombank (TCB)

### 7.2 Security Requirements

- JWT + OAuth2 for authentication
- AES-256 encryption for sensitive data
- PCI DSS compliance for card data
- MFA for sensitive operations

---

## 8. Non-Functional Requirements

| Requirement | Target |
|------------|--------|
| System uptime | 99.9% |
| QR payment response | ≤ 2 seconds |
| P2P transfer response | ≤ 3 seconds |
| Concurrent TPS | 10,000 minimum |

---

## 9. Documentation Standards

### 9.1 Required Documentation

| Document | Location | Update Trigger |
|----------|----------|----------------|
| System Requirements (SRS) | `docs/srs.md` | Requirements change |
| Entity Relationship Diagram | `docs/erd.md` | Schema change |
| Development Roadmap | `docs/development-roadmap.md` | Phase completion |
| Project Changelog | `docs/project-changelog.md` | Feature/fix release |
| Code Standards | `docs/code-standards.md` | Standards change |
| Implementation Plans | `docs/plans/{date}-{name}/` | Plan creation |

### 9.2 Plan Structure

```
docs/plans/
├── {date}-{plan-name}/
│   ├── plan.md              # Overview (80 lines max)
│   ├── phase-01-*.md        # Detailed phases
│   ├── phase-02-*.md
│   ├── research/
│   │   └── researcher-*-report.md
│   └── reports/
│       ├── scout-report.md
│       └── researcher-report.md
└── visuals/                 # Diagrams, slides
```

---

## 10. Git Workflow

### 10.1 Branch Naming

| Type | Convention | Example |
|------|------------|---------|
| Feature | `feat/{module}-{description}` | `feat/user-registration` |
| Bug Fix | `fix/{module}-{issue}` | `fix/wallet-balance-sync` |
| Hotfix | `hotfix/{severity}-{description}` | `hotfix/critical-auth-bypass` |
| Chore | `chore/{task}` | `chore/update-deps` |

### 10.2 Commit Messages

Follow conventional commits:
- `feat: add user registration with OTP`
- `fix: resolve wallet balance race condition`
- `chore: update eslint rules`
- `docs: update SRS with new requirements`

### 10.3 Pre-commit/Push Rules

**Before commit:**
- Run linting
- Ensure no syntax errors
- No confidential data (env, keys, credentials)

**Before push:**
- Run tests (DO NOT ignore failures)
- All tests must pass

---

## 11. Testing Requirements

### 11.1 Test Coverage Targets

| Layer | Coverage Target |
|-------|-----------------|
| Unit tests | 80%+ |
| Integration tests | Critical paths covered |
| E2E tests | Happy paths + key edge cases |

### 11.2 Test Structure

```
backend/user-service/src/test/java/com/momogo/user/
├── service/           # Service unit tests
├── controller/        # Controller tests
└── integration/       # Integration tests
```

---

## 12. Environment Configuration

### 12.1 Backend Services

| Service | Port | Database |
|---------|------|----------|
| user-service | 8081 | PostgreSQL (user_db) |
| wallet-service | 8082 | PostgreSQL (wallet_db) |
| api-gateway | 8080 | - |

### 12.2 Required Environment Variables

**Backend:**
```
DATABASE_URL, REDIS_URL, JWT_SECRET, BANK_API_KEY
```

**Frontend:**
```
NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GATEWAY_URL
```

---

## 13. Error Handling

### 13.1 Exception Types

| Exception | Use Case |
|-----------|----------|
| `BusinessException` | Domain rule violations |
| `NotFoundException` | Resource not found |
| `AuthenticationException` | Auth failures |
| `AuthorizationException` | Permission denied |
| `ValidationException` | Input validation failures |

### 13.2 Error Response Format

```json
{
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "details": {},
  "timestamp": "2026-05-06T10:00:00Z"
}
```

---

## 14. Monitoring & Observability

| Component | Tool |
|-----------|------|
| Metrics | Prometheus |
| Dashboards | Grafana |
| Logs | Structured JSON logging |
| Tracing | Distributed tracing (if needed) |

---

## 15. Quick Reference

### Key Commands

```bash
# Backend
cd backend && ./mvnw clean package

# Frontend
cd frontend && pnpm dev

# Run all tests
cd backend && ./mvnw test
```

### Key Documentation Files

| File | Purpose |
|------|---------|
| `docs/srs.md` | Complete requirements specification |
| `docs/erd.md` | Database schema design |
| `docs/bank-linking-flow-draft.md` | Bank integration flows |

---

**End of AGENTS.md**
