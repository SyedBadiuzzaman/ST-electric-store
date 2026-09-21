"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category } from "@/lib/catalog";
import { freshImageUrl } from "@/lib/image-url";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  const [liveCategories, setLiveCategories] = useState<Category[]>(categories);
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    setLiveCategories(categories);
    if (categories.length) return;
    const api = (process.env.NEXT_PUBLIC_API_URL || "https://hassan-electric-catalog-api.menttech4000.workers.dev").replace(/\/$/, "");
    fetch(`${api}/api/categories`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((items) => Array.isArray(items) && setLiveCategories(items.map((item) => ({ name: item.name, slug: item.slug, description: item.description, image: item.image_url || "/images/cable-image.png", imageVersion: item.updated_at || "", seoTitle: item.seo_title, metaDescription: item.meta_description }))));
  }, [categories]);
  useEffect(() => { if (liveCategories.length < 2) return; const timer = window.setInterval(() => setActive((current) => (current + 1) % liveCategories.length), 2000); return () => window.clearInterval(timer); }, [liveCategories.length]);
  if (!liveCategories.length) return <div className="empty-catalogue"><strong>No categories yet.</strong><span>Add your first category in Admin to begin building the shop.</span></div>;
  const category = liveCategories[active % liveCategories.length];
  return <div className="category-carousel">
    <Link className="category-stage" href={`/categories/${category.slug}`}>
      <img src={freshImageUrl(category.image, category.imageVersion)} alt={category.name} />
      <div className="category-stage-copy"><span>Shop category</span><h3>{category.name}</h3><p>{category.description}</p><strong>View products</strong></div>
    </Link>
    <div className="carousel-controls">
      <div className="carousel-dots">{liveCategories.slice(0, 3).map((item, index) => <button key={item.slug} aria-label={`Show ${item.name}`} onClick={() => setActive(index)} className={index === active ? "active" : ""} />)}</div>
      <button type="button" className="more-categories" onClick={() => setShowAll(!showAll)} aria-expanded={showAll}>All categories</button>
    </div>
    {showAll && <div className="all-categories-panel">{liveCategories.map((item) => <Link href={`/categories/${item.slug}`} key={item.slug}>{item.name}<span>Explore</span></Link>)}</div>}
  </div>;
}
