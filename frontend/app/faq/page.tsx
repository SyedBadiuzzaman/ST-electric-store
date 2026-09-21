import type { Metadata } from "next";
import { faqs, business } from "@/lib/catalog";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Hassan Electric & Traders Islamabad",
  description:
    "Find answers about electrical wire sizes, switchboards, product availability, store location in G-8/1 Islamabad, and WhatsApp ordering.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQs | Hassan Electric & Traders Islamabad",
    description: "Clear questions and answers on electrical supplies, location, and ordering in Islamabad.",
    url: "https://hassanelectric.example/faq",
  },
};

export default function FAQPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Frequently Asked Questions", url: "/faq" },
  ];

  // Group faqs by category
  const categoriesList = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <>
      <JsonLd data={schema} />

      <div className="content-container">
        <Breadcrumbs items={breadcrumbs} />

        <header className="page-hero">
          <span className="eyebrow">HELPFUL INFORMATION · TRANSPARENCY</span>
          <h1>Frequently Asked Questions</h1>
          <p className="hero-description">
            Quick, reliable answers to the most common questions about Hassan Electric & Traders, our physical location in G-8/1 Islamabad, product stock, and WhatsApp orders.
          </p>
        </header>

        <section className="section faq-section">
          {categoriesList.map((cat) => {
            const catFaqs = faqs.filter((f) => f.category === cat);
            return (
              <div key={cat} className="faq-category-group">
                <h2 className="faq-cat-title">{cat}</h2>
                <div className="faq-list">
                  {catFaqs.map((faq, index) => (
                    <details key={index} className="faq-item" open={index === 0}>
                      <summary className="faq-question">
                        <span>{faq.question}</span>
                        <span className="faq-icon" aria-hidden="true">+</span>
                      </summary>
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <section className="section highlight-box">
          <h3>Have another question not listed here?</h3>
          <p>
            We are always happy to help. Call us at <strong>{business.phone}</strong> or send a message directly to our WhatsApp at <strong>{business.whatsappDisplay}</strong>.
          </p>
          <div className="actions">
            <a
              href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hello Hassan Electric & Traders, I have a question about your electrical products.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button primary"
            >
              Ask on WhatsApp
            </a>
            <a href={`tel:${business.phone}`} className="button ghost">
              Call Shop
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
