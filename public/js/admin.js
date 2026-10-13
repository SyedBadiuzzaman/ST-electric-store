import { MAX_DESCRIPTIONS, MAX_IMAGES, MAX_PRODUCTS, cleanProduct, exportableCatalogErrors, readProducts, readPublishedProducts, resetProducts, validImage, validateProduct, writeProducts } from "./catalog.js?v=8";
import { escapeHtml, money, showNotice } from "./ui.js?v=7";

const form = document.querySelector("#product-form");
const list = document.querySelector("#admin-list");
const total = document.querySelector("#product-total");
const notice = document.querySelector("#admin-notice");
const deleteButton = document.querySelector("#delete-product");
const imageInput = document.querySelector("#image-files");
const imageList = document.querySelector("#image-list");
const descriptionList = document.querySelector("#description-list");
const publishStatus = document.querySelector("#publish-status");
let products = [];
let images = [];

const catalogSignature = (catalog) => JSON.stringify(catalog.map(cleanProduct));

const refreshPublishedStatus = async () => {
  publishStatus.className = "publish-status checking";
  publishStatus.textContent = "Checking the public catalog…";
  const published = await readPublishedProducts();
  const matches = catalogSignature(published) === catalogSignature(products);
  publishStatus.className = "publish-status " + (matches ? "published" : "unpublished");
  publishStatus.textContent = matches
    ? "Published: this catalog is the same one other devices receive."
    : "Not published: this browser has different products. Other devices still receive " + published.length + " published product" + (published.length === 1 ? "" : "s") + ".";
};

const renderList = () => {
  total.textContent = "(" + products.length + "/" + MAX_PRODUCTS + ")";
  list.innerHTML = products.length ? products.map((product) => '<button type="button" class="admin-item" data-id="' + escapeHtml(product.id) + '"><strong>' + escapeHtml(product.name) + '</strong><span>' + escapeHtml(product.color) + " · " + money(product.price) + " · " + product.images.length + ' photo' + (product.images.length === 1 ? '' : 's') + '</span></button>').join("") : '<p class="help">No products yet. Select + New to add one.</p>';
};

const renderImages = () => {
  imageList.innerHTML = images.length ? images.map((image, index) => '<div class="image-editor-item"><img src="' + escapeHtml(image) + '" alt="Product photo ' + (index + 1) + '" data-image-index="' + index + '"><span>Photo ' + (index + 1) + '</span><button class="text-button" type="button" data-remove-image="' + index + '">Remove</button></div>').join("") : '<p class="empty-small">No photos selected yet.</p>';
  imageList.querySelectorAll("img").forEach((image) => image.addEventListener("error", () => { image.src = "logo.svg"; }, { once: true }));
};

const addDescriptionRow = (value = "") => {
  if (descriptionList.children.length >= MAX_DESCRIPTIONS) return;
  const row = document.createElement("div");
  row.className = "description-row";
  row.innerHTML = '<label class="field"><span>Description point ' + (descriptionList.children.length + 1) + '</span><input data-description maxlength="180" required value="' + escapeHtml(value) + '" placeholder="Short product detail"></label><button class="text-button" type="button" data-remove-description>Remove</button>';
  row.querySelector("[data-remove-description]").addEventListener("click", () => {
    if (descriptionList.children.length === 1) return showNotice(notice, "Every product needs at least one description point.", "error");
    row.remove();
    renumberDescriptions();
  });
  descriptionList.append(row);
};

const renumberDescriptions = () => {
  [...descriptionList.children].forEach((row, index) => { row.querySelector(".field span").textContent = "Description point " + (index + 1); });
};

const descriptionsFromForm = () => [...descriptionList.querySelectorAll("[data-description]")].map((input) => input.value.trim()).filter(Boolean);

const selectProduct = (product = null) => {
  form.reset();
  form.elements.id.value = product?.id ?? "";
  form.elements.name.value = product?.name ?? "";
  form.elements.price.value = product?.price ?? "";
  form.elements.color.value = product?.color ?? "";
  images = [...(product?.images ?? [])];
  descriptionList.innerHTML = "";
  (product?.descriptions?.length ? product.descriptions : [""]).forEach(addDescriptionRow);
  deleteButton.hidden = !product;
  list.querySelectorAll(".admin-item").forEach((item) => item.classList.toggle("active", item.dataset.id === product?.id));
  notice.hidden = true;
  imageInput.value = "";
  renderImages();
};

const canvasBlob = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));
const blobDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(blob);
});

const loadImageSource = async (file) => {
  if ("createImageBitmap" in window) {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, cleanup: () => bitmap.close() };
    } catch {
      // Some embedded browsers expose createImageBitmap but cannot decode local File objects.
    }
  }
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.src = objectUrl;
  try {
    await image.decode();
  } catch {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("The source image could not be decoded."));
    });
  }
  return { source: image, width: image.naturalWidth, height: image.naturalHeight, cleanup: () => URL.revokeObjectURL(objectUrl) };
};

const optimizeImage = async (file) => {
  if (!/^image\/(?:jpeg|png|webp)$/i.test(file.type)) throw new Error(file.name + " is not a supported JPG, PNG, or WebP image.");
  if (file.size > 15 * 1024 * 1024) throw new Error(file.name + " is larger than 15 MB.");
  const loaded = await loadImageSource(file);
  let scale = Math.min(1, 1200 / Math.max(loaded.width, loaded.height));
  let blob;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(loaded.width * scale));
    canvas.height = Math.max(1, Math.round(loaded.height * scale));
    canvas.getContext("2d", { alpha: false }).drawImage(loaded.source, 0, 0, canvas.width, canvas.height);
    blob = await canvasBlob(canvas, "image/webp", Math.max(0.62, 0.82 - attempt * 0.06));
    if (blob && blob.size <= 450 * 1024) break;
    scale *= 0.78;
  }
  loaded.cleanup();
  if (!blob) throw new Error("The browser could not process " + file.name + ".");
  return await blobDataUrl(blob);
};

const downloadCatalog = (filename, catalog) => {
  const file = new Blob([JSON.stringify(catalog, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
};

list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-id]");
  if (button) selectProduct(products.find((product) => product.id === button.dataset.id));
});

imageList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-image]");
  if (!button) return;
  images.splice(Number(button.dataset.removeImage), 1);
  renderImages();
});

imageInput.addEventListener("change", async () => {
  const files = [...imageInput.files];
  if (images.length + files.length > MAX_IMAGES) {
    imageInput.value = "";
    return showNotice(notice, "A product can have at most five photos.", "error");
  }
  try {
    showNotice(notice, "Optimizing selected photos…");
    for (const file of files) images.push(await optimizeImage(file));
    renderImages();
    showNotice(notice, files.length + " photo" + (files.length === 1 ? "" : "s") + " added.");
  } catch (error) {
    showNotice(notice, error.message, "error");
  } finally {
    imageInput.value = "";
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const product = cleanProduct({ ...data, images, descriptions: descriptionsFromForm() }, products.length);
  const errors = validateProduct(product);
  if (errors.length) return showNotice(notice, errors.join(" "), "error");
  const existingIndex = products.findIndex((item) => item.id === product.id);
  if (existingIndex >= 0) products[existingIndex] = product;
  else {
    if (products.length >= MAX_PRODUCTS) return showNotice(notice, "The catalog already contains 100 products.", "error");
    products.push(product);
  }
  try {
    products = await writeProducts(products);
    renderList();
    selectProduct(product);
    await refreshPublishedStatus();
    showNotice(notice, "Product saved in this browser. Export the public catalog before your next GitHub or Cloudflare update.");
  } catch {
    showNotice(notice, "The browser could not save the catalog. Free some device storage and try again.", "error");
  }
});

deleteButton.addEventListener("click", async () => {
  const id = form.elements.id.value;
  if (!id || !confirm("Delete this product?")) return;
  products = await writeProducts(products.filter((product) => product.id !== id));
  renderList();
  selectProduct();
  await refreshPublishedStatus();
  showNotice(notice, "Product deleted.");
});

document.querySelector("#new-product").addEventListener("click", () => selectProduct());
document.querySelector("#add-description").addEventListener("click", () => {
  if (descriptionList.children.length >= MAX_DESCRIPTIONS) return showNotice(notice, "A product can have at most three description points.", "error");
  addDescriptionRow();
});

document.querySelector("#export-catalog").addEventListener("click", () => {
  const errors = exportableCatalogErrors(products);
  if (errors.length) return showNotice(notice, "Catalog not exported. " + errors.slice(0, 3).join(" ") + (errors.length > 3 ? " Fix the remaining products too." : ""), "error");
  downloadCatalog("products.json", products);
  showNotice(notice, "products.json downloaded. Now select Open GitHub upload, upload this file, and commit the change.");
});

document.querySelector("#check-published").addEventListener("click", refreshPublishedStatus);

document.querySelector("#download-backup").addEventListener("click", () => {
  downloadCatalog("st-electric-products-backup.json", products);
  showNotice(notice, "Catalog backup downloaded.");
});

document.querySelector("#restore-catalog").addEventListener("change", async (event) => {
  try {
    const restored = JSON.parse(await event.target.files[0].text());
    if (!Array.isArray(restored) || restored.length > MAX_PRODUCTS) throw new Error("The backup must contain an array of no more than 100 products.");
    const cleaned = restored.map(cleanProduct).filter((product) => product.name && product.images.length && product.color);
    if (cleaned.length !== restored.length) throw new Error("One or more products have missing or invalid fields.");
    products = await writeProducts(cleaned);
    renderList();
    selectProduct();
    await refreshPublishedStatus();
    showNotice(notice, "Catalog restored on this browser only. Use the publishing steps above to show it on other devices.");
  } catch (error) {
    showNotice(notice, error.message, "error");
  } finally {
    event.target.value = "";
  }
});

document.querySelector("#reset-catalog").addEventListener("click", async () => {
  if (!confirm("Remove browser edits and reload the published catalog?")) return;
  products = await resetProducts();
  renderList();
  selectProduct();
  await refreshPublishedStatus();
  showNotice(notice, "Local changes cleared. Published products reloaded.");
});

products = await readProducts();
renderList();
selectProduct();
await refreshPublishedStatus();
