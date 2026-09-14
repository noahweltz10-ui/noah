# shift culture

Premium, black-and-white editorial rebuild of the shift culture storefront
(Next.js 16 / React 19 / Tailwind v4, GSAP + Lenis for motion, Shopify
Storefront API for cart/checkout).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you have:

- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` / `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`
  — required for real products, add-to-cart, and checkout. Without these the
  site runs on a small local fallback catalog and "add to cart" buttons show
  "coming soon" instead of being wired to a fake cart.
- `RESEND_API_KEY` / `CONTACT_NOTIFY_EMAIL` — optional, sends the contact
  form to your inbox. Without it, submissions are just logged server-side.
- `KLAVIYO_PRIVATE_KEY` / `KLAVIYO_LIST_ID` — optional, subscribes the email
  capture form to a real Klaviyo list. Without it, submissions are just
  logged server-side.

## Known placeholders

- Product photography is a texture-pattern placeholder (`.tex-placeholder`)
  everywhere a real photo isn't available yet. Once Shopify is connected,
  real product images render automatically — no code changes needed.
- The hero background and brand-section imagery (`Hero.tsx`,
  `BrandStatement.tsx`) are still placeholders; drop real photography in and
  swap the marked `div`s for `next/image`.
- `/legal` is a stub — replace with the real Terms/Privacy/Shipping copy
  from the Shopify admin before launch.
