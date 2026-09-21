import Link from "next/link";
import { business, categories } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-brand">
            <strong>Hassan Electric & Traders</strong>
            <p className="footer-desc">
              Physical electrical supply store in I&T Center, G-8/1, Islamabad. Supplying verified copper wiring, switchboards, circuit breakers, and power accessories.
            </p>
          </div>
          <div className="footer-hours">
            <strong>Operating Hours</strong>
            <p>Monday – Saturday: 9:00 AM – 8:30 PM<br />Sunday: Closed / Emergency WhatsApp</p>
          </div>
        </div>

        <div className="footer-col">
          <strong>Categories</strong>
          <ul className="footer-links">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <strong>Guides & Info</strong>
          <ul className="footer-links">
            <li><Link href="/blog">Electrical Buying Guides</Link></li>
            <li><Link href="/blog/how-to-choose-electrical-wire-size">Wire Size Guide (1.5mm vs 2.5mm)</Link></li>
            <li><Link href="/blog/understanding-electrical-switch-types">Switch Gangs Explained</Link></li>
            <li><Link href="/blog/how-to-choose-circuit-breaker">Circuit Breaker Safety</Link></li>
            <li><Link href="/islamabad">Islamabad Local Store</Link></li>
            <li><Link href="/faq">Frequently Asked Questions</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <strong>Visit & Contact</strong>
          <p className="footer-address">
            {business.address}
          </p>
          <div className="footer-contact-actions">
            <a href={`tel:${business.phone}`} className="footer-contact-link">
              📞 {business.phone}
            </a>
            <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="footer-contact-link">
              WhatsApp: {business.whatsappDisplay}
            </a>
            <a href={business.maps} target="_blank" rel="noopener noreferrer" className="footer-contact-link">
              🗺️ Open Google Maps Directions
            </a>
          </div>
          <div className="footer-admin-link">
            <Link href="/admin">Staff Admin / SEO Dashboard →</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Hassan Electric & Traders. All rights reserved. I&T Center G-8/1, Islamabad.</p>
        <p className="footer-note">Genuine business information · Direct contact via phone & WhatsApp · No misleading claims</p>
      </div>
    </footer>
  );
}
