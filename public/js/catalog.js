const DB_NAME = "st-electric-catalog";
const DB_VERSION = 1;
const PRODUCT_STORE = "products";
const META_STORE = "meta";
const LOCAL_CATALOG_KEY = "catalog-initialized";
const LEGACY_STORAGE_KEY = "st-electric-products-v1";
const CATALOG_CHANNEL = "st-electric-catalog-updates";
const catalogChannel = typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel(CATALOG_CHANNEL) : null;

export const MAX_PRODUCTS = 100;
export const MIN_IMAGES = 2;
export const MAX_IMAGES = 5;
export const MIN_DESCRIPTIONS = 1;
export const MAX_DESCRIPTIONS = 3;

const sampleProducts = [
  { id: "st-001", name: "2.5mm Pure Copper Electrical Wire", images: ["images/cable-image.png"], price: null, color: "Red", descriptions: ["Pure copper electrical wire for residential socket and power circuits."] },
  { id: "st-002", name: "4.0mm Heavy Duty Pure Copper Wire", images: ["images/cable-image.png"], price: null, color: "Black", descriptions: ["Heavy-duty copper wire for higher-load electrical circuits."] },
  { id: "st-003", name: "1.5mm Single Core Copper Wire", images: ["images/cable-image.png"], price: null, color: "Blue", descriptions: ["Single-core copper wire for lighting and fan circuits."] },
  { id: "st-004", name: "3-Gang Modular Electrical Switch Board", images: ["images/switch-board.webp"], price: null, color: "White", descriptions: ["Three-button modular switch board for common room circuits."] },
  { id: "st-005", name: "2-Gang Modular Electrical Switch Board", images: ["images/switch-board.webp"], price: null, color: "Off-white", descriptions: ["Compact two-button modular switch board."] },
  { id: "st-006", name: "Single Pole 20A Miniature Circuit Breaker", images: ["images/cable-image.png"], price: null, color: "White", descriptions: ["Single-pole miniature circuit breaker for distribution boards."] },
  { id: "st-007", name: "Universal Multi-Pin Socket with Switch", images: ["images/switch-board.webp"], price: null, color: "White", descriptions: ["Universal multi-pin wall socket with an integrated switch."] },
];

export const validImage = (value) => {
  const text = String(value ?? "").trim();
  if (/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(text)) return text;
  if (/^(?:\.\/)?(?:images|logo\.svg)/i.test(text)) return text;
  if (text.startsWith("/") && !text.startsWith("//")) return text;
  try {
    const url = new URL(text);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
};

export const cleanProduct = (input, index = 0) => {
  const amount = input.price === "" || input.price == null ? null : Number(input.price);
  const sourceImages = Array.isArray(input.images) ? input.images : [input.image].filter(Boolean);
  const sourceDescriptions = Array.isArray(input.descriptions) ? input.descriptions : [input.description].filter(Boolean);
  return {
    id: String(input.id || "st-" + Date.now() + "-" + index).replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80),
    name: String(input.name ?? "").trim().slice(0, 100),
    images: sourceImages.map(validImage).filter(Boolean).slice(0, MAX_IMAGES),
    price: Number.isFinite(amount) && amount >= 0 ? amount : null,
    color: String(input.color ?? "").trim().slice(0, 40),
    descriptions: sourceDescriptions.map((item) => String(item ?? "").trim().slice(0, 180)).filter(Boolean).slice(0, MAX_DESCRIPTIONS),
  };
};

export const validateProduct = (product) => {
  const errors = [];
  if (!product.name) errors.push("Enter a product name.");
  if (!product.color) errors.push("Enter a product color.");
  if (product.images.length < MIN_IMAGES) errors.push("Add at least two product images.");
  if (product.images.length > MAX_IMAGES) errors.push("A product can have at most five images.");
  if (product.descriptions.length < MIN_DESCRIPTIONS) errors.push("Add at least one description point.");
  if (product.descriptions.length > MAX_DESCRIPTIONS) errors.push("A product can have at most three description points.");
  return errors;
};

const requestResult = (request) => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const transactionDone = (transaction) => new Promise((resolve, reject) => {
  transaction.oncomplete = resolve;
  transaction.onerror = () => reject(transaction.error);
  transaction.onabort = () => reject(transaction.error);
});

const openDatabase = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains(PRODUCT_STORE)) database.createObjectStore(PRODUCT_STORE, { keyPath: "id" });
    if (!database.objectStoreNames.contains(META_STORE)) database.createObjectStore(META_STORE, { keyPath: "key" });
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const announceCatalogChange = () => {
  window.dispatchEvent(new CustomEvent("catalog-change"));
  catalogChannel?.postMessage({ type: "catalog-change", time: Date.now() });
};

export const subscribeCatalogChanges = (callback) => {
  const receiveLocal = () => callback();
  const receiveBroadcast = (event) => {
    if (event.data?.type === "catalog-change") callback();
  };
  window.addEventListener("catalog-change", receiveLocal);
  catalogChannel?.addEventListener("message", receiveBroadcast);
  return () => {
    window.removeEventListener("catalog-change", receiveLocal);
    catalogChannel?.removeEventListener("message", receiveBroadcast);
  };
};

const readPublicCatalog = async () => {
  try {
    const response = await fetch("data/products.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Published catalog is unavailable.");
    const value = await response.json();
    if (!Array.isArray(value)) throw new Error("Published catalog has an invalid format.");
    return value.slice(0, MAX_PRODUCTS).map(cleanProduct).filter((item) => item.name && item.images.length && item.color);
  } catch {
    return structuredClone(sampleProducts);
  }
};

const migrateLegacyCatalog = async () => {
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
    if (!Array.isArray(legacy)) return null;
    const products = legacy.slice(0, MAX_PRODUCTS).map(cleanProduct).filter((item) => item.name && item.images.length && item.color);
    await writeProducts(products);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return products;
  } catch {
    return null;
  }
};

export const readProducts = async () => {
  try {
    const database = await openDatabase();
    const transaction = database.transaction([PRODUCT_STORE, META_STORE], "readonly");
    const done = transactionDone(transaction);
    const initializedRequest = transaction.objectStore(META_STORE).get(LOCAL_CATALOG_KEY);
    const productsRequest = transaction.objectStore(PRODUCT_STORE).getAll();
    const [initialized, products] = await Promise.all([requestResult(initializedRequest), requestResult(productsRequest)]);
    await done;
    database.close();
    if (initialized) return products.map(cleanProduct);
    return await migrateLegacyCatalog() ?? await readPublicCatalog();
  } catch {
    return await readPublicCatalog();
  }
};

export const writeProducts = async (products) => {
  const clean = products.slice(0, MAX_PRODUCTS).map(cleanProduct).filter((item) => item.name && item.images.length && item.color);
  const database = await openDatabase();
  const transaction = database.transaction([PRODUCT_STORE, META_STORE], "readwrite");
  const done = transactionDone(transaction);
  const store = transaction.objectStore(PRODUCT_STORE);
  store.clear();
  clean.forEach((product) => store.put(product));
  transaction.objectStore(META_STORE).put({ key: LOCAL_CATALOG_KEY, value: true });
  await done;
  database.close();
  announceCatalogChange();
  return clean;
};

export const resetProducts = async () => {
  const database = await openDatabase();
  const transaction = database.transaction([PRODUCT_STORE, META_STORE], "readwrite");
  const done = transactionDone(transaction);
  transaction.objectStore(PRODUCT_STORE).clear();
  transaction.objectStore(META_STORE).delete(LOCAL_CATALOG_KEY);
  await done;
  database.close();
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  announceCatalogChange();
  return await readPublicCatalog();
};

export const exportableCatalogErrors = (products) => products.flatMap((product) => validateProduct(product).map((error) => product.name + ": " + error));
