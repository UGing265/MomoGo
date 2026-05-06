# Phase 01: Landing Page Design

## Context Links
- **Stitch MCP Design:** [MomoGo Landing Page - Desktop](https://stitch.withgoogle.com/projects/12317626414632587358/screens/c866b86c6d9941d8adb7052cd2409180) - Primary reference
- Research: [Fintech Landing Report](../research/researcher-01-fintech-landing-report.md)
- Research: [Vietnam Fintech Report](../research/researcher-02-vietnam-fintech-report.md)
- Design System: [DESIGN.md](../../../../system-design/DESIGN.md)

## Overview
- **Priority:** P1
- **Status:** completed
- **Description:** Define component inventory, layout structure, and design token mappings for the MomoGo landing page.

## Component Inventory

### 1. HeroSection
**Purpose:** Above-fold value proposition with CTA

**Structure (from Stitch):**
```
[Logo - left] [Nav - right: Trang chủ | Giao dịch | Thống kê | Hỗ trợ]
[Avatar + Đăng xuất - far right]
─────────────────────────────────────────────
[Hero Content - left]
- H1: "MomoGo - Thanh toán nhanh, Sống thông minh"
- Subhead: "Ví điện tử an toàn, tiện lợi với ACB, Techcombank và VietinBank"
- Primary CTA: "Bắt đầu ngay" (nút xanh)
- Secondary CTA: "Tìm hiểu thêm" (nút viền)
- Hero image: minh họa dashboard tài chính
─────────────────────────────────────────────
```

**Design Tokens (from Stitch):**
- Background: `#faf9ff` (surface)
- Primary button: `#003d9b` (Stitch primary - deep blue)
- Secondary: `#725c00` (gold/amber)
- H1: `headline-lg` (32px, weight 600)
- Subhead: `body-lg` (16px)

**Mobile:** Single column, hero image below headline

---

### 2. TrustBadges
**Purpose:** Security certifications and bank partnerships above fold

**Badges (horizontal scroll on mobile):**
1. SSL/TLS: Padlock icon + "Kết nối bảo mật 256-bit"
2. PCI DSS: Shield icon + "Chứng nhận PCI DSS"
3. Banks: VCB + TCB logos
4. License: "Được cấp phép bởi NHNN"
5. Guarantee: "Hoàn tiền 100% nếu giao dịch không hợp lệ"

**Layout:**
- Desktop: 5 badges in row, equal width
- Mobile: Horizontal scroll container

**Design Tokens:**
- Badge bg: `#ffffff`
- Badge shadow: Level 1 (4px blur, 10% opacity primary blue tint)
- Badge radius: `8px`
- Icon color: `#003d9b` (Stitch primary)

---

### 2.5. ComparisonSection
**Purpose:** Differentiate MomoGo from traditional banking (from Stitch)

**Structure:**
```
[Cách cũ]                          [Cách của MomoGo]
- Chuyển tiền chậm ❌            - P2P tức thì ✅
- Phí ẩn ❌                      - Phí 0đ ✅
- Liên kết ngân hàng phức tạp ❌ - Kết nối một chạm ✅
```

**Design Tokens:**
- "Cách cũ" card: Error/warning styling with `#ba1a1a` accents
- "Cách của MomoGo" card: Success styling with primary `#003d9b`
- Icons: `close` for old way, `check_circle` for MomoGo way

---

### 3. FeaturesSection
**Purpose:** 3 key features with icons (from Stitch)

**Features:**
1. **Thanh toán QR** - Icon: qr_code_scanner
   - Headline: "Quét mã QR"
   - Desc: "Thanh toán tức thì bằng mã QR"

2. **P2P tức thì** - Icon: send
   - Headline: "Chuyển tiền P2P"
   - Desc: "Chuyển tiền đến bất kỳ số điện thoại nào"

3. **Bảo mật ngân hàng** - Icon: account_balance
   - Headline: "Tích hợp bảo mật"
   - Desc: "Bảo mật cấp ngân hàng với Vietcombank & Techcombank"

**Layout:**
- Desktop: 3 columns (1 column per feature)
- Mobile: Single column stack

**Design Tokens:**
- Card bg: `#ffffff`
- Card radius: `8px`
- Icon container: 48x48px, primary bg at 10% opacity
- Icon color: `#003d9b` (Stitch primary)
- Headline: `title-lg` (20px, weight 600)
- Desc: `body-md` (14px)

---

### 4. SecuritySection (from Stitch)
**Purpose:** Trust-building security features

**Content:**
- Heading: "Bảo mật cấp ngân hàng"
- PCI DSS compliance badge
- SSL encryption details

**Design Tokens:**
- Section bg: `#e9edff` (surface-container)
- Heading: `headline-md` (24px)
- Icon color: `#003d9b`

---

### 5. HowItWorks
**Purpose:** 3-step guide for new users

**Steps:**
1. **Tải app** - Download from stores
2. **Đăng ký** - Phone number + eKYC
3. **Bắt đầu** - Link bank + start transacting

**Layout:**
- Desktop: Horizontal 3 columns
- Mobile: Vertical stack with step numbers

**Design Tokens:**
- Step number: Circle 40x40px, secondary bg `#FFD200`, text `#051a3e`
- Connector line: 2px, `#c3c6d6` (outline-variant)
- Step headline: `title-lg`
- Step desc: `body-md`

---

### 6. SocialProof
**Purpose:** User count + testimonials

**Stats Row:**
- "1M+" người dùng
- "10M+" giao dịch
- "99.9%" uptime

**Testimonials (2-3 cards):**
- Vietnamese name, city, photo
- Quote about ease of use / fast transfers

**Layout:**
- Desktop: Stats row + 3 testimonial cards
- Mobile: Stats row (horizontal scroll) + stacked cards

**Design Tokens:**
- Stats number: `headline-lg`, primary color
- Stats label: `body-md`, on-surface-variant
- Testimonial card: white bg, Level 1 shadow

---

### 7. FAQSection
**Purpose:** Common questions accordion

**Questions:**
1. "MomoGo có miễn phí không?" - Có, không phí ẩn
2. "Làm sao để bắt đầu?" - Tải app, đăng ký, liên kết ngân hàng
3. "Tiền của tôi có an toàn không?" - Bảo mật cấp ngân hàng, được NHNN cấp phép
4. "Tôi có thể rút tiền về ngân hàng nào?" - Vietcombank, Techcombank
5. "QR code có thời hạn không?" - 30 ngày

**Layout:**
- Desktop: 2 columns
- Mobile: Single column

**Component:** shadcn/ui Accordion

**Design Tokens:**
- Trigger: `title-lg` left-aligned
- Content: `body-md`, on-surface-variant
- Border: 1px outline-variant
- Radius: `8px`

---

### 8. ContactSection (from Stitch)
**Purpose:** Contact form for user inquiries

**Form Fields:**
- Họ tên (Name)
- Email
- Nội dung (Message)

**Contact Info:**
- Địa chỉ: 123 Financial District, Ho Chi Minh City
- Email: support@momogo.vn

**Design Tokens:**
- Input fields: white bg, 8px radius, primary focus border
- Button: Primary `#003d9b`

---

### 9. Footer
**Purpose:** Links, legal, contact

**Sections:**
1. **Sản phẩm** - Features, Security, Partners
2. **Công ty** - About, Careers, Press
3. **Hỗ trợ** - Help Center, Contact, FAQ
4. **Pháp lý** - Terms, Privacy, License

**Bottom Row:**
- Copyright: "© 2024 MomoGo Digital Wallet"
- Links: Privacy Policy | Terms of Service | Help Center | API Docs

**Design Tokens:**
- Footer bg: `#051a3e` (inverse-surface)
- Footer text: `#edf0ff` (inverse-on-surface)
- Section headline: `label-md`, uppercase

---

## Layout Structure

```
[HeroSection]
  └─ Logo + Nav (Trang chủ | Giao dịch | Thống kê | Hỗ trợ)
  └─ Avatar + Đăng xuất
  └─ H1 + Subhead + CTAs + Hero Image

[ComparisonSection]
  └─ "Cách cũ" vs "Cách của MomoGo" cards

[TrustBadges]
  └─ 5 badges: SSL, PCI DSS, Banks, License, Guarantee

[FeaturesSection]
  └─ 3 feature cards: QR Payments, P2P tức thì, Bảo mật

[SecuritySection]
  └─ "Bảo mật cấp ngân hàng" heading
  └─ PCI DSS + SSL encryption details

[HowItWorks]
  └─ 3 steps: Tải app → Đăng ký → Bắt đầu

[SocialProof]
  └─ Stats row (1M+ users, 10M+ txns) + Testimonials

[FAQSection]
  └─ Accordion Q&A

[ContactSection]
  └─ Form: Họ tên, Email, Nội dung
  └─ Địa chỉ: 123 Financial District, HCM
  └─ Email: support@momogo.vn

[Footer]
  └─ Copyright: © 2024 MomoGo
  └─ Links: Privacy | Terms | Help | API Docs
```

---

## Responsive Breakpoints

| Breakpoint | Columns | Layout |
|------------|---------|--------|
| < 640px (mobile) | 4 | Single column, stacked |
| 640-1024px (tablet) | 8 | 2-column grids |
| > 1024px (desktop) | 12 | Full layouts |

---

## Technical Requirements

1. **shadcn/ui components:**
   - Button
   - Card
   - Accordion
   - Badge (for trust badges)

2. **No backend** - static content only

3. **Performance targets:**
   - LCP < 2.5s on 4G
   - WebP images
   - Touch targets 44x44px minimum

4. **Accessibility:**
   - Semantic HTML
   - ARIA labels for interactive elements
   - Color contrast ratio 4.5:1 minimum

---

## Success Criteria

- [ ] Hero section visible above fold on 375px mobile
- [ ] All 5 trust badges visible
- [ ] 4 features displayed with icons
- [ ] 3-step how-it-works visible
- [ ] FAQ accordion functional
- [ ] Footer with all sections
- [ ] Mobile responsive at 375px, 640px, 1024px
- [ ] No horizontal overflow on any viewport
- [ ] Vietnamese content renders correctly

---

## Next Steps

Proceed to [phase-02-implementation.md](./phase-02-implementation.md) for code implementation.

## Unresolved Questions

1. Actual user/transaction numbers for social proof
2. Testimonial content and photos (placeholder vs real)
3. App store URLs (placeholder vs real)