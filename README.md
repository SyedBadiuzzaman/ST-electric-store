# Hassan Electric & Traders

SEO-first Next.js storefront with a Cloudflare Worker and D1 catalogue API. The frontend includes clean product/category URLs, product and local-business schema, canonical metadata, `robots.txt`, dynamic sitemap generation, mobile contact actions, local content, FAQs and 404 handling.

## Local development

1. In `frontend`, copy `.env.example` to `.env.local`, then run `npm install` and `npm run dev`.
2. The live catalogue is served by `cloudflare-api` and Cloudflare D1; configure the API Worker URL as `NEXT_PUBLIC_API_URL` for frontend builds.

The storefront starts with clear sample catalogue entries in `frontend/lib/catalog.ts`. Move content to the API/database as the admin system is built; product SEO fields already exist in the backend model.

## Deployment

1. Push this folder to GitHub.
2. In Cloudflare Workers, connect the repository with Root directory `frontend`, Build command `npm run build:vinext`, and Deploy command `npm run deploy:vinext`.
3. Add `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` as frontend Worker build variables. Deploy `cloudflare-api` as the separate catalogue Worker and bind it to D1.

Admin product and category changes are stored in Cloudflare D1 and appear on the storefront immediately after saving.
