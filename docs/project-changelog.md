# MomoGo Project Changelog

All notable project changes are documented here.

## [Unreleased]

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
