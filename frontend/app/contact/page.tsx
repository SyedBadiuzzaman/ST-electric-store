import type { Metadata } from "next";
import { business } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact Hassan Electric & Traders | G-8/1 Islamabad",
  description:
    "Get in touch with Hassan Electric & Traders in I&T Center G-8/1 Islamabad. Call 0330 3000093 or send a WhatsApp message to check electrical stock.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Hassan Electric & Traders | G-8/1 Islamabad",
    description: "Call, WhatsApp, or visit Hassan Electric & Traders in I&T Center, G-8/1 Islamabad.",
    url: "https://hassanelectric.example/contact",
  },
};

export default function ContactPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ];

  return (
    <div className="content-container">
      <Breadcrumbs items={breadcrumbs} />

      <header className="page-hero">
        <span className="eyebrow">GET IN TOUCH · PROMPT RESPONSE</span>
        <h1>Contact Hassan Electric & Traders</h1>
        <p className="hero-description">
          The fastest way to confirm availability, brands, and current market prices is to call us or message our team directly on WhatsApp with your required product or wire size.
        </p>
      </header>

      <section className="section contact-grid">
        <div className="contact-methods">
          <div className="contact-card-highlight">
            <span className="contact-card-icon">💬</span>
            <div className="contact-card-body">
              <h3>WhatsApp Inquiry</h3>
              <p>Send your bill of quantities (BOQ) or ask about wire sizes & prices.</p>
              <a
                href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hello Hassan Electric & Traders, I am inquiring about electrical supplies in Islamabad.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button primary"
              >
                Message {business.whatsappDisplay}
              </a>
            </div>
          </div>

          <div className="contact-card-highlight">
            <span className="contact-card-icon">📞</span>
            <div className="contact-card-body">
              <h3>Telephone Counter</h3>
              <p>Call our counter directly during shop hours for instant information.</p>
              <a href={`tel:${business.phone}`} className="button ghost">
                Call {business.phone}
              </a>
            </div>
          </div>

          <div className="contact-card-highlight">
            <span className="contact-card-icon">🗺️</span>
            <div className="contact-card-body">
              <h3>In-Store Visit</h3>
              <p>Visit our counter in I & T Center, Block 47 Street 14, G-8/1, Islamabad.</p>
              <a
                href={business.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="button outline"
              >
                Open Google Maps Navigation
              </a>
            </div>
          </div>
        </div>

        <div className="store-details-panel">
          <h2>Store Location & Operating Hours</h2>
          <div className="details-entry">
            <strong>Full Physical Address:</strong>
            <p>{business.address}</p>
          </div>
          <div className="details-entry">
            <strong>Business Days & Hours:</strong>
            <p>Monday – Saturday: 9:00 AM – 8:30 PM<br />Sunday: Closed</p>
          </div>
          <div className="details-entry">
            <strong>Landmarks Nearby:</strong>
            <p>I&T Center G-8/1, adjacent to Kashmir Highway exit, near Zero Point interchange.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
