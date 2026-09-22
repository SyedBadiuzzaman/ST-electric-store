"use client";

import { business } from "@/lib/catalog";
import { Analytics } from "@/lib/analytics";

interface ConversionBarProps {
  productName?: string;
  sku?: string;
}

export function ConversionBar({ productName, sku }: ConversionBarProps) {
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
          <span>Call</span>
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
          <span>Directions</span>
        </a>
      </div>
    </aside>
  );
}
