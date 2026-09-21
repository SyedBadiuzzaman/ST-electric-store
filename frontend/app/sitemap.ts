import type { MetadataRoute } from "next";
import { categories, products, articles } from "@/lib/catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hassanelectric.example";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Core static pages with defined SEO priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/islamabad`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${siteUrl}/categories/wires-and-cables`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  try {
    // Attempt dynamic retrieval from backend API
    const res = await fetch(`${apiUrl}/api/sitemap-entries`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const dynamicCategories = data.categories.map((c: any) => ({
        url: `${siteUrl}/categories/${c.slug}`,
        lastModified: now,
        changeFrequency: c.changefreq || "weekly",
        priority: c.priority || 0.8,
      }));

      const dynamicProducts = data.products.map((p: any) => ({
        url: `${siteUrl}/products/${p.slug}`,
        lastModified: now,
        changeFrequency: p.changefreq || "weekly",
        priority: p.priority || 0.9,
      }));

      const dynamicArticles = data.articles.map((a: any) => ({
        url: `${siteUrl}/blog/${a.slug}`,
        lastModified: now,
        changeFrequency: a.changefreq || "monthly",
        priority: a.priority || 0.75,
      }));

      return [...staticRoutes, ...dynamicCategories, ...dynamicProducts, ...dynamicArticles];
    }
  } catch {
    // Fall back to catalog
  }

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.isIndexable !== false)
    .map((p) => ({
      url: `${siteUrl}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/blog/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...articleRoutes];
}
