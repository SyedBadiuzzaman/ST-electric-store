import Image from "next/image";
import Link from "next/link";
import { business } from "@/lib/catalog";

export function Header() {
  return (
    <>
      <div className="utility">
        <div className="utility-inner">
          <span className="utility-location">
            I & T Center, G-8/1, Islamabad
          </span>
          <span className="utility-phone">
            Direct Shop: <a href={`tel:${business.phone}`}>0330 3000093</a>
          </span>
        </div>
      </div>
      <a className="whatsapp-float" href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hello Hassan Electric & Traders, I am inquiring about electrical supplies in Islamabad.")}`} target="_blank" rel="noopener noreferrer" aria-label="Message Hassan Electric on WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.83a8.216 8.216 0 01-5.82 2.41c-1.46 0-2.88-.38-4.14-1.12l-.3-.18-3.08.81.82-3-.19-.31a8.17 8.17 0 01-1.25-4.44c0-4.54 3.7-8.24 8.24-8.24"/></svg><span>WhatsApp</span>
      </a>
      <header className="site-header">
        <div className="header-container">
          <Link href="/" className="brand">
            <Image className="brand-logo" src="/logo.png" width={64} height={44} alt="Hassan Electric & Traders logo" priority />
            <div className="brand-text">
              <span className="brand-title">Hassan Electric</span>
              <span className="brand-sub">& Traders · Islamabad</span>
            </div>
          </Link>
          <nav className="nav-menu" aria-label="Main Navigation">
            <Link href="/categories/wires-and-cables">Products</Link>
            <Link href="/blog">Guides & Sizing</Link>
            <Link href="/islamabad">Islamabad Shop</Link>
            <Link href="/faq">FAQs</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="header-actions">
            <a className="button directions-btn small" href="https://www.google.com/maps/dir/?api=1&destination=I%20%26%20T%20Center%2C%20Block%2047%20Street%2014%2C%20G-8%2F1%2C%20Islamabad" target="_blank" rel="noopener noreferrer">
              Get directions
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
