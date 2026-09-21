"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category } from "@/lib/catalog";
import { freshImageUrl } from "@/lib/image-url";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => { if (categories.length < 2) return; const timer = window.setInterval(() => setActive((current) => (current + 1) % categories.length), 2000); return () => window.clearInterval(timer); }, [categories.length]);
  if (!categories.length) return <div className="empty-catalogue"><strong>No categories yet.</strong><span>Add your first category in Admin to begin building the shop.</span></div>;
  const category = categories[active];
  return <div className="category-carousel">
    <Link className="category-stage" href={`/categories/${category.slug}`}>
      <img src={freshImageUrl(category.image, category.imageVersion)} alt={category.name} />
      <div className="category-stage-copy"><span>Shop category</span><h3>{category.name}</h3><p>{category.description}</p><strong>View products</strong></div>
    </Link>
    <div className="carousel-controls">
      <div className="carousel-dots">{categories.slice(0, 3).map((item, index) => <button key={item.slug} aria-label={`Show ${item.name}`} onClick={() => setActive(index)} className={index === active ? "active" : ""} />)}</div>
      <button type="button" className="more-categories" onClick={() => setShowAll(!showAll)} aria-expanded={showAll}>All categories</button>
    </div>
    {showAll && <div className="all-categories-panel">{categories.map((item) => <Link href={`/categories/${item.slug}`} key={item.slug}>{item.name}<span>Explore</span></Link>)}</div>}
  </div>;
}
