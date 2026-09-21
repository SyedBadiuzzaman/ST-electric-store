import { type Category, type Product } from "@/lib/catalog";
// Local development works without an env file. Production must set NEXT_PUBLIC_API_URL.
const api = (process.env.NEXT_PUBLIC_API_URL || "https://hassan-electric-catalog-api.menttech4000.workers.dev").replace(/\/$/, "");
const productFromApi = (p: any): Product => ({name:p.name,slug:p.slug,category:p.category_slug,price:p.price,currency:p.currency,image:p.image_url || "/images/cable-image.png",imageAlt:p.image_alt || p.name,shortDescription:p.short_description,description:p.description,sku:p.sku,brand:p.brand,availability:p.availability,specs:p.specs || {},seoTitle:p.seo_title,metaDescription:p.meta_description,canonicalUrl:p.canonical_url,isIndexable:p.is_indexable});
const categoryFromApi = (c: any): Category => ({name:c.name,slug:c.slug,description:c.description,image:c.image_url || "/images/cable-image.png",imageVersion:c.updated_at || "",seoTitle:c.seo_title,metaDescription:c.meta_description});
async function read(path:string) { if (!api) return null; try { const r=await fetch(`${api}${path}`,{cache:"no-store"}); return r.ok ? r.json() : null; } catch { return null; } }
export async function liveProducts(){const data=await read("/api/products"); return Array.isArray(data) ? data.map(productFromApi) : [];}
export async function liveProduct(slug:string){const data=await read(`/api/products/${slug}`); return data ? productFromApi(data) : undefined;}
export async function liveCategories(){const data=await read("/api/categories"); return Array.isArray(data) ? data.map(categoryFromApi) : [];}
export async function liveCategory(slug:string){const data=await read(`/api/categories/${slug}`); return data ? categoryFromApi(data) : undefined;}
