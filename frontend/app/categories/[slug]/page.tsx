import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory, products, business } from "@/lib/catalog";
import { liveCategories, liveCategory, liveProducts } from "@/lib/live-catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hassanelectric.example";

export function generateStaticParams() {
  return categories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await liveCategory(slug);
  if (!c) return { title: "Category Not Found" };

  const title = c.seoTitle || `${c.name} in Islamabad | Hassan Electric & Traders`;
  const description =
    c.metaDescription ||
    `Browse ${c.name} at Hassan Electric & Traders in G-8/1 Islamabad. Check specifications, availability and inquire via WhatsApp.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/categories/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/categories/${slug}`,
      images: [{ url: c.image, width: 800, height: 500, alt: c.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [c.image],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await liveCategory(slug);
  if (!category) notFound();

  const [allProducts, allCategories] = await Promise.all([liveProducts(), liveCategories()]);
  const list = allProducts.filter((p) => p.category === slug);
  const otherCategories = allCategories.filter((c) => c.slug !== slug);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Categories", url: "/categories/wires-and-cables" },
    { name: category.name, url: `/categories/${category.slug}` },
  ];

  return (
    <div className="content-container">
      <Breadcrumbs items={breadcrumbs} />

      <header className="page-hero">
        <span className="eyebrow">CATEGORY · ISLAMABAD</span>
        <h1>{category.name} in Islamabad</h1>
        <p className="hero-description">{category.description}</p>
        {category.keySpecs && (
          <div className="key-specs-tags">
            {category.keySpecs.map((spec) => (
              <span key={spec} className="spec-tag">
                ✓ {spec}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Product List */}
      <section className="section" aria-labelledby="products-heading">
        <div className="section-head">
          <h2 id="products-heading">Available {category.name}</h2>
          <p>
            Visit our physical shop at I&T Center G-8/1 or contact us on WhatsApp to check immediate stock, brand choices, and daily market rates.
          </p>
        </div>

        {list.length ? (
          <div className="product-grid">
            {list.map((p) => (
              <Link href={`/products/${p.slug}`} className="product-card" key={p.slug}>
                <div className="card-image-wrap">
                  <img src={p.image} alt={p.imageAlt || p.name} loading="lazy" />
                </div>
                <div className="card-content">
                  <p className="card-sku">{p.sku}</p>
                  <h3 className="card-title">{p.name}</h3>
                  <p className="card-snippet">{p.shortDescription}</p>
                  <span className="card-link">View Specifications & Inquire →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Looking for a specific specification?</h3>
            <p>
              We stock additional sizes and brands in our G-8/1 Islamabad store. Contact us directly with your required gauge, length, or model.
            </p>
            <a
              href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hello, I am looking for ${category.name} items at your shop.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button primary"
            >
              Ask on WhatsApp
            </a>
          </div>
        )}
      </section>

      {/* Internal Linking & Related Categories (Item 65, 68) */}
      <section className="section related-categories-section">
        <div className="section-head">
          <h2>Explore Other Electrical Categories</h2>
          <p>Complete your electrical supply checklist with matched components.</p>
        </div>
        <div className="category-grid">
          {otherCategories.map((c) => (
            <Link className="category-card" href={`/categories/${c.slug}`} key={c.slug}>
              <div className="category-thumb">
                <img src={c.image} alt={c.name} loading="lazy" />
              </div>
              <div className="category-info">
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <span className="category-action">Browse {c.name} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
