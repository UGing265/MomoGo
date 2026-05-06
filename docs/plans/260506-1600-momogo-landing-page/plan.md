---
title: MomoGo Landing Page Implementation
description: Mobile-first landing page for Vietnamese digital wallet with trust signals and feature highlights
status: completed
priority: P1
effort: 3 phases (design, implementation, testing)
branch: feat/check-branch-pr
tags: [frontend, landing-page, nextjs, vietnamese]
created: 2026-05-06
---

## Overview

Implementation plan for MomoGo landing page - a mobile-first, Vietnamese-language landing page for the digital wallet platform. The page emphasizes trust signals (bank partnerships, security certifications), P0 features (P2P transfer, QR payment), and "Confidence through Clarity" brand positioning.

## Phases

| Phase | Status | Description |
|-------|--------|-------------|
| [phase-01-landing-page-design.md](./phase-01-landing-page-design.md) | completed | Component inventory, layout structure, design tokens |
| [phase-02-implementation.md](./phase-02-implementation.md) | completed | Code implementation with Next.js App Router |

## Key Decisions

- **Single page** with section-based scrolling (no multi-page)
- **shadcn/ui** for base components (Button, Card, Accordion)
- **Tailwind v4** with CSS variables for design tokens
- **Vietnamese content primary**, English secondary
- **No backend dependencies** for landing page (static content)

## Component Inventory

| Component | Purpose |
|-----------|---------|
| `HeroSection` | Value prop + CTA + hero image (from Stitch) |
| `ComparisonSection` | "Cách cũ" vs "Cách của MomoGo" (from Stitch) |
| `TrustBadges` | Security certs + bank logos |
| `FeaturesSection` | 3 features grid (from Stitch) |
| `SecuritySection` | Bank-grade security details (from Stitch) |
| `HowItWorks` | 3-step visual guide |
| `SocialProof` | Stats + testimonials |
| `FAQSection` | Accordion Q&A |
| `ContactSection` | Contact form + info (from Stitch) |
| `Footer` | Links + legal + contact |

## Design Source (MCP Stitch)

**Primary Reference:** [MomoGo Landing Page - Desktop](https://stitch.withgoogle.com/projects/12317626414632587358/screens/c866b86c6d9941d8adb7052cd2409180)

**Stitch Design Elements:**
- Headline: "MomoGo - Thanh toán nhanh, Sống thông minh"
- Hero CTAs: "Get Started" + "Learn More"
- Comparison section: "The Old Way" vs "The MomoGo Way"
- Features: QR Payments, Instant P2P, Secure Integration
- Security: Bank-Grade Security, PCI DSS, SSL encryption
- Contact Form: Name, Email, Message + HCMC address
- Footer: Privacy Policy, Terms, Help Center, API Docs

**Design System:** Primary #003d9b (from Stitch), Secondary #725c00

## Research

- [research-01-fintech-landing](./research/researcher-01-fintech-landing-report.md)
- [research-02-vietnam-fintech](./research/researcher-02-vietnam-fintech-report.md)

## Out of Scope

- User authentication flows
- Admin dashboard
- Mobile app deep links (placeholder only)
- Backend/API integration