export const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);

export const money = (amount, currency = "PKR") => amount == null ? "Ask for price" : currency + " " + new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(amount);

export const productHref = (product) => new URL("product.html?id=" + encodeURIComponent(product.id), document.baseURI).href;

export const buildWhatsAppLink = (product) => {
  const price = product.price == null ? "Please confirm the current price" : money(product.price);
  const message = [
    "Hello ST Electric Store, I want to ask about this product:",
    "",
    "Product: " + product.name,
    "Color: " + product.color,
    "Price: " + price,
    "Product link: " + productHref(product),
  ].join("\n");
  return "https://wa.me/923398552588?text=" + encodeURIComponent(message);
};

export const showNotice = (element, message, type = "success") => {
  element.textContent = message;
  element.className = "notice " + type;
  element.hidden = false;
};
