# MomoGo Project Changelog

All notable project changes are documented here.

## [Unreleased]

## [v1.2.0] - 2026-05-09

### Added

#### API Gateway Implementation (`backend/api-gateway/`)

**Core Features:**
- Spring Cloud Gateway (port 8080) as single entry point for frontend clients
- JWT authentication filter with user ID extraction and header forwarding
- Route configuration with Spring Cloud LoadBalancer (`lb://`) for service discovery
- CORS configuration for frontend dev (localhost:3000)
- Circuit breaker pattern with Resilience4j for fault tolerance
- Redis-based rate limiting support (optional for MVP)
- Fallback endpoints for service unavailability and rate limiting

**Backend-to-Backend Communication:**
- Direct REST communication between user-service and wallet-service via WebClient
- 1-hop latency (direct) vs 2-hop (via gateway)
- Service clients: `UserServiceClient`, `WalletServiceClient`
- Timeout handling (3s) with graceful error responses

**Dependencies Added:**
- Spring Cloud LoadBalancer
- Spring Security WebFlux
- Spring Data Redis Reactive
- Resilience4j
- JJWT (0.12.5)

**Configuration:**
- `application.yml` with routes, filters, CORS, circuit breaker settings
- JWT secret configuration via environment variable

---

## [v1.1.0] - 2026-05-09

### Added

#### Backend Entity Models (user-service, wallet-service)

**User Service Entities** (`backend/user-service/src/main/java/com/momogo/user/domain/entity/`):
- `User` - User account with phone number, status tracking
- `KycSubmission` - eKYC data with CCCD image URLs and verification status
- `LinkedBank` - Bank account links with tokenized account numbers
- `TransactionPin` - PIN storage with attempt tracking (locked after 5 attempts)
- `AdminUser` - Admin accounts with role-based access

**Wallet Service Entities** (`backend/wallet-service/src/main/java/com/momogo/wallet/domain/entity/`):
- `Wallet` - User wallets with balance tracking and currency support
- `Transaction` - All transaction records with type/status enums
- `QRCode` - QR code generation with expiration tracking (30 days)

**Enums**: `UserStatus`, `KycStatus`, `BankProvider`, `PinStatus`, `WalletStatus`, `Currency`, `TransactionType`, `TransactionStatus`, `QrCodeStatus`

**Sample Data** (`database/`):
- SQL files for user-service and wallet-service initial data seeding

---

## [v1.0.0] - 2026-05-06

### Added

#### Landing Page (Frontend)
- **7 new components** in `frontend/components/landing/`:
  - `HeroSection` - Value proposition with CTA and hero image
  - `TrustBadges` - Security certifications and bank partner logos
  - `FeaturesSection` - 3-column feature highlights grid
  - `HowItWorks` - 3-step visual guide for new users
  - `SocialProof` - Statistics and user testimonials
  - `FaqSection` - Accordion-style frequently asked questions
  - `Footer` - Navigation links, legal information, contact

- **Design tokens** in `frontend/app/globals.css`:
  - Tailwind v4 with CSS custom properties
  - Primary blue (#003d9b), secondary yellow (#725c00), tertiary cyan (#00B8D9)
  - Inter font family with defined type scale
  - 4px base spacing rhythm with defined scale (xs, sm, md, lg, xl)
  - Rounded corner tokens (sm, md, lg, xl, full)

- **Landing page** assembled in `frontend/app/page.tsx`
- **Vietnamese content** centralized in `frontend/lib/landing-content.ts`

### Technical Details

| Component | File | Description |
|-----------|------|-------------|
| Hero | `HeroSection.tsx` | Hero with value prop, CTAs, hero image |
| Trust | `TrustBadges.tsx` | Security badges, bank logos |
| Features | `FeaturesSection.tsx` | 3-column feature grid |
| How It Works | `HowItWorks.tsx` | 3-step guide |
| Social Proof | `SocialProof.tsx` | Stats + testimonials |
| FAQ | `FaqSection.tsx` | Accordion Q&A |
| Footer | `Footer.tsx` | Links, legal, contact |

### Design Source
- Stitch design reference: MomoGo Landing Page (Desktop)
- Brand positioning: "Confidence through Clarity"
- Mobile-first, Vietnamese-language primary

### Dependencies
- Next.js App Router
- shadcn/ui (Button, Card, Accordion components)
- Tailwind CSS v4

---

## [v0.1.0] - 2026-05-01

### Added
- Initial project structure
- Backend microservices skeleton (user-service, wallet-service)
- SRS and ERD documentation
- Development roadmap draft
