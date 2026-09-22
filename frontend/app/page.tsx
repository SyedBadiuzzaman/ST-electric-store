import Image from "next/image";
import Link from "next/link";
import { articles, business } from "@/lib/catalog";
import { CatalogBrowser } from "@/components/CatalogBrowser";

export default async function Home() {
  const featuredArticles = articles.slice(0, 3);

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text-col">
          <span className="eyebrow">ELECTRICAL SUPPLIES · G-8/1 ISLAMABAD</span>
          <h1 className="hero-title">
            Genuine Electrical Supplies & Copper Wiring for Your Projects
          </h1>
          <p className="lead">
            Find pure copper wires, modular switchboards, circuit breakers, and power fittings from Hassan Electric & Traders in I&T Center G-8/1, Islamabad. Inquire directly on WhatsApp for real-time stock and prices.
          </p>
          <div className="actions">
            <Link className="button primary" href="/categories/wires-and-cables">
              Browse Catalogue
            </Link>
            <a
              className="button ghost"
              href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hello Hassan Electric & Traders, I would like to check prices and availability.")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask on WhatsApp
            </a>
          </div>
          <div className="trust-pills">
            <span className="trust-pill">📍 Physical Shop in G-8/1 Islamabad</span>
            <span className="trust-pill">⚡ Product specifications shown clearly</span>
            <span className="trust-pill">📞 Direct Counter Contact</span>
          </div>
        </div>

        <div className="hero-image-col">
          <div className="hero-image-wrap">
            <Image
              src="/images/cable-image.png"
              width={830}
              height={480}
              priority
              alt="Electrical pure copper cable stock at Hassan Electric & Traders Islamabad"
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="section" aria-labelledby="cat-heading">
        <div className="section-head">
          <span className="eyebrow">ESSENTIAL CATEGORIES</span>
          <h2 id="cat-heading">Built Around What You Need</h2>
          <p>Carefully sourced electrical components for home construction, office setups, and contractor requirements.</p>
        </div>
        <CatalogBrowser />
      </section>

      {/* Buying Guides Preview (Item 83) */}
      <section className="section guides-section" aria-labelledby="guides-heading">
        <div className="section-head">
          <span className="eyebrow">PRACTICAL ADVICE</span>
          <h2 id="guides-heading">Electrical Buying Guides & Safety Tips</h2>
          <p>Read straightforward advice on wire sizing, switch gangs, and circuit breakers.</p>
        </div>
        <div className="articles-grid">
          {featuredArticles.map((art) => (
            <article key={art.slug} className="article-card">
              <Link href={`/blog/${art.slug}`} className="article-thumb-link">
                <Image
                  src={art.featuredImage}
                  width={500}
                  height={280}
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
                <h3 className="article-card-title">
                  <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                </h3>
                <p className="article-card-excerpt">{art.excerpt}</p>
                <Link href={`/blog/${art.slug}`} className="article-read-more">
                  Read guide →
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="center-cta">
          <Link href="/blog" className="button outline">
            Explore All Guides & Sizing Tips →
          </Link>
        </div>
      </section>

      {/* Local Store Location Banner */}
      <section className="location-banner" aria-labelledby="location-heading">
        <div className="location-text">
          <span className="eyebrow">VISIT OUR STORE</span>
          <h2 id="location-heading">Hassan Electric & Traders in G-8/1, Islamabad</h2>
          <p>{business.address}</p>
          <p className="location-hours">Call or WhatsApp to confirm availability before visiting.</p>
        </div>
        <div className="location-actions">
          <a className="button primary" href={business.maps} target="_blank" rel="noopener noreferrer">
            Get Driving Directions
          </a>
          <Link className="button ghost" href="/islamabad">
            Islamabad Store Details
          </Link>
        </div>
      </section>
    </div>
  );
}
