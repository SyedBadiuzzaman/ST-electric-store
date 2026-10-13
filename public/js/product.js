import { readProducts, subscribeCatalogChanges } from "./catalog.js?v=5";
import { buildWhatsAppLink, escapeHtml, money } from "./ui.js?v=5";

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
  view.innerHTML = '<div class="missing-product"><p class="section-label">Product unavailable</p><h1>We could not find this product.</h1><p>The item may have been removed or the link may be incomplete.</p><a class="button" href="./#catalog">Browse products</a></div>';
};

const renderProduct = (product) => {
  const images = product.images.length ? product.images : ["logo.svg"];
  document.title = product.name + " | ST Electric Store";
  view.innerHTML = '<article class="product-page-grid"><section class="detail-gallery"><div class="detail-main-wrap"><img class="detail-main-image" id="detail-main-image" src="' + escapeHtml(images[0]) + '" alt="' + escapeHtml(product.name) + '" data-fallback="logo.svg"></div><div class="detail-thumbs" aria-label="Product photos">' + images.map((image, index) => '<button type="button" class="' + (index === 0 ? 'active' : '') + '" data-image="' + escapeHtml(image) + '" data-alt="' + escapeHtml(product.name + ' photo ' + (index + 1)) + '" aria-label="Show product photo ' + (index + 1) + '"><img src="' + escapeHtml(image) + '" alt="" data-fallback="logo.svg"></button>').join("") + '</div></section><section class="detail-copy"><p class="product-category">Color · ' + escapeHtml(product.color) + '</p><h1>' + escapeHtml(product.name) + '</h1><p class="detail-price">' + money(product.price) + '</p><ul class="description-points">' + product.descriptions.map((point) => '<li>' + escapeHtml(point) + '</li>').join("") + '</ul><a class="button detail-whatsapp" href="' + escapeHtml(buildWhatsAppLink(product)) + '" target="_blank" rel="noopener">' + (product.price == null ? 'Ask for price on WhatsApp' : 'Ask on WhatsApp') + '</a><p class="detail-help">The WhatsApp message includes this product link, color, and price.</p></section></article>';
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
