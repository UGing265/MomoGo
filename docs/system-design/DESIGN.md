---
name: MomoGo Brand Identity
colors:
  surface: '#faf9ff'
  surface-dim: '#ccdaff'
  surface-bright: '#faf9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8ff'
  surface-container-highest: '#d8e2ff'
  on-surface: '#051a3e'
  on-surface-variant: '#434654'
  inverse-surface: '#1d3054'
  inverse-on-surface: '#edf0ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#725c00'
  on-secondary: '#ffffff'
  secondary-container: '#fdd000'
  on-secondary-container: '#6e5900'
  tertiary: '#004b59'
  on-tertiary: '#ffffff'
  tertiary-container: '#006477'
  on-tertiary-container: '#76e2ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#ffe07c'
  secondary-fixed-dim: '#ecc200'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#564500'
  tertiary-fixed: '#afecff'
  tertiary-fixed-dim: '#48d7f9'
  on-tertiary-fixed: '#001f27'
  on-tertiary-fixed-variant: '#004e5d'
  background: '#faf9ff'
  on-background: '#051a3e'
  surface-variant: '#d8e2ff'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
---

<h1><span style="color: #0052CC; font-weight: bold;">MomoGo</span></h1>

## Brand & Style
The design system is anchored in a **Corporate Modern** style that balances the rigorous security of a financial institution with the approachability of a lifestyle app. The target audience includes tech-savvy Vietnamese urbanites and small business owners who require a tool that feels both official and effortless.

The UI avoids clinical coldness by utilizing high-quality whitespace and soft, welcoming interaction patterns. It draws inspiration from global fintech leaders like PayPal for its structural reliability and Finviet for its localized functional density. The emotional goal is to evoke "Confidence through Clarity"—ensuring users feel their assets are protected while making daily transactions feel energetic and rewarding.

## Colors
This design system utilizes a high-contrast primary palette to drive action and instill trust. 

- **Primary Blue (#0052CC):** Used for core navigation, primary actions, and branding elements to reinforce security.
- **Vibrant Yellow (#FFD200):** Reserved for high-visibility highlights, secondary promotional banners, and specific "energy" touchpoints like rewards or successful transaction celebrations.
- **Tertiary Cyan (#00B8D9):** Used for informational accents and data visualization (e.g., spending categories).
- **Neutral Navy (#091E42):** Applied to typography and iconography for superior legibility.

Backgrounds primarily use a neutral-50 (#F4F5F7) to maintain a clean, professional aesthetic, ensuring the vibrant secondary yellow doesn't overwhelm the user.

## Typography
The design system exclusively uses **Inter** to ensure maximum readability for complex financial data. The typeface's tall x-height and neutral personality provide the necessary clarity for Vietnamese diacritics, which can often look cluttered in more decorative fonts.

Headlines utilize tighter letter spacing and heavier weights to command attention, while body text maintains a generous line height (150%) to ensure ease of reading during long-form activities like reviewing transaction histories or reading terms and conditions.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for mobile-first usage. It utilizes a 4-column system for mobile devices and a 12-column system for tablets and web interfaces. 

A strict 4px baseline rhythm is enforced to ensure vertical consistency across all components. Content margins are set at 20px on mobile to provide enough "breathing room" for thumb-based navigation, while internal card padding remains a consistent 16px (md) to maximize information density without appearing cramped.

## Elevation & Depth
Depth is communicated through **Ambient Shadows** and **Tonal Layering**. The design system avoids heavy, dark shadows in favor of diffused, low-opacity blurs (10-15% opacity) that use a slight tint of the Primary Blue to maintain color harmony.

- **Level 0 (Flat):** Used for the main background.
- **Level 1 (Surface):** Used for cards and secondary navigation bars with a 4px blur.
- **Level 2 (Elevated):** Used for floating action buttons (FABs) and active modals with a 12px blur, creating a distinct "lift" that suggests interactability.
- **Level 3 (Overlay):** High-priority alerts and bottom sheets, utilizing a background backdrop blur (8px) to focus user attention.

## Shapes
The shape language is defined as **Rounded**, utilizing a base radius of 8px (0.5rem). This choice is intentional: it is softer than the sharp angles of traditional banking apps, making it feel friendlier for daily use, yet more structured than "pill-shaped" apps that can appear overly casual.

Standard containers and buttons use the 8px radius. Larger cards and modals transition to 16px (1rem) to emphasize their role as primary content containers. Icons are contained within soft-square frames to maintain visual alignment with the overall shape language.

## Components
- **Buttons:** Primary buttons use a solid Primary Blue fill with white text. CTA buttons for "Pay" or "Send" may utilize the Vibrant Yellow with Neutral Navy text to maximize conversion. All buttons feature an 8px corner radius.
- **Input Fields:** Use a light grey border (Neutral-100) that transitions to Primary Blue on focus. Labels are always persistent above the field in Label-MD styling.
- **Cards:** White surfaces with a Level 1 shadow. Transaction cards use a 12px horizontal padding and an icon lead-in to quickly categorize spending.
- **Chips:** Highly rounded (pill) with a 24px height. Used for filtering transaction history (e.g., "Last 30 days," "Income," "Expenses").
- **Lists:** Clean, borderless list items separated by 1px Neutral-50 dividers. Tap targets are a minimum of 48px in height.
- **Bottom Navigation:** A persistent white bar with Level 2 elevation. Active states are indicated by the Primary Blue color and a subtle 2px top-border indicator.
- **QR Scanner:** A specialized component with a prominent central scan button, utilizing the Vibrant Yellow to highlight the primary utility of the app in the Vietnamese market.