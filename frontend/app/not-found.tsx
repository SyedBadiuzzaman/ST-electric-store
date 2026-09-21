import Link from "next/link";
import { business, categories } from "@/lib/catalog";

export default function NotFound() {
  return (
    <div className="content-container error-page">
      <div className="error-card">
        <span className="eyebrow">404 · NOT FOUND</span>
        <h1>We couldn't find that page.</h1>
        <p className="lead">
          The electrical product, category, or guide you are looking for may have moved or been updated. You can browse our main categories below or ask us on WhatsApp.
        </p>

        <div className="notfound-categories">
          <h3>Browse Main Categories</h3>
          <div className="pill-links">
            {categories.map((c) => (
              <Link key={c.slug} href={`/categories/${c.slug}`} className="pill-link">
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="error-actions">
          <Link className="button primary" href="/">
            Back to Home
          </Link>
          <a
            className="button ghost"
            href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hello Hassan Electric & Traders, I am looking for a specific electrical item that I could not find on your site.")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask Us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
