import { readProducts, subscribeCatalogChanges } from "./catalog.js?v=8";
import { buildWhatsAppLink, escapeHtml, money } from "./ui.js?v=7";

const view = document.querySelector("#product-view");
const id = new URLSearchParams(location.search).get("id");

const wireImageFallback = (root) => {
  root.querySelectorAll("img[data-fallback]").forEach((image) => image.addEventListener("error", () => {
    image.src = image.dataset.fallback;
    image.removeAttribute("data-fallback");
  }, { once: true }));
};

const showMissing = () => {
  document.title = "Product not found | ST Electric Store";
  document.querySelector('meta[name="robots"]').content = "noindex,follow";
  view.innerHTML = '<div class="missing-product"><p class="section-label">Product unavailable</p><h1>We could not find this product.</h1><p>The item may have been removed or the link may be incomplete.</p><a class="button" href="./#catalog">Browse products</a></div>';
};

const setProductMetadata = (product, images) => {
  const pageUrl = new URL(location.href);
  pageUrl.hash = "";
  const description = product.descriptions.join(" ") || "View this electrical product from ST Electric Store in Islamabad.";
  document.title = product.name + " in Islamabad | ST Electric Store";
  document.querySelector('meta[name="description"]').content = description.slice(0, 155);
  document.querySelector('meta[name="robots"]').content = "index,follow,max-image-preview:large";
  document.querySelector('link[rel="canonical"]').href = pageUrl.href;
  document.querySelector('meta[property="og:title"]').content = product.name + " | ST Electric Store";
  document.querySelector('meta[property="og:description"]').content = description.slice(0, 180);
  document.querySelector('meta[property="og:image"]').content = new URL(images[0], document.baseURI).href;
  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    color: product.color,
    image: images.map((image) => new URL(image, document.baseURI).href),
    url: pageUrl.href,
    brand: { "@type": "Brand", name: "ST Electric Store" },
    seller: { "@type": "Organization", name: "ST Electric Store", telephone: "+923398552588" },
  };
  if (product.price != null) productData.offers = { "@type": "Offer", priceCurrency: "PKR", price: product.price, url: pageUrl.href };
  let schema = document.querySelector("#product-schema");
  if (!schema) {
    schema = document.createElement("script");
    schema.id = "product-schema";
    schema.type = "application/ld+json";
    document.head.append(schema);
  }
  schema.textContent = JSON.stringify(productData);
};

const renderProduct = (product) => {
  const images = product.images.length ? product.images : ["logo.svg"];
  setProductMetadata(product, images);
  view.innerHTML = '<article class="product-page-grid"><section class="detail-gallery"><div class="detail-main-wrap"><img class="detail-main-image" id="detail-main-image" src="' + escapeHtml(images[0]) + '" alt="' + escapeHtml(product.name) + '" data-fallback="logo.svg"></div><div class="detail-thumbs" aria-label="Product photos">' + images.map((image, index) => '<button type="button" class="' + (index === 0 ? 'active' : '') + '" data-image="' + escapeHtml(image) + '" data-alt="' + escapeHtml(product.name + ' photo ' + (index + 1)) + '" aria-label="Show product photo ' + (index + 1) + '"><img src="' + escapeHtml(image) + '" alt="" data-fallback="logo.svg"></button>').join("") + '</div></section><section class="detail-copy"><p class="product-category">Electrical product · ' + escapeHtml(product.color) + '</p><h1>' + escapeHtml(product.name) + '</h1><div class="detail-price-row"><p class="detail-price">' + money(product.price) + '</p><span>Price and availability confirmed by store</span></div><ul class="description-points">' + product.descriptions.map((point) => '<li>' + escapeHtml(point) + '</li>').join("") + '</ul><a class="button detail-whatsapp" href="' + escapeHtml(buildWhatsAppLink(product)) + '" target="_blank" rel="noopener"><img src="whatsapp.svg" alt="" width="24" height="24">' + (product.price == null ? 'Ask for price on WhatsApp' : 'Ask on WhatsApp') + '</a><div class="detail-assurance"><span>✓ Exact product link included</span><span>✓ Direct store assistance</span></div></section></article>';
  const floatingLink = document.querySelector(".floating-whatsapp");
  floatingLink.href = buildWhatsAppLink(product);
  floatingLink.setAttribute("aria-label", "Ask about " + product.name + " on WhatsApp");
  view.querySelectorAll("[data-image]").forEach((button) => button.addEventListener("click", () => {
    const main = view.querySelector("#detail-main-image");
    main.src = button.dataset.image;
    main.alt = button.dataset.alt;
    view.querySelectorAll("[data-image]").forEach((item) => item.classList.toggle("active", item === button));
  }));
  wireImageFallback(view);
};

const refreshProduct = async () => {
  const products = await readProducts();
  const product = products.find((item) => item.id === id);
  if (product) renderProduct(product);
  else showMissing();
};

await refreshProduct();
subscribeCatalogChanges(refreshProduct);
document.querySelector("#year").textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-toggle");
const mainMenu = document.querySelector("#main-menu");
menuButton.addEventListener("click", () => {
  const isOpen = mainMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.querySelector(".sr-only").textContent = isOpen ? "Close menu" : "Open menu";
});
