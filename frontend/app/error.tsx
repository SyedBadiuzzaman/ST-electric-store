"use client";

import { useEffect } from "react";
import Link from "next/link";
import { business } from "@/lib/catalog";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront Error:", error);
  }, [error]);

  return (
    <div className="content-container error-page">
      <div className="error-card">
        <span className="eyebrow">500 ERROR</span>
        <h1>We ran into an unexpected issue.</h1>
        <p className="lead">
          Our catalogue system is temporarily updating. You can try refreshing the page, or contact our G-8/1 shop directly on WhatsApp for immediate assistance.
        </p>
        <div className="error-actions">
          <button onClick={() => reset()} className="button primary">
            Try Again
          </button>
          <Link href="/" className="button ghost">
            Return Home
          </Link>
          <a
            href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hello Hassan Electric & Traders, I encountered an issue on your website.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button outline"
          >
            Inquire on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
