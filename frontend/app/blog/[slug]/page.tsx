import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle, business, categories } from "@/lib/catalog";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hassanelectric.example";

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Guide Not Found" };

  const title = article.seoTitle || `${article.title} | Hassan Electric & Traders`;
  const description = article.metaDescription || article.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blog/${slug}`,
      type: "article",
      publishedTime: article.publishedDate,
      authors: [business.name],
      images: [
        {
          url: article.featuredImage,
          width: 800,
          height: 500,
          alt: article.featuredImageAlt || article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [article.featuredImage],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: [`${siteUrl}${article.featuredImage}`],
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    author: {
      "@type": "Organization",
      name: business.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: business.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${article.slug}`,
    },
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Guides", url: "/blog" },
    { name: article.title, url: `/blog/${article.slug}` },
  ];

  return (
    <>
      <JsonLd data={articleSchema} />

      <div className="content-container">
        <Breadcrumbs items={breadcrumbs} />

        <article className="article-post-layout">
          <header className="article-header">
            <span className="eyebrow">{article.category} · GUIDE</span>
            <h1 className="article-headline">{article.title}</h1>
            <div className="article-byline">
              <span>By <strong>{business.name}</strong></span>
              <span>·</span>
              <span>Updated {article.publishedDate}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          <div className="article-feature-image-wrap">
            <Image
              src={article.featuredImage}
              width={900}
              height={500}
              priority
              alt={article.featuredImageAlt || article.title}
              className="article-feature-img"
            />
          </div>

          <div className="article-body prose">
            {article.content.split("\n\n").map((para, index) => {
              if (para.startsWith("### ")) {
                return <h3 key={index}>{para.replace("### ", "")}</h3>;
              }
              if (para.startsWith("- ")) {
                const items = para.split("\n- ").map((item) => item.replace("- ", ""));
                return (
                  <ul key={index}>
                    {items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={index}>{para}</p>;
            })}
          </div>

          {/* Related Shop Categories */}
          <div className="article-footer-cta">
            <div className="cta-box">
              <h3>Have questions or need materials for your Islamabad project?</h3>
              <p>
                Visit Hassan Electric & Traders at I&T Center G-8/1, Islamabad. We stock pure copper wires, modular switchboards, and circuit breakers.
              </p>
              <div className="cta-actions">
                <a
                  href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
                    `Hello Hassan Electric & Traders, I read your guide "${article.title}" and have a question about materials.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary"
                >
                  💬 Inquire on WhatsApp
                </a>
                <a href={`tel:${business.phone}`} className="button ghost">
                  📞 Call {business.phone}
                </a>
              </div>
            </div>

            <div className="article-categories-list">
              <h4>Browse Our Electrical Products</h4>
              <div className="pill-links">
                {categories.map((c) => (
                  <Link key={c.slug} href={`/categories/${c.slug}`} className="pill-link">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
