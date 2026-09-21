import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConversionBar } from "@/components/ConversionBar";
import { business } from "@/lib/catalog";
import { JsonLd } from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hassanelectric.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hassan Electric & Traders | Electrical Shop in Islamabad",
    template: "%s | Hassan Electric & Traders",
  },
  description:
    "Hassan Electric & Traders in G-8/1 Islamabad supplies pure copper wires, modular switches, sockets, circuit breakers, and electrical fittings. Visit in person or contact via WhatsApp.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: business.name,
    title: "Hassan Electric & Traders | Electrical Shop in Islamabad",
    description:
      "Physical electrical supply store located in I&T Center G-8/1 Islamabad. Genuine copper wires, switches, and circuit protection.",
    url: siteUrl,
    images: [
      {
        url: "/images/cable-image.png",
        width: 1200,
        height: 630,
        alt: "Hassan Electric & Traders - Islamabad Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hassan Electric & Traders | Electrical Supplies Islamabad",
    description: "Electrical wires, switches, circuit breakers and fittings in G-8/1, Islamabad.",
    images: ["/images/cable-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "PK-IS",
    "geo.placename": "Islamabad",
    "geo.position": "33.6938;73.0450",
    "ICBM": "33.6938, 73.0450",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ElectricalSupplyStore",
    "@id": `${siteUrl}/#store`,
    name: business.name,
    legalName: business.legalName,
    description:
      "Physical electrical supply store in I&T Center G-8/1, Islamabad supplying pure copper wires, modular switch boards, circuit breakers, and wiring accessories.",
    url: siteUrl,
    telephone: business.phone,
    hasMap: business.maps,
    priceRange: business.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      addressLocality: business.city,
      addressRegion: "Islamabad Capital Territory",
      postalCode: business.postalCode,
      addressCountry: business.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "https://schema.org/Monday",
          "https://schema.org/Tuesday",
          "https://schema.org/Wednesday",
          "https://schema.org/Thursday",
          "https://schema.org/Friday",
          "https://schema.org/Saturday",
        ],
        opens: "09:00",
        closes: "20:30",
      },
    ],
    areaServed: {
      "@type": "City",
      name: "Islamabad",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: business.phoneIntl,
      contactType: "customer service",
      areaServed: "PK",
      availableLanguage: ["en", "ur"],
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" />
      </head>
      <body>
        <JsonLd data={localBusinessSchema} />
        <Header />
        <main className="main-content">{children}</main>
        <Footer />
        <ConversionBar />
      </body>
    </html>
  );
}
