import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hassanelectric.example";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/admin", "/api/", "/cart", "/checkout", "/search"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/products/", "/categories/", "/blog/", "/faq", "/about", "/contact", "/islamabad"],
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/products/", "/categories/", "/blog/", "/faq", "/about", "/contact", "/islamabad"],
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
