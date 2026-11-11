# Branding Catalyst

Company website for Branding Catalyst: AI products, AEO and GEO, Android and iOS apps, ERP systems, websites and 3D web experiences.

It is a single static page with no build step and no backend.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site: layout, styles and scripts |
| `logo.png` | Brand logo, also used as the browser-tab icon |
| `nova.webp` | Face image for ARC, the AI assistant in the hero |

## Run locally

Any static file server works. For example:

```bash
npx serve .
```

Then open the address it prints.

## Deploy

Upload the three files to any static host (Netlify, Vercel, GitHub Pages, Hostinger or cPanel). No build step is needed.

## Before going live

- Replace every `[X]` placeholder (client counts, stats, email, phone, social links) with real details.
- Set real timelines, roles and tech stacks in the `PRODUCTS` and `FEATURES` lists in the script. The idea checker and ARC use them to build estimates.
- Set the discount values and odds in `DISCOUNTS` (idea checker wheel).
- Confirm the guarantee terms in the "Our promise" section.
- Replace the client logo tiles with real logos, used with permission.

## ARC lip sync

ARC's mouth position comes from the `FACE` settings in the script, measured in the image's own pixels (1024 × 1024):

- `mouthY`: the line between the lips
- `mouthW`: mouth width
- `jawBottom`: where the chin stops moving

Adjust these if you replace `nova.webp`.
