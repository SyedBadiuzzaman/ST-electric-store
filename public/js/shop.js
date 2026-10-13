import { readProducts, subscribeCatalogChanges } from "./catalog.js?v=5";
import { buildWhatsAppLink, escapeHtml, money, productHref } from "./ui.js?v=5";

const form = document.querySelector("#filters");
const grid = document.querySelector("#product-grid");
const count = document.querySelector("#result-count");
const pagination = document.querySelector("#pagination");
const colorSelect = form.elements.color;
const pageSize = 12;
let page = 1;

const productCard = (product) => {
  const detailLink = productHref(product);
  const image = product.images[0] || "logo.svg";
  const summary = product.descriptions[0] || "Open the product to view details.";
  return '<article class="product-card" data-href="' + escapeHtml(detailLink) + '">' +
    '<a class="product-image" href="' + escapeHtml(detailLink) + '"><img src="' + escapeHtml(image) + '" alt="' + escapeHtml(product.name) + '" loading="lazy" data-fallback="logo.svg"><span class="color-badge">' + escapeHtml(product.color) + '</span></a>' +
    '<div class="product-copy"><p class="product-category">Color · ' + escapeHtml(product.color) + '</p><h3><a href="' + escapeHtml(detailLink) + '">' + escapeHtml(product.name) + '</a></h3>' +
    '<p class="product-description">' + escapeHtml(summary) + '</p><div class="product-footer"><strong>' + money(product.price) + '</strong><div class="card-actions"><a class="text-button" href="' + escapeHtml(detailLink) + '">View details →</a><a class="text-button" href="' + escapeHtml(buildWhatsAppLink(product)) + '" target="_blank" rel="noopener">WhatsApp</a></div></div></div></article>';
};

const wireImageFallbacks = () => {
  grid.querySelectorAll("img[data-fallback]").forEach((image) => image.addEventListener("error", () => {
    image.src = image.dataset.fallback;
    image.removeAttribute("data-fallback");
  }, { once: true }));
};

const updateColors = (products) => {
  const selected = colorSelect.value;
  const colors = [...new Set(products.map((product) => product.color).filter(Boolean))].sort();
  colorSelect.innerHTML = '<option value="">All colors</option>' + colors.map((color) => '<option value="' + escapeHtml(color) + '">' + escapeHtml(color) + '</option>').join("");
  if (colors.includes(selected)) colorSelect.value = selected;
};

const render = async () => {
  grid.setAttribute("aria-busy", "true");
  const products = await readProducts();
  updateColors(products);
  const search = form.elements.search.value.trim().toLowerCase();
  const color = colorSelect.value;
  const filtered = products.filter((product) => (!search || (product.name + " " + product.descriptions.join(" ")).toLowerCase().includes(search)) && (!color || product.color === color));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  page = Math.min(page, pages);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  count.textContent = filtered.length + " product" + (filtered.length === 1 ? "" : "s") + " found";
  grid.innerHTML = visible.length ? visible.map(productCard).join("") : '<div class="empty"><strong>No products found.</strong><br>Try another name or color.</div>';
  pagination.innerHTML = pages <= 1 ? "" : Array.from({ length: pages }, (_, index) => '<button type="button" data-page="' + (index + 1) + '" ' + (page === index + 1 ? 'aria-current="page"' : "") + '>' + (index + 1) + '</button>').join("");
  wireImageFallbacks();
  grid.setAttribute("aria-busy", "false");
};

let debounce;
form.addEventListener("input", () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => { page = 1; render(); }, 180);
});
form.addEventListener("reset", () => setTimeout(() => { page = 1; render(); }, 0));
pagination.addEventListener("click", (event) => {
  const button = event.target.closest("[data-page]");
  if (!button) return;
  page = Number(button.dataset.page);
  render();
  document.querySelector("#catalog").scrollIntoView({ behavior: "smooth" });
});
grid.addEventListener("click", (event) => {
  const card = event.target.closest(".product-card[data-href]");
  if (!card || event.target.closest("a, button, input, select, textarea")) return;
  location.href = card.dataset.href;
});
subscribeCatalogChanges(() => {
  page = 1;
  render();
});
document.querySelector("#year").textContent = new Date().getFullYear();
render();
