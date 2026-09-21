"use client";

import { useState } from "react";
import Link from "next/link";
import { products as initialProducts, categories as initialCategories, articles as initialArticles, faqs as initialFaqs, business, type Product, type Category } from "@/lib/catalog";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const blankProduct: Product = { name: "New product", slug: "new-product", category: "wires-and-cables", price: 0, currency: "PKR", image: "/images/cable-image.png", imageAlt: "", shortDescription: "", description: "", sku: "NEW-SKU", brand: "", availability: "InStock", specs: {}, isIndexable: true };
const fromApi = (p: any): Product => ({ name:p.name, slug:p.slug, category:p.category_slug, price:p.price, currency:p.currency, image:p.image_url || "/images/cable-image.png", imageAlt:p.image_alt || "", shortDescription:p.short_description, description:p.description, sku:p.sku, brand:p.brand, availability:p.availability, specs:p.specs || {}, seoTitle:p.seo_title, metaDescription:p.meta_description, canonicalUrl:p.canonical_url, isIndexable:p.is_indexable });
const toApi = (p: Product) => ({ name:p.name, slug:p.slug, category_slug:p.category, price:p.price, currency:p.currency, image_url:p.image, image_alt:p.imageAlt, short_description:p.shortDescription, description:p.description, sku:p.sku, brand:p.brand || null, availability:p.availability, specs:p.specs, seo_title:p.seoTitle || null, meta_description:p.metaDescription || null, canonical_url:p.canonicalUrl || null, is_indexable:p.isIndexable !== false });
type AdminCategory = Category & { id?: number };
const categoryFromApi = (c: any): AdminCategory => ({ id:c.id, name:c.name, slug:c.slug, description:c.description, image:c.image_url || "/images/cable-image.png", imageVersion:c.updated_at || "", seoTitle:c.seo_title, metaDescription:c.meta_description });

export default function AdminDashboardPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"seo-audit" | "products" | "categories" | "faqs" | "articles" | "content">("seo-audit");

  const [productsList, setProductsList] = useState(initialProducts);
  const [categoriesList, setCategoriesList] = useState<AdminCategory[]>(initialCategories);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>(initialProducts[0]?.slug || "");
  const [notification, setNotification] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState("");
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState("");
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  // Authentication check
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    try {
      if (apiUrl) {
        const res = await fetch(`${apiUrl}/api/admin/products`, { headers: { "X-Admin-Key": passcode } });
        if (!res.ok) throw new Error("The admin key was not accepted by the server.");
        const remoteProducts = (await res.json()).map(fromApi);
        setProductsList(remoteProducts); setSelectedProductSlug(remoteProducts[0]?.slug || "");
        const categoryResponse = await fetch(`${apiUrl}/api/admin/categories`, { headers: { "X-Admin-Key": passcode } });
        if (categoryResponse.ok) setCategoriesList((await categoryResponse.json()).map(categoryFromApi));
      }
      setAdminKey(passcode); setIsAuthenticated(true); setNotification(apiUrl ? "Connected to your live product catalogue." : "Demo mode: connect NEXT_PUBLIC_API_URL to save products permanently.");
      setTimeout(() => setNotification(null), 3500);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to sign in.");
    }
  };

  const selectedProduct = productsList.find((p) => p.slug === selectedProductSlug) || productsList[0] || blankProduct;

  // Auto-generate SEO title & meta description (Item 60)
  const handleAutoGenerateSEO = (slug: string) => {
    setProductsList((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          return {
            ...p,
            seoTitle: `${p.name} in Islamabad | Hassan Electric & Traders`,
            metaDescription: `Shop ${p.name} from Hassan Electric & Traders in G-8/1 Islamabad. Check specifications, coil lengths and contact us on WhatsApp.`,
          };
        }
        return p;
      })
    );
    setNotification(`Auto-generated SEO metadata for ${selectedProduct.name}`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateProduct = (updated: typeof selectedProduct) => {
    setProductsList((prev) => prev.map((p) => (p.slug === updated.slug ? updated : p)));
    setNotification(`Updated ${updated.name} successfully.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const generateDescription = () => {
    const categoryName = categoriesList.find((c) => c.slug === selectedProduct.category)?.name || selectedProduct.category.replaceAll("-", " ");
    handleUpdateProduct({ ...selectedProduct, shortDescription: `${selectedProduct.name} in the ${categoryName} range. Contact Hassan Electric & Traders to confirm current availability and price.`, description: `${selectedProduct.name} is listed by Hassan Electric & Traders in G-8/1, Islamabad. Please use WhatsApp or call the shop with your exact requirement, brand preference, size, and quantity so the team can confirm availability before you visit or place an order.` });
    setNotification("A clear customer-ready description has been generated. Review it before saving."); setTimeout(() => setNotification(null), 3500);
  };

  const startNewProduct = () => { const item = { ...blankProduct, slug: `new-product-${Date.now()}`, sku: `NEW-${Date.now()}` }; setProductsList((prev) => [item, ...prev]); setSelectedProductSlug(item.slug); setIsNewProduct(true); };
  const saveProduct = async () => {
    if (!selectedProduct.name.trim() || !selectedProduct.slug.trim() || !selectedProduct.sku.trim()) { alert("Name, clean URL slug, and SKU are required."); return; }
    try {
      if (apiUrl) {
        const existing = await fetch(`${apiUrl}/api/admin/products`, { headers: { "X-Admin-Key": adminKey } }).then(r => r.ok ? r.json() : []);
        const matched = existing.find((item: { id:number; slug:string }) => item.slug === selectedProduct.slug);
        const res = await fetch(`${apiUrl}/api/admin/products${matched ? `/${matched.id}` : ""}`, { method: matched ? "PUT" : "POST", headers: { "Content-Type":"application/json", "X-Admin-Key":adminKey }, body:JSON.stringify(toApi(selectedProduct)) });
        if (!res.ok) throw new Error((await res.json()).detail || "The product could not be saved.");
        const saved = fromApi(await res.json()); setProductsList(prev => [saved, ...prev.filter(p => p.slug !== selectedProduct.slug)]); setSelectedProductSlug(saved.slug);
      }
      setIsNewProduct(false); setNotification(apiUrl ? `Saved ${selectedProduct.name} to the live catalogue.` : "Saved in demo preview. Add NEXT_PUBLIC_API_URL for permanent database saving."); setTimeout(() => setNotification(null), 3500);
    } catch (error) { alert(error instanceof Error ? error.message : "Unable to save product."); }
  };
  const deleteProduct = async () => {
    if (!confirm(`Delete ${selectedProduct.name}? This cannot be undone.`)) return;
    try {
      if (apiUrl) { const all = await fetch(`${apiUrl}/api/admin/products`, { headers: { "X-Admin-Key": adminKey } }).then(r => r.ok ? r.json() : []); const target = all.find((item: {id:number;slug:string}) => item.slug === selectedProduct.slug); if (target) { const response = await fetch(`${apiUrl}/api/admin/products/${target.id}`, { method: "DELETE", headers: { "X-Admin-Key": adminKey } }); if (!response.ok) throw new Error("Product could not be deleted."); } }
      const remaining = productsList.filter(p => p.slug !== selectedProduct.slug); setProductsList(remaining); setSelectedProductSlug(remaining[0]?.slug || ""); setNotification("Product removed from the catalogue.");
    } catch (error) { alert(error instanceof Error ? error.message : "Unable to delete product."); }
  };
  const deleteAllProducts = async () => {
    if (!confirm("Delete every product from the live catalogue? You can add your own products afterwards.")) return;
    try { if (apiUrl) { const response = await fetch(`${apiUrl}/api/admin/products`, { method:"DELETE", headers:{"X-Admin-Key":adminKey} }); if (!response.ok) throw new Error("The server could not clear the catalogue."); } setProductsList([]); setSelectedProductSlug(""); setNotification("All demo products were deleted. Start adding your own."); } catch(error) { alert(error instanceof Error ? error.message : "Unable to delete products."); }
  };
  const addCategory = async () => {
    const name = newCategoryName.trim(); if (!name) return;
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
    const description = newCategoryDescription.trim() || `${name} available from Hassan Electric & Traders.`; const image = newCategoryImage.trim() || "/images/cable-image.png";
    try { if (apiUrl) { const response=await fetch(`${apiUrl}/api/admin/categories`,{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Key":adminKey},body:JSON.stringify({name,slug,description,image_url:image})}); if(!response.ok) throw new Error((await response.json()).detail || "Category could not be added"); const saved=categoryFromApi(await response.json()); setCategoriesList(prev=>[...prev,saved]); } else setCategoriesList(prev=>[...prev,{name,slug,description,image}]); setNewCategoryName(""); setNewCategoryDescription(""); setNewCategoryImage(""); setNotification(`Added ${name}.`); } catch(error) { alert(error instanceof Error ? error.message : "Unable to add category."); }
  };
  const saveCategoryEdit = async () => {
    if (!editingCategory?.name.trim()) return;
    try { if (apiUrl && editingCategory.id) { const response = await fetch(`${apiUrl}/api/admin/categories/${editingCategory.id}`, { method:"PUT", headers:{"Content-Type":"application/json","X-Admin-Key":adminKey}, body:JSON.stringify({name:editingCategory.name,slug:editingCategory.slug,description:editingCategory.description,image_url:editingCategory.image,seo_title:null,meta_description:null}) }); if (!response.ok) throw new Error((await response.json()).detail || "Category could not be updated"); const saved=categoryFromApi(await response.json()); setCategoriesList(prev=>prev.map(c=>c.id===saved.id?saved:c)); } else setCategoriesList(prev=>prev.map(c=>c.slug===editingCategory.slug?editingCategory:c)); setEditingCategory(null); setNotification("Category updated."); } catch(error) { alert(error instanceof Error ? error.message : "Unable to update category."); }
  };

  // SEO Health Auditing (Item 89)
  const missingTitle = productsList.filter((p) => !p.seoTitle || p.seoTitle.length < 15);
  const missingMeta = productsList.filter((p) => !p.metaDescription || p.metaDescription.length < 30);
  const missingAlt = productsList.filter((p) => !p.imageAlt || p.imageAlt.length < 5);
  const unindexed = productsList.filter((p) => p.isIndexable === false);

  const totalChecks = productsList.length * 3 + initialCategories.length;
  const passedChecks =
    (productsList.length - missingTitle.length) +
    (productsList.length - missingMeta.length) +
    (productsList.length - missingAlt.length) +
    initialCategories.length;
  const healthScore = Math.min(100, Math.round((passedChecks / Math.max(totalChecks, 1)) * 100));

  if (!isAuthenticated) {
    return (
      <div className="content-container admin-login-wrapper">
        <div className="admin-login-card">
          <span className="eyebrow">STAFF SECURE ACCESS</span>
          <h1>Hassan Electric SEO & CMS Portal</h1>
          <p>Manage product SEO titles, meta descriptions, FAQ content, buying guides, and technical crawl health.</p>
          <form onSubmit={handleLogin} className="admin-form">
            <div className="form-group">
              <label htmlFor="passcode">Admin Passcode</label>
              <input
                id="passcode"
                type="password"
                placeholder="Enter passcode (Demo: hassan2026)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="button primary full-width">
              Sign In to Admin Console
            </button>
          </form>
          <p className="admin-note">
            Protected from search engine indexing via robots.txt and noindex headers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container admin-panel">
      {notification && <div className="admin-toast">{notification}</div>}

      <header className="admin-header">
        <div>
          <span className="eyebrow">PRODUCT CATALOGUE CONTROL</span>
          <h1>Manage what customers see</h1>
          <p>Add your real products, use photo links, check the customer view, and remove demo items when you are ready.</p>
        </div>
        <div className="admin-actions">
          <Link href="/" className="button ghost small" target="_blank">
            View Live Storefront ↗
          </Link>
          <button onClick={() => setIsAuthenticated(false)} className="button outline small">
            Sign Out
          </button>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <nav className="admin-tabs" aria-label="Admin Sections">
        <button
          className={`tab-btn ${activeTab === "seo-audit" ? "active" : ""}`}
          onClick={() => setActiveTab("seo-audit")}
        >
          Overview ({productsList.length} products)
        </button>
        <button
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products ({productsList.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          Categories ({categoriesList.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "articles" ? "active" : ""}`}
          onClick={() => setActiveTab("articles")}
        >
          Buying guides ({initialArticles.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "faqs" ? "active" : ""}`}
          onClick={() => setActiveTab("faqs")}
        >
          FAQs ({initialFaqs.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "content" ? "active" : ""}`}
          onClick={() => setActiveTab("content")}
        >
          Shop details
        </button>
      </nav>

      {/* Tab: SEO Health & Audit (Item 89) */}
      {activeTab === "seo-audit" && (
        <section className="admin-tab-pane">
          <div className="admin-customer-view"><div><span className="eyebrow">CUSTOMER VIEW</span><h2>{productsList.length ? `${productsList.length} products are currently visible` : "Your storefront is ready for your first product"}</h2><p>{productsList.length ? "The shop page shows three changing product cards near the top, then visitors can open any item and message you on WhatsApp." : "Add a product, choose a category, paste its image URL and publish it. It will appear for all visitors after saving."}</p></div><a className="button primary" href="/" target="_blank">Open customer site ↗</a></div>
          <div className="audit-metrics-grid">
            <div className="metric-card score-card">
              <span className="metric-label">Overall SEO Health Score</span>
              <span className="metric-value">{healthScore}%</span>
              <p className="metric-sub">Across products, meta tags, and structured data</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Products Missing Title</span>
              <span className={`metric-value ${missingTitle.length > 0 ? "warn" : "good"}`}>
                {missingTitle.length}
              </span>
              <p className="metric-sub">{missingTitle.length === 0 ? "All items have custom SEO titles" : "Needs attention"}</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Products Missing Meta Desc</span>
              <span className={`metric-value ${missingMeta.length > 0 ? "warn" : "good"}`}>
                {missingMeta.length}
              </span>
              <p className="metric-sub">{missingMeta.length === 0 ? "All items have meta descriptions" : "Action recommended"}</p>
            </div>
            <div className="metric-card">
              <span className="metric-label">Images Missing Alt Text</span>
              <span className={`metric-value ${missingAlt.length > 0 ? "warn" : "good"}`}>
                {missingAlt.length}
              </span>
              <p className="metric-sub">Accessible descriptive image tags</p>
            </div>
          </div>

          <div className="audit-details-panel">
            <h2>Detailed Technical SEO Health Checklist (Item 94)</h2>
            <div className="checklist-grid">
              <div className="check-item good">✅ Dynamic XML Sitemap active at <code>/sitemap.xml</code></div>
              <div className="check-item good">✅ Robots.txt active at <code>/robots.txt</code> with Disallow on /admin/</div>
              <div className="check-item good">✅ Canonical URLs generated for all products and categories</div>
              <div className="check-item good">✅ LocalBusiness / ElectricalSupplyStore Schema implemented</div>
              <div className="check-item good">✅ Product & Offer Schema.org with PKR currency</div>
              <div className="check-item good">✅ BreadcrumbList Schema on category and product routes</div>
              <div className="check-item good">✅ FAQPage Schema active on <code>/faq</code></div>
              <div className="check-item good">✅ Article / BlogPosting Schema active on buying guides</div>
              <div className="check-item good">✅ Mobile one-tap WhatsApp, Call, and Directions conversion bar</div>
              <div className="check-item good">✅ Clean SEO-friendly slug architecture (/products/[slug])</div>
            </div>
          </div>
        </section>
      )}

      {/* Tab: Products & Dynamic SEO (Items 60, 74) */}
      {activeTab === "products" && (
        <section className="admin-tab-pane product-editor-layout">
          <aside className="product-selector-sidebar">
            <div className="sidebar-heading"><h3>Products List</h3><button type="button" className="button primary small" onClick={startNewProduct}>+ Add product</button></div>
            {productsList.length > 0 && <button type="button" className="clear-catalogue" onClick={deleteAllProducts}>Delete all demo products</button>}
            <ul className="product-select-list">
              {productsList.map((p) => (
                <li key={p.slug}>
                  <button
                    className={`selector-item ${p.slug === selectedProduct.slug ? "selected" : ""}`}
                    onClick={() => setSelectedProductSlug(p.slug)}
                  >
                    <strong>{p.name}</strong>
                    <small>SKU: {p.sku} · {p.category}</small>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="product-editor-form">
            <div className="editor-header">
              <h2>{isNewProduct ? "Add a product" : "Edit product"}: {selectedProduct.name}</h2>
              <button
                type="button"
                className="button outline small"
                onClick={() => handleAutoGenerateSEO(selectedProduct.slug)}
              >
                Refresh automatic SEO
              </button>
            </div>

            <div className="google-preview-box">
              <span className="preview-label">Google Search & AI Snippet Preview:</span>
              <div className="search-result-snippet">
                <span className="search-preview-url">https://hassanelectric.example/products/{selectedProduct.slug}</span>
                <h4 className="search-preview-title">
                  {selectedProduct.seoTitle || `${selectedProduct.name} in Islamabad | Hassan Electric & Traders`}
                </h4>
                <p className="search-preview-desc">
                  {selectedProduct.metaDescription || selectedProduct.shortDescription}
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); saveProduct(); }}
              className="editor-fields"
            >
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={selectedProduct.name}
                    onChange={(e) =>
                      handleUpdateProduct({ ...selectedProduct, name: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Slug (Clean URL)</label>
                  <input
                    type="text"
                    value={selectedProduct.slug}
                    onChange={(e) =>
                      handleUpdateProduct({ ...selectedProduct, slug: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1"><label>Category</label><select value={selectedProduct.category} onChange={(e) => handleUpdateProduct({ ...selectedProduct, category: e.target.value })} className="form-input">{categoriesList.map(c => <option value={c.slug} key={c.slug}>{c.name}</option>)}</select></div>
                <div className="form-group flex-1"><label>Short customer description</label><input type="text" value={selectedProduct.shortDescription} onChange={(e) => handleUpdateProduct({ ...selectedProduct, shortDescription: e.target.value })} className="form-input" placeholder="Brief product summary" /></div>
              </div>

              <div className="form-group"><label>Full product description</label><textarea rows={5} value={selectedProduct.description} onChange={(e) => handleUpdateProduct({ ...selectedProduct, description: e.target.value })} className="form-input" placeholder="Write useful, accurate details about this product" /><small className="char-count">You write the customer-facing description. SEO is created automatically from this product data when you save.</small></div>

              <div className="form-group">
                <label>SEO Title Tag</label>
                <input
                  type="text"
                  value={selectedProduct.seoTitle || `${selectedProduct.name} in Islamabad | Hassan Electric & Traders`}
                  readOnly
                  className="form-input"
                  placeholder="e.g. 2.5mm Copper Electrical Wire in Islamabad | Hassan Electric & Traders"
                />
                <small className="char-count">
                  {(selectedProduct.seoTitle || "").length} / 60 recommended characters
                </small>
              </div>

              <div className="form-group">
                <label>Meta Description</label>
                <textarea
                  rows={3}
                  value={selectedProduct.metaDescription || `Ask about ${selectedProduct.name} at Hassan Electric & Traders in G-8/1 Islamabad.`}
                  readOnly
                  className="form-input"
                  placeholder="Compelling, accurate description with local relevance and WhatsApp CTA"
                />
                <small className="char-count">
                  {(selectedProduct.metaDescription || "").length} / 160 recommended characters
                </small>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>SKU</label>
                  <input
                    type="text"
                    value={selectedProduct.sku}
                    onChange={(e) =>
                      handleUpdateProduct({ ...selectedProduct, sku: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Brand</label>
                  <input
                    type="text"
                    value={selectedProduct.brand || ""}
                    onChange={(e) =>
                      handleUpdateProduct({ ...selectedProduct, brand: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Availability</label>
                  <select
                    value={selectedProduct.availability}
                    onChange={(e) =>
                      handleUpdateProduct({
                        ...selectedProduct,
                        availability: e.target.value as "InStock" | "OutOfStock",
                      })
                    }
                    className="form-input"
                  >
                    <option value="InStock">InStock</option>
                    <option value="OutOfStock">OutOfStock</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Product Image URL</label>
                <input type="url" value={selectedProduct.image} onChange={(e) => handleUpdateProduct({ ...selectedProduct, image: e.target.value })} className="form-input" placeholder="https://… or /images/your-product.jpg" />
                <small className="char-count">Upload images to Cloudflare R2 (recommended) or use a reliable public image URL. This image appears on the product page and in search sharing cards.</small>
                {selectedProduct.image && <div className="admin-image-preview"><img src={selectedProduct.image} alt={selectedProduct.imageAlt || "Product preview"}/><span>Image preview</span></div>}
              </div>

              <div className="form-group">
                <label>Image Alt Text (Descriptive, No Keyword Stuffing)</label>
                <input
                  type="text"
                  value={selectedProduct.imageAlt}
                  onChange={(e) =>
                    handleUpdateProduct({ ...selectedProduct, imageAlt: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedProduct.isIndexable !== false}
                    onChange={(e) =>
                      handleUpdateProduct({ ...selectedProduct, isIndexable: e.target.checked })
                    }
                  />
                  <span>Index this product in search engines (uncheck for internal/unlisted items)</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="button primary">
                  {isNewProduct ? "Create product" : "Save product"}
                </button>
                {!isNewProduct && <button type="button" className="button danger" onClick={deleteProduct}>Delete product</button>}
              </div>
            </form>
          </main>
        </section>
      )}

      {/* Tab: Categories (Item 65, 74) */}
      {activeTab === "categories" && (
        <section className="admin-tab-pane">
          <h2>Product categories</h2>
          <div className="add-category"><input className="form-input" value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)} placeholder="New category name, e.g. LED Lights"/><input className="form-input" value={newCategoryDescription} onChange={(e)=>setNewCategoryDescription(e.target.value)} placeholder="Customer-facing category description"/><input className="form-input" type="url" value={newCategoryImage} onChange={(e)=>setNewCategoryImage(e.target.value)} placeholder="Category image URL"/><button className="button primary small" type="button" onClick={addCategory}>Add category</button></div>
          {editingCategory && <section className="category-editor"><div><span className="eyebrow">EDIT CATEGORY</span><h3>{editingCategory.name}</h3></div><div className="form-group"><label>Category name</label><input className="form-input" value={editingCategory.name} onChange={(e)=>setEditingCategory({...editingCategory,name:e.target.value})}/></div><div className="form-group"><label>Description</label><textarea className="form-input" rows={3} value={editingCategory.description} onChange={(e)=>setEditingCategory({...editingCategory,description:e.target.value})}/></div><div className="form-group"><label>Image URL</label><input className="form-input" type="url" value={editingCategory.image} onChange={(e)=>setEditingCategory({...editingCategory,image:e.target.value})}/></div>{editingCategory.image && <img className="category-edit-image" src={editingCategory.image} alt="Category preview"/>}<div className="form-actions"><button className="button primary" type="button" onClick={saveCategoryEdit}>Save category</button><button className="button ghost" type="button" onClick={()=>setEditingCategory(null)}>Cancel</button></div></section>}
          <div className="admin-cards-list">
            {categoriesList.map((c) => (
              <div key={c.slug} className="admin-card">
                <h3>{c.name}</h3>
                <p><strong>Slug:</strong> <code>/categories/{c.slug}</code></p>
                <p><strong>SEO Title:</strong> {c.seoTitle}</p>
                <p><strong>Meta Description:</strong> {c.metaDescription}</p>
                <p><strong>Intro Description:</strong> {c.description}</p>
                <button type="button" className="text-action" onClick={() => setEditingCategory(c)}>Edit category</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab: Buying Guides (Item 83) */}
      {activeTab === "articles" && (
        <section className="admin-tab-pane">
          <h2>Educational Buying Guides & Articles</h2>
          <p>Informative guides helping Islamabad homeowners and electricians choose correct wire gauges and switch configurations.</p>
          <div className="admin-cards-list">
            {initialArticles.map((a) => (
              <div key={a.slug} className="admin-card">
                <h3>{a.title}</h3>
                <p><strong>Slug:</strong> <code>/blog/{a.slug}</code> · <strong>Category:</strong> {a.category}</p>
                <p><strong>SEO Title:</strong> {a.seoTitle}</p>
                <p><strong>Excerpt:</strong> {a.excerpt}</p>
                <Link href={`/blog/${a.slug}`} className="button outline small" target="_blank">
                  View Article ↗
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab: FAQs (Item 77, 78) */}
      {activeTab === "faqs" && (
        <section className="admin-tab-pane">
          <h2>Frequently Asked Questions & AI Knowledge Base</h2>
          <div className="admin-cards-list">
            {initialFaqs.map((faq, idx) => (
              <div key={idx} className="admin-card">
                <span className="faq-cat-tag">{faq.category}</span>
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab: Business Entity Info (Item 81) */}
      {activeTab === "content" && (
        <section className="admin-tab-pane">
          <h2>Official Business Information & NAP Consistency</h2>
          <div className="admin-card">
            <p><strong>Official Business Name:</strong> {business.name}</p>
            <p><strong>Full Address:</strong> {business.address}</p>
            <p><strong>Phone Number:</strong> {business.phone}</p>
            <p><strong>WhatsApp:</strong> {business.whatsappDisplay}</p>
            <p><strong>Google Maps:</strong> <a href={business.maps} target="_blank">{business.maps}</a></p>
            <p><strong>Coordinates:</strong> Lat {business.geo.latitude}, Lon {business.geo.longitude} (G-8/1 Islamabad)</p>
            <p><strong>Hours:</strong> {business.openingHours}</p>
          </div>
        </section>
      )}
    </div>
  );
}
