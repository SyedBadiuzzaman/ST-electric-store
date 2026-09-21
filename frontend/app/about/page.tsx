import type { Metadata } from "next";
import Link from "next/link";
import { business, categories } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About Us | Hassan Electric & Traders Islamabad",
  description:
    "Learn about Hassan Electric & Traders, a physical electrical supplies shop in I&T Center G-8/1, Islamabad. Transparent service, genuine copper cables and switches.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Hassan Electric & Traders | Islamabad Electrical Store",
    description: "Physical electrical shop in I&T Center G-8/1, Islamabad. Supplying copper wires, switches, and circuit protection.",
    url: "https://hassanelectric.example/about",
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ];

  return (
    <div className="content-container">
      <Breadcrumbs items={breadcrumbs} />

      <header className="page-hero">
        <span className="eyebrow">ABOUT THE SHOP · ISLAMABAD</span>
        <h1>Hassan Electric & Traders</h1>
        <p className="hero-description">
          A physical electrical products and wiring supply store operating out of I & T Center, G-8/1, Islamabad. We serve residential property owners, renovation contractors, and local electricians with dependable electrical essentials.
        </p>
      </header>

      <section className="section prose">
        <h2>Who We Are</h2>
        <p>
          Hassan Electric & Traders was established to provide reliable, authentic electrical goods without ambiguity. In an industry where wire gauge standards and material purity vary widely, we focus on genuine copper conductors, safe polycarbonate switch plates, and properly rated circuit breakers.
        </p>

        <h2>What We Supply</h2>
        <p>
          Our inventory covers the fundamental electrical infrastructure required for new constructions, renovations, and routine maintenance:
        </p>
        <ul>
          {categories.map((c) => (
            <li key={c.slug}>
              <strong><Link href={`/categories/${c.slug}`}>{c.name}</Link>:</strong> {c.description}
            </li>
          ))}
        </ul>

        <h2>Our Physical Location & Presence</h2>
        <p>
          Unlike virtual dropshippers or directory listings without real inventory, Hassan Electric & Traders maintains a brick-and-mortar storefront in Islamabad:
        </p>
        <div className="highlight-box">
          <p>
            <strong>Store Address:</strong> {business.address}<br />
            <strong>Telephone:</strong> <a href={`tel:${business.phone}`}>{business.phone}</a><br />
            <strong>WhatsApp:</strong> <a href={`https://wa.me/${business.whatsapp}`}>{business.whatsappDisplay}</a><br />
            <strong>Store Hours:</strong> Monday – Saturday: 9:00 AM – 8:30 PM (Sunday: Closed)
          </p>
          <a href={business.maps} target="_blank" rel="noopener noreferrer" className="button small">
            View on Google Maps →
          </a>
        </div>

        <h2>Contractor & Electrician Inquiries</h2>
        <p>
          We assist building contractors and electrical technicians with material estimation, brand options, and coil quantity requirements. Feel free to contact our counter staff or message us via WhatsApp with your project needs.
        </p>
      </section>
    </div>
  );
}
