# agrivil

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_wIebwNYl8EIBAS6jj4k00HaDZUS1)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Brand Identity & Design System

Agrivil utilizes an earthy, fresh, and modern organic palette tailored for the Ghanaian agricultural market:

| Color Role | Hex Code | Usage |
|---|---|---|
| **Brand Primary Green** | `#0B3B25` | Primary CTA buttons, key brand headings, active navigation states, verified badges |
| **Brand Copper** | `#7A3F1C` | Accent links, secondary buttons, transit ribbons, warm icons, helper actions |
| **General Background & Card (Clean Bright Tan)** | `#F7F5F0` | Canonical bright & clean warm porcelain tan canvas and card background for mobile (`/m` and `/preview`) screens |
| **Text Dark Neutral / Ink** | `#211A12` | High-contrast headings, process badges, and body text |
| **Text Muted** | `#8A8175` | Subtitles, secondary copy, and helper descriptions |
| **Surface White** | `#FFFFFF` | Search inputs, filter buttons, elevated dialogs, and action containers |

### Mobile Flow Architecture (`/m`)

The mobile application flow features 8 standing onboarding and authentication interfaces:

1. **Splash Screen** (`/m/splash`): Fullscreen farm visual with Agrivil brand mark and tagline (*"Farm fresh. Market smart. Delivered with care."*).
2. **Welcome Screen** (`/m/onboarding/welcome`): Intro screen showcasing fresh harvest produce with *"Get Started"* and *"I have an account"* CTAs.
3. **How It Works** (`/m/onboarding/how-it-works`): 3-step value overview (Shop, We deliver, Enjoy) with copper/green circular icons.
4. **Location Permission** (`/m/onboarding/location`): Radar-pulse location access prompt to pinpoint nearby farmers.
5. **GhanaPostGPS Setup** (`/m/onboarding/gps`): Ghana digital address capture (`GA-143-3586`) with GPS auto-detection.
6. **Delivery Area Confirmation** (`/m/onboarding/confirm-area`): Verification card displaying confirmed delivery zone.
7. **Sign Up** (`/m/auth/signup`): User registration with name, Ghana phone number (`+233`), optional email, password, and social sign-in.
8. **Login** (`/m/auth/login`): Secure sign-in with phone/password and password recovery.

---

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
