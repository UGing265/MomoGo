# Phase 02: Implementation

## Context Links
- Phase 01: [phase-01-landing-page-design.md](./phase-01-landing-page-design.md)
- Design System: [DESIGN.md](../../../../system-design/DESIGN.md)
- Frontend structure: `frontend/app/`, `frontend/components/`

## Overview
- **Priority:** P1
- **Status:** completed
- **Description:** Implement landing page components following the design specification and Next.js App Router conventions.

---

## File Structure

```
frontend/app/
├── page.tsx                    # Landing page (updated)
├── layout.tsx                  # Root layout (update for Inter font)
├── globals.css                 # Design tokens + Tailwind
└── (landing)/                  # Route group (optional)
    └── page.tsx                # Or update root page.tsx

frontend/components/landing/
├── HeroSection.tsx            # Hero with CTA + mockup
├── TrustBadges.tsx            # Security badges row
├── FeaturesSection.tsx        # 4 features grid
├── HowItWorks.tsx            # 3-step guide
├── SocialProof.tsx            # Stats + testimonials
├── FaqSection.tsx             # Accordion FAQ
└── Footer.tsx                  # Footer links

frontend/components/ui/         # shadcn/ui components
├── button.tsx
├── card.tsx
├── accordion.tsx
└── badge.tsx

frontend/lib/
└── constants.ts                # Landing page content (Vietnamese text)
```

---

## Implementation Steps

### Step 1: Update Global Styles

**File:** `frontend/app/globals.css`

Add design tokens as CSS variables:

```css
:root {
  --color-primary: #0052CC;
  --color-secondary: #FFD200;
  --color-surface: #faf9ff;
  --color-on-surface: #051a3e;
  --color-outline: #737685;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;

  --shadow-1: 0 4px 12px rgba(5, 26, 62, 0.08);
  --shadow-2: 0 8px 24px rgba(5, 26, 62, 0.12);
}
```

### Step 2: Update Root Layout

**File:** `frontend/app/layout.tsx`

- Set `lang="vi"` (Vietnamese)
- Use Inter font from next/font/google
- Update metadata (title, description in Vietnamese)

### Step 3: Create Landing Components

Create in `frontend/components/landing/`:

#### 3.1 hero-section.tsx
- H1: "Chuyển tiền tức thì - Phí 0đ"
- Subhead: "Liên kết Vietcombank, Techcombank"
- Primary CTA button (blue)
- Secondary CTA text link (Login)
- App mockup image placeholder
- Responsive: side-by-side desktop, stacked mobile

#### 3.2 trust-badges.tsx
- 5 badges in scrollable row
- Icons: Lock, Shield, Bank logos, Checkmark, Shield-check
- Mobile: horizontal scroll with snap

#### 3.3 features-section.tsx
- Section title: "Tính năng nổi bật"
- 2x2 grid desktop, single column mobile
- Feature cards with icon containers

#### 3.4 how-it-works.tsx
- Section title: "Bắt đầu trong 3 bước"
- 3 numbered steps with connectors
- Vertical stack on mobile

#### 3.5 social-proof.tsx
- Stats: "1M+ người dùng", "10M+ giao dịch", "99.9% uptime"
- Testimonial cards (use placeholder quotes)

#### 3.6 faq-section.tsx
- Section title: "Câu hỏi thường gặp"
- shadcn/ui Accordion with 5 items

#### 3.7 footer.tsx
- Dark background (#051a3e)
- 4 link columns + bottom row

### Step 4: Create Constants

**File:** `frontend/lib/landing-content.ts`

Vietnamese content as constants for maintainability.

### Step 5: Assemble Page

**File:** `frontend/app/page.tsx`

Import and compose all components in correct order.

---

## Component Specifications

### Button Styles

| Variant | Background | Text | Use |
|---------|------------|------|-----|
| primary | `#0052CC` | white | CTA |
| secondary | transparent | `#0052CC` | Secondary actions |
| ghost | transparent | `#051a3e` | Text links |

### Card Styles
- Background: white
- Border radius: 8px
- Shadow: Level 1
- Padding: 16px

### Typography Scale
- H1: 32px / 600 weight
- H2: 24px / 600 weight
- Title: 20px / 600 weight
- Body: 16px / 400 weight
- Caption: 14px / 400 weight

---

## Performance Optimizations

1. **Images:** Use `next/image` with WebP, priority on hero
2. **Fonts:** `next/font` for Inter (self-hosted, no layout shift)
3. **Lazy loading:** Below-fold images use `loading="lazy"`
4. **Bundle:** No heavy dependencies, minimal JS

---

## Validation Checklist

- [x] `pnpm build` succeeds
- [x] `pnpm lint` passes
- [x] No TypeScript errors
- [x] All 10 sections render (Navigation, HeroSection, TrustBadges, ComparisonSection, FeaturesSection, SecuritySection, HowItWorks, SocialProof, FaqSection, ContactSection, Footer)
- [ ] Mobile responsive at 375px, 640px, 1024px
- [x] Vietnamese text displays correctly
- [ ] No console errors

---

## Dependencies to Add

```bash
cd frontend
pnpm add lucide-react  # Icons
```

## Related Files to Modify

| File | Action |
|------|--------|
| `app/globals.css` | Add design tokens |
| `app/layout.tsx` | Update metadata, font |
| `app/page.tsx` | Compose landing page |
| `lib/landing-content.ts` | Create - content constants |

## Files to Create

| File | Description |
|------|-------------|
| `components/landing/Navigation.tsx` | Sticky header with nav links |
| `components/landing/HeroSection.tsx` | Hero with CTA |
| `components/landing/TrustBadges.tsx` | Trust badges row |
| `components/landing/ComparisonSection.tsx` | "Cách cũ" vs "MomoGo way" |
| `components/landing/FeaturesSection.tsx` | Features grid |
| `components/landing/SecuritySection.tsx` | PCI DSS + security details |
| `components/landing/HowItWorks.tsx` | 3 steps |
| `components/landing/SocialProof.tsx` | Stats + testimonials |
| `components/landing/FaqSection.tsx` | FAQ accordion |
| `components/landing/ContactSection.tsx` | Contact form |
| `components/landing/Footer.tsx` | Footer links |

---

## Success Criteria

- [x] Landing page renders all 10 sections
- [x] Build passes without errors
- [ ] Mobile-first responsive design
- [x] Vietnamese content primary
- [x] Design tokens applied from DESIGN.md

---

## Next Steps

After implementation:
1. Testing on multiple viewport sizes
2. Content review (replace placeholders)
3. Performance audit (LCP < 2.5s)
4. Cross-browser testing