import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Electrical Buying Guides & Sizing Tips | Hassan Electric & Traders",
  description:
    "Expert buying guides on electrical wire sizes (1.5mm vs 2.5mm vs 4mm), switch board gang types, and circuit breaker protection for Pakistani homes.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Electrical Guides & Tips | Hassan Electric & Traders Islamabad",
    description: "Practical electrical sizing and safety guides written for Islamabad homeowners and electricians.",
    url: "https://hassanelectric.example/blog",
  },
};

export default function BlogIndexPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Buying Guides", url: "/blog" },
  ];

  return (
    <div className="content-container">
      <Breadcrumbs items={breadcrumbs} />

      <header className="page-hero">
        <span className="eyebrow">PRACTICAL GUIDES · ELECTRICAL SAFETY</span>
        <h1>Electrical Buying Guides & Technical Tips</h1>
        <p className="hero-description">
          Practical, straightforward advice from Hassan Electric & Traders on selecting wire gauges, switch boards, and circuit protection to keep your property safe and efficient.
        </p>
      </header>

      <section className="section" aria-label="Articles list">
        <div className="articles-grid">
          {articles.map((art) => (
            <article key={art.slug} className="article-card">
              <Link href={`/blog/${art.slug}`} className="article-thumb-link">
                <Image
                  src={art.featuredImage}
                  width={600}
                  height={340}
                  alt={art.featuredImageAlt || art.title}
                  loading="lazy"
                />
              </Link>
              <div className="article-card-body">
                <div className="article-meta">
                  <span className="article-category">{art.category}</span>
                  <span className="article-dot">·</span>
                  <span className="article-time">{art.readTime}</span>
                </div>
                <h2 className="article-card-title">
                  <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                </h2>
                <p className="article-card-excerpt">{art.excerpt}</p>
                <Link href={`/blog/${art.slug}`} className="article-read-more">
                  Read full guide →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section highlight-box">
        <h3>Need personalised technical advice for your wiring project?</h3>
        <p>
          Visit Hassan Electric & Traders in I&T Center G-8/1, Islamabad, or send your electrical plan or bill of quantities (BOQ) to our WhatsApp at +92 330 3000093.
        </p>
      </section>
    </div>
  );
}
