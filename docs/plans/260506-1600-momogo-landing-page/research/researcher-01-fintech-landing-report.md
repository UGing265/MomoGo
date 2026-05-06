# Research Report: Fintech Landing Page UX Best Practices for MomoGo

**Date:** 2026-05-06
**Project:** MomoGo Digital Wallet - Landing Page Research
**Context:** Vietnamese market, Corporate Modern design system (Primary Blue #0052CC, Secondary Yellow #FFD200)

---

## Executive Summary

MomoGo's landing page must accomplish two critical goals: establish trust as a legitimate financial service and clearly communicate the speed/simplicity advantage over traditional banking. For the Vietnamese market where mobile-first is dominant, the page must load fast on 3G/4G connections and use local language prominently. The "Confidence through Clarity" brand positioning aligns well with fintech UX best practices—financial users need clarity over cleverness.

### Key Recommendations:
1. Hero must show immediate value proposition with clear CTA
2. Trust signals (security, bank partners) must be visible above fold
3. Feature highlights should emphasize speed, simplicity, and safety
4. Social proof should use concrete numbers (users, transactions)
5. Mobile-first layout with Vietnamese content as primary

---

## 1. Hero Section Best Practices

### Messaging Hierarchy
**Primary:** One clear value proposition (e.g., "Chuyển tiền tức thì - Phí 0đ")
**Secondary:** Supporting benefit (e.g., "Liên kết Vietcombank, Techcombank")
**CTA:** Single primary action (e.g., "Tải ứng dụng" or "Đăng ký ngay")

### Visual Elements
- App preview/mockup showing the QR payment or P2P transfer flow
- Vietnamese smiling users (diverse age groups representing target demographics)
- Subtle security imagery (lock icon, shield) without cluttering
- Brand colors: Primary Blue for trust/buttons, Secondary Yellow for highlights/accents

### CTA Placement
- Above fold on mobile (visible without scrolling)
- Secondary CTA for existing users ("Đăng nhập")
- Store badges (App Store, Google Play) prominently placed

---

## 2. Trust Signals

### Security Badges (Priority Order)
1. **SSL/TLS encryption** - Padlock icon + "Kết nối bảo mật 256-bit"
2. **Bank partnership logos** - Vietcombank, Techcombank logos prominently displayed
3. **Regulatory compliance** - "Được cấp phép bởi NHNN" (State Bank approval)
4. **PCI DSS compliance** badge if applicable
5. **Encryption badge** - "Mã hóa AES-256"

### Partner Logos
- Display bank logos as "Đối tác ngân hàng"
- Payment network logos (Visa/Mastercard) if applicable
- Government/regulatory badges

### Guarantees/Warranties
- "Bảo vệ tài khoản 24/7"
- "Hoàn tiền 100% nếu giao dịch không hợp lệ"

---

## 3. Feature Highlights

### Primary Features to Display (P0 features from SRS)
1. **P2P Transfer** - "Chuyển tiền tức thì đến bất kỳ số điện thoại nào"
2. **QR Payment** - "Quét mã QR để thanh toán nhanh chóng"
3. **Deposit/Withdraw** - "Nạp/rút tiền từ ngân hàng liên kết"
4. **24/7 Availability** - "Giao dịch mọi lúc, không chờ đợi"

### Feature Presentation Style
- Icon + short headline + one-line description format
- Use visual indicators of speed ("Tức thì", "< 3 giây")
- Emphasize simplicity: "Không cần biết số tài khoản"

### Secondary Features (can be below fold)
- Transaction history
- PIN/Biometric security
- Low fees display

---

## 4. Social Proof

### Quantitative Metrics (use real numbers when available)
- "Hơn 1 triệu người dùng" (adjust to actual)
- "Xử lý hàng triệu giao dịch mỗi tháng"
- "99.9% uptime"

### Testimonials
- Vietnamese users with photo, name, city
- Focus on: ease of use, fast transfers, helpful in daily life
- Keep quotes short and authentic

### Media/Partner Logos
- "Được tin tưởng bởi" with partner logos
- Press/coverage logos if available

---

## 5. Mobile-First Considerations for Vietnamese Market

### Mobile Usage Context
- Vietnam has ~75% mobile internet penetration
- 4G coverage primarily in urban areas (HCM, Hanoi)
- Many users on mid-range Android devices
- Data-conscious users - optimize image sizes

### Performance Requirements
- **LCP (Largest Contentful Paint):** < 2.5s on 4G
- **First Input Delay:** < 100ms
- Hero image should be lazy-loaded with placeholder
- Use WebP format for images
- Minimize JavaScript bundle size

### Vietnamese Language
- Vietnamese is primary content language (not translated English)
- Use clear, simple Vietnamese (avoid formal/technical terms)
- Headlines should be scannable (short sentences)
- Clear CTAs in Vietnamese ("Tải app ngay", "Đăng ký miễn phí")

### Layout Adaptation
- Single column layout for mobile
- Touch targets minimum 44x44px
- Bottom navigation consideration for app-like feel

---

## 6. Above-the-Fold Content Hierarchy

### Desktop/Tablet Layout (1200px+)
```
┌─────────────────────────────────────────────┐
│ Logo          Nav (Features, About, Login)   │
├─────────────────────────────────────────────┤
│                                             │
│  [Hero Content - 60%]    [App Preview - 40%]│
│  - Headline (H1)                             │
│  - Subheadline                               │
│  - CTA Button                               │
│  - Store badges                             │
│                                             │
├─────────────────────────────────────────────┤
│  [Trust Badges]  [Security]  [Bank Partners]│
├─────────────────────────────────────────────┤
│  [Feature 1]   [Feature 2]   [Feature 3]   │
│  P2P Transfer   QR Payment    Deposit/Withdraw│
└─────────────────────────────────────────────┘
```

### Mobile Layout (375px)
```
┌───────────────────────┐
│ Logo        Login     │
├───────────────────────┤
│                       │
│  [Hero Image/App]     │
│                       │
│  Headline (H1)        │
│  Subheadline          │
│                       │
│  [CTA Button]         │
│  [Store Badges]       │
│                       │
├───────────────────────┤
│  [Trust Badge Row]    │
│  Security | Banks     │
├───────────────────────┤
│  [Features]           │
│  Icon + Text          │
└───────────────────────┘
```

### Content Priority Above Fold
1. **Logo + minimal nav** (don't compete with CTA)
2. **Hero headline** - Clear value prop
3. **Primary CTA** - Download/Register
4. **App preview** - Visual proof
5. **Trust signals** - Security badges, bank logos

---

## 7. Implementation Recommendations

### Visual Design
- Primary Blue (#0052CC): Use for CTAs, key elements
- Secondary Yellow (#FFD200): Use for highlights, badges, accents
- Clean white space to convey professionalism
- Sans-serif fonts for readability

### Copy Guidelines
- Headline: Action-oriented, benefit-driven
- Subheadline: Explain how, not just what
- CTAs: Specific, not generic ("Tải app" vs "Click here")
- Avoid: "revolutionary", "cutting-edge", "best-in-class"

### Page Structure (Bottom to Top)
1. **Hero** - Value prop + CTA
2. **Features** - 3-4 key features with icons
3. **How It Works** - 3-step visual (Download, Register, Start)
4. **Trust & Security** - Badges, certifications, bank logos
5. **Social Proof** - User count, testimonials
6. **FAQ** - Common questions
7. **Footer** - Links, legal, contact

---

## 8. Unresolved Questions

1. What are the actual user/traffic numbers for social proof?
2. Are there any press mentions or awards to display?
3. Should there be a separate landing page for admin/business users?
4. What Vietnamese fintech regulations require specific disclosures?

---

## References

- Nielsen Norman Group: Fintech Landing Page UX Research
- Google Web Vitals: Mobile Performance Benchmarks
- Vietnam Internet Stats 2024 (VNNIC data)