import type { Metadata } from "next";
import Link from "next/link";
import { business, categories } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Electrical Shop in Islamabad | Hassan Electric & Traders G-8/1",
  description:
    "Visit Hassan Electric & Traders at I & T Center, G-8/1 Islamabad for pure copper wires, modular switch boards, circuit breakers, and electrical fittings.",
  alternates: {
    canonical: "/islamabad",
  },
  openGraph: {
    title: "Electrical Shop in G-8/1 Islamabad | Hassan Electric & Traders",
    description:
      "Physical electrical supply store in I&T Center G-8/1 Islamabad. Copper wires, switches, circuit breakers, and project supply.",
    url: "https://hassanelectric.example/islamabad",
  },
};

export default function IslamabadPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Islamabad Store", url: "/islamabad" },
  ];

  return (
    <div className="content-container">
      <Breadcrumbs items={breadcrumbs} />

      <header className="page-hero">
        <span className="eyebrow">PHYSICAL ELECTRICAL STORE · ISLAMABAD</span>
        <h1>Electrical Supplies in Islamabad, from a Shop You Can Visit</h1>
        <p className="hero-description">
          Hassan Electric & Traders is situated in I&T Center, G-8/1, Islamabad. We supply verified copper wiring, modular switchboards, distribution boards, and electrical components for homeowners, contractors, and builders across Islamabad.
        </p>
        <div className="hero-actions">
          <a href={`tel:${business.phone}`} className="button primary">
            📞 Call 0330 3000093
          </a>
          <a
            href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hello Hassan Electric & Traders, I am inquiring about electrical supplies in Islamabad.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button ghost"
          >
            💬 WhatsApp Inquiry
          </a>
          <a
            href={business.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="button outline"
          >
            🗺️ Google Maps Directions
          </a>
        </div>
      </header>

      {/* Location Details & Directions */}
      <section className="section two-col-section">
        <div className="info-card">
          <h2>Store Location & Accessibility</h2>
          <p>
            Our store is located in the commercial heart of sector G-8, making it convenient to reach from anywhere in Islamabad:
          </p>
          <div className="address-box">
            <strong>Hassan Electric & Traders</strong>
            <p>{business.address}</p>
            <p><strong>Operating Hours:</strong> Monday – Saturday: 9:00 AM – 8:30 PM (Sunday: Closed)</p>
          </div>

          <h3>Driving Directions</h3>
          <ul className="directions-list">
            <li>
              <strong>From Kashmir / Srinagar Highway:</strong> Take the G-8 exit, proceed directly towards I&T Center on Street 14. We are located in Block 47.
            </li>
            <li>
              <strong>From Blue Area / Zero Point:</strong> Follow Faisal Avenue north and turn onto Kashmir Highway westbound, then enter G-8/1 within 5 minutes.
            </li>
            <li>
              <strong>From Sector F-8 / F-7:</strong> Travel south via Nazim-ud-din Road directly into G-8/1 commercial center.
            </li>
          </ul>
        </div>

        <div className="info-card">
          <h2>What We Stock for Islamabad Projects</h2>
          <p>
            Whether you are wiring a new home in DHA/Bahria/CDA sectors or renovating an apartment or commercial office, we provide genuine electrical essentials:
          </p>
          <ul className="category-feature-list">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`}>
                  <strong>{c.name} →</strong>
                  <span>{c.description}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="highlight-box">
            <strong>Contractors & Electricians:</strong>
            <p>
              We provide bill-of-quantities (BOQ) price estimates for residential and commercial wiring projects. Contact us on WhatsApp with your specifications list.
            </p>
          </div>
        </div>
      </section>

      {/* Areas Served with genuine context */}
      <section className="section areas-served-section">
        <div className="section-head">
          <h2>Serving Homes & Projects Across Islamabad</h2>
          <p>
            Customers visit our G-8/1 location or order via WhatsApp for quick site supply across:
          </p>
        </div>
        <div className="areas-grid">
          <div className="area-badge">Sector G-8, G-9, G-7</div>
          <div className="area-badge">Sector F-8, F-7, F-6</div>
          <div className="area-badge">Blue Area Commercial</div>
          <div className="area-badge">Sector I-8, I-9, I-10</div>
          <div className="area-badge">Sector E-11, F-10, F-11</div>
          <div className="area-badge">Bahria Town & DHA Islamabad</div>
        </div>
      </section>
    </div>
  );
}
