"use client";

import { business } from "@/lib/catalog";
import { Analytics } from "@/lib/analytics";

interface ConversionBarProps {
  productName?: string;
  sku?: string;
}

export function ConversionBar({ productName, sku }: ConversionBarProps) {
  const whatsappMessage = productName
    ? `Hello Hassan Electric & Traders, I would like to check price and availability for: ${productName}${sku ? ` (SKU: ${sku})` : ""}.`
    : `Hello Hassan Electric & Traders, I am inquiring about electrical supplies at your G-8/1 shop.`;

  const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <aside aria-label="Quick contact actions" className="conversion-bar">
      <div className="conversion-inner">
        <a
          href={`tel:${business.phone}`}
          className="conversion-btn conversion-call"
          onClick={() => Analytics.trackPhoneClick("conversion_bar")}
          aria-label="Call Hassan Electric"
        >
          <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" />
          </svg>
          <span>Call Shop</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="conversion-btn conversion-whatsapp"
          onClick={() => Analytics.trackWhatsAppClick(productName, "conversion_bar")}
          aria-label="WhatsApp Hassan Electric"
        >
          <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.83a8.216 8.216 0 01-5.82 2.41c-1.46 0-2.88-.38-4.14-1.12l-.3-.18-3.08.81.82-3-.19-.31a8.17 8.17 0 01-1.25-4.44c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.07-.1-.23-.17-.48-.29z" />
          </svg>
          <span>WhatsApp Inquiry</span>
        </a>

        <a
          href={business.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="conversion-btn conversion-maps"
          onClick={() => Analytics.trackDirectionsClick("conversion_bar")}
          aria-label="Get directions on Google Maps"
        >
          <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
          </svg>
          <span>Directions (G-8/1)</span>
        </a>
      </div>
    </aside>
  );
}
