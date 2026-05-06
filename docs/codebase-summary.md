# MomoGo Frontend Codebase Summary

**Generated:** 2026-05-06
**Source:** repomix-output.xml

## Overview

This document summarizes the MomoGo frontend codebase structure based on the Next.js App Router architecture.

## Directory Structure

```
frontend/
├── app/
│   ├── (auth)/              # Auth route group
│   │   ├── admin/login/     # Admin login
│   │   ├── login/           # User login
│   │   └── register/        # User registration
│   ├── (main)/              # Main app route group
│   │   ├── dashboard/       # User dashboard
│   │   └── wallet/          # Wallet page
│   ├── admin/dashboard/     # Admin dashboard
│   ├── api/auth/[...nextauth]/  # NextAuth API route
│   ├── globals.css          # Design tokens (Tailwind v4)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page entry
├── components/
│   ├── landing/             # Landing page components
│   │   ├── HeroSection.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── SocialProof.tsx
│   │   ├── FaqSection.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   └── ui/                  # shadcn/ui components
├── hooks/                   # Custom React hooks
├── lib/
│   ├── landing-content.ts   # Vietnamese content
│   ├── api/                 # API client
│   └── helper/              # Utilities
├── types/                   # TypeScript types
│   ├── admin/
│   ├── auth/
│   ├── common/
│   ├── user/
│   └── wallet/
├── providers/               # React providers
├── design-tokens.md         # Design system documentation
├── next.config.ts
└── package.json
```

## Key Files by Token Count

| File | Tokens | Purpose |
|------|--------|---------|
| `globals.css` | 1,996 | Design tokens, Tailwind v4 variables |
| `landing-content.ts` | 1,414 | Vietnamese content for landing page |
| `HeroSection.tsx` | 499 | Landing hero section |
| `SocialProof.tsx` | 426 | Stats + testimonials |
| `HowItWorks.tsx` | 425 | 3-step guide |

## Design Tokens (globals.css)

```css
--color-primary: #003d9b;
--color-secondary: #725c00;
--color-tertiary: #00B8D9;
--spacing-section: 3rem / 5rem (mobile/desktop)
--radius-sm/md/lg: 0.25rem / 0.5rem / 1rem
```

## Landing Page Components

All 7 landing components are exported from `frontend/components/landing/index.ts`:

1. **HeroSection** - Value proposition with CTA
2. **TrustBadges** - Security certifications
3. **FeaturesSection** - 3-column feature grid
4. **HowItWorks** - 3-step visual guide
5. **SocialProof** - Statistics and testimonials
6. **FaqSection** - Accordion Q&A
7. **Footer** - Links and legal

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- NextAuth.js for authentication
- Lucide React icons

## Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Landing page |
| `/login` | `app/(auth)/login/page.tsx` | User login |
| `/register` | `app/(auth)/register/page.tsx` | User registration |
| `/admin/login` | `app/(auth)/admin/login/page.tsx` | Admin login |
| `/dashboard` | `app/(main)/dashboard/page.tsx` | User dashboard |
| `/wallet` | `app/(main)/wallet/page.tsx` | Wallet page |
| `/admin/dashboard` | `app/admin/dashboard/page.tsx` | Admin dashboard |
