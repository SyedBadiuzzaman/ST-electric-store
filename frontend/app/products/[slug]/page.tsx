import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products, business, categories } from "@/lib/catalog";
import { liveCategory, liveProduct, liveProducts } from "@/lib/live-catalog";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hassanelectric.example";

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await liveProduct(slug);
  if (!p) return { title: "Product Not Found" };

  const title = p.seoTitle || `${p.name} in Islamabad | Hassan Electric & Traders`;
  const description =
    p.metaDescription ||
    `Shop ${p.name} from Hassan Electric & Traders in G-8/1 Islamabad. Check specifications, coil sizes, availability and price on WhatsApp.`;

  return {
    title,
    description,
    alternates: {
      canonical: p.canonicalUrl || `/products/${slug}`,
    },
    robots: {
      index: p.isIndexable !== false,
      follow: p.isIndexable !== false,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/products/${slug}`,
      images: [
        {
          url: p.image,
          width: 800,
          height: 600,
          alt: p.imageAlt || p.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [p.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await liveProduct(slug);
  if (!p) notFound();

  const category = (await liveCategory(p.category)) || {
    name: "Electrical Products",
    slug: "products",
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: [`${siteUrl}${p.image}`],
    sku: p.sku,
    brand: {
      "@type": "Brand",
      name: p.brand || "Standard Quality",
    },
    category: category.name,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${p.slug}`,
      priceCurrency: p.currency || "PKR",
      price: p.price > 0 ? p.price : 0,
      priceValidUntil: "2027-12-31",
      availability:
        p.availability === "InStock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: business.name,
      },
    },
  };

  // Related products from same category or sister categories
  const relatedProducts = (await liveProducts())
    .filter((item) => item.slug !== p.slug && item.category === p.category)
    .slice(0, 3);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: category.name, url: `/categories/${category.slug}` },
    { name: p.name, url: `/products/${p.slug}` },
  ];

  const whatsappInquiryUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    `Hello Hassan Electric & Traders, I am inquiring about availability and pricing for: ${p.name} (SKU: ${p.sku}).`
  )}`;

  return (
    <>
      <JsonLd data={productSchema} />

      <div className="content-container">
        <Breadcrumbs items={breadcrumbs} />

        <article className="product-layout">
          {/* Main Product Hero */}
          <div className="product-hero-grid">
            <div className="product-gallery">
              <div className="image-frame">
                <img src={p.image} alt={p.imageAlt || `${p.name} available at Hassan Electric & Traders`} className="product-main-img" />
              </div>
              <p className="image-caption">
                {p.imageAlt || p.name} · Ask the shop to confirm availability before visiting.
              </p>
            </div>

            <div className="product-summary">
              <span className="product-category-tag">{category.name}</span>
              <h1 className="product-title">{p.name}</h1>
              <p className="product-sku">SKU: <code>{p.sku}</code> · Brand: {p.brand || "Standard"}</p>

              <p className="product-lead">{p.shortDescription}</p>

              <div className="product-availability-badge">
                <span className={`status-indicator ${p.availability === "InStock" ? "in-stock" : "out-of-stock"}`} />
                <span>
                  {p.availability === "InStock"
                    ? "In Stock — Confirm brand & current price via WhatsApp"
                    : "Currently Out of Stock"}
                </span>
              </div>

              <div className="product-actions-box">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary full-width"
                >
                  💬 Ask Price & Availability on WhatsApp
                </a>
                <a href={`tel:${business.phone}`} className="button ghost full-width">
                  📞 Call Shop ({business.phone})
                </a>
              </div>

              <div className="local-trust-banner">
                <div>
                  <strong>📍 In-Store Pickup Available</strong>
                  <p>{business.address}</p>
                </div>
                <a href={business.maps} target="_blank" rel="noopener noreferrer" className="directions-link">
                  Get Directions →
                </a>
              </div>
            </div>
          </div>

          {/* Product Specifications & Details */}
          <section className="product-details-grid" aria-labelledby="specs-heading">
            <div className="details-col">
              <h2>Product Description</h2>
              <div className="prose">
                <p>{p.description}</p>
                <p>
                  For bulk orders, contractor supply rates, or alternative specifications, visit our shop directly in I&T Center G-8/1 or send your requirement list over WhatsApp.
                </p>
              </div>
            </div>

            <div className="details-col">
              <h2 id="specs-heading">Technical Specifications</h2>
              <dl className="specs-table">
                {Object.entries(p.specs).map(([key, value]) => (
                  <div key={key} className="spec-row">
                    <dt className="spec-key">{key}</dt>
                    <dd className="spec-value">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Related Products / Cross-Linking (Item 68) */}
          {relatedProducts.length > 0 && (
            <section className="related-section">
              <h2>Related {category.name} in Islamabad</h2>
              <div className="product-grid">
                {relatedProducts.map((rp) => (
                  <Link href={`/products/${rp.slug}`} className="product-card" key={rp.slug}>
                    <div className="card-image-wrap">
                      <img src={rp.image} alt={rp.imageAlt || rp.name} loading="lazy" />
                    </div>
                    <div className="card-content">
                      <p className="card-category">{category.name}</p>
                      <h3 className="card-title">{rp.name}</h3>
                      <span className="card-link">View Specifications →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
