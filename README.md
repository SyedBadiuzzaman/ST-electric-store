# Hassan Electric & Traders

SEO-first Next.js storefront and FastAPI catalogue API. The frontend includes clean product/category URLs, product and local-business schema, canonical metadata, `robots.txt`, dynamic sitemap generation, mobile contact actions, local content, FAQs and 404 handling.

## Local development

1. In `frontend`, copy `.env.example` to `.env.local`, then run `npm install` and `npm run dev`.
2. In `backend`, create a Python virtual environment, install `requirements.txt`, then run `uvicorn app.main:app --reload`.

The storefront starts with clear sample catalogue entries in `frontend/lib/catalog.ts`. Move content to the API/database as the admin system is built; product SEO fields already exist in the backend model.

## Deployment

1. Push this folder to GitHub.
2. In Render, create a Blueprint from the repository and select `render.yaml`. Set `CORS_ORIGINS` to your Cloudflare Pages domain after the first frontend deployment.
3. In Cloudflare Pages, connect the same repository. Set Root directory to `frontend`, Build command to `npm run build`, and output directory to `.next`. Add `NEXT_PUBLIC_SITE_URL` (your production domain) and `NEXT_PUBLIC_API_URL` (the Render API URL).
4. Add the Cloudflare domain to `CORS_ORIGINS` in Render. Then point a custom domain’s DNS at Cloudflare Pages and update `NEXT_PUBLIC_SITE_URL` to it.

For a database outside Render, create a PostgreSQL instance at your chosen provider and set Render’s `DATABASE_URL` to its full connection string. The included Render Blueprint provisions Render PostgreSQL by default.
