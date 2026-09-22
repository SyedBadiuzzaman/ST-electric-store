"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Category, Product } from "@/lib/catalog";

const api = (process.env.NEXT_PUBLIC_API_URL || "https://hassan-electric-catalog-api.menttech4000.workers.dev").replace(/\/$/, "");
const colors: Record<string, string> = { red: "#dc2626", black: "#111827", white: "#fff", blue: "#2563eb", green: "#16a34a", yellow: "#eab308", orange: "#f97316", grey: "#6b7280", gray: "#6b7280", brown: "#92400e" };

export function CatalogBrowser() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("all");
  useEffect(() => { Promise.all([fetch(`${api}/api/products`).then(r => r.ok ? r.json() : []), fetch(`${api}/api/categories`).then(r => r.ok ? r.json() : [])]).then(([items, cats]) => { setProducts(items.map((p: any) => ({ name:p.name, slug:p.slug, category:p.category_slug, price:p.price, currency:p.currency, image:p.image_url, imageAlt:p.image_alt || p.name, shortDescription:p.short_description, description:p.description, sku:p.sku, brand:p.brand, availability:p.availability, specs:p.specs || {}, colors:p.colors || [] }))); setCategories(cats.map((c: any) => ({ name:c.name, slug:c.slug, description:c.description, image:"" }))); }); }, []);
  const visible = useMemo(() => products.filter(p => (selected === "all" || p.category === selected) && `${p.name} ${p.category} ${p.sku} ${p.brand || ""}`.toLowerCase().includes(query.toLowerCase())), [products, query, selected]);
  return <section className="catalog-browser" aria-label="Product search and category filters">
    <label className="catalog-search"><span>Search products</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Product naam, wire, LED, switch..." /></label>
    <div className="catalog-filters" role="group" aria-label="Product categories"><button className={selected === "all" ? "active" : ""} onClick={() => setSelected("all")}>All products</button>{categories.map(c => <button key={c.slug} className={selected === c.slug ? "active" : ""} onClick={() => setSelected(c.slug)}>{c.name}</button>)}</div>
    {!visible.length ? <div className="empty-catalogue"><strong>Abhi product nahi mila.</strong><span>Search ka naam badal kar dekhein ya doosri category select karein.</span></div> : <div className="product-grid">{visible.map(p => <Link className="product-card" href={`/products/${p.slug}`} key={p.slug}><div className="card-image-wrap">{p.image && <img src={p.image} alt={p.imageAlt} loading="lazy" />}</div><div className="card-content"><p className="card-sku">{categories.find(c => c.slug === p.category)?.name || p.category}</p><h3 className="card-title">{p.name}</h3><p className="card-snippet">{p.shortDescription}</p>{(p.colors || []).length > 0 && <div className="product-colors" aria-label={`Available colors: ${p.colors?.join(", ")}`}>{p.colors?.map(color => <span key={color} title={color} style={{ backgroundColor: colors[color.toLowerCase()] || "#64748b" }} />)}</div>}<span className="card-link">Details dekhein</span></div></Link>)}</div>}
  </section>;
}
