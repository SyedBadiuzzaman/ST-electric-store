export interface BusinessInfo {
  name: string;
  legalName: string;
  tagline: string;
  address: string;
  street: string;
  area: string;
  sector: string;
  city: string;
  postalCode: string;
  country: string;
  countryName: string;
  phone: string;
  phoneIntl: string;
  whatsapp: string;
  whatsappDisplay: string;
  maps: string;
  geo: {
    latitude: number;
    longitude: number;
  };
  priceRange: string;
  openingHours: string;
  openingDays: string[];
}

export const business: BusinessInfo = {
  name: "Hassan Electric & Traders",
  legalName: "Hassan Electric & Traders",
  tagline: "Electrical Supplies, Pure Copper Wires, Modular Switch Boards & Protection in Islamabad",
  address: "I & T Center, Block 47 Street 14, G-8/1, G-8, Islamabad, 44090, Pakistan",
  street: "I & T Center, Block 47 Street 14",
  area: "G-8/1",
  sector: "G-8",
  city: "Islamabad",
  postalCode: "44090",
  country: "PK",
  countryName: "Pakistan",
  phone: "0330 3000093",
  phoneIntl: "+92 330 3000093",
  whatsapp: "923303000093",
  whatsappDisplay: "+92 330 3000093",
  maps: "https://maps.app.goo.gl/Zgogsj8ezfiM7y61A",
  geo: {
    latitude: 33.6938,
    longitude: 73.0450,
  },
  priceRange: "$$",
  openingHours: "Mo-Sa 09:00-20:30",
  openingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

export interface Product {
  name: string;
  slug: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  imageAlt: string;
  shortDescription: string;
  description: string;
  sku: string;
  brand?: string;
  availability: "InStock" | "OutOfStock";
  specs: Record<string, string>;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  isIndexable?: boolean;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  image: string;
  seoTitle?: string;
  metaDescription?: string;
  keySpecs?: string[];
  imageVersion?: string;
}

export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  category: string;
  publishedDate: string;
  readTime: string;
  seoTitle?: string;
  metaDescription?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const categories: Category[] = [
  {
    name: "Wires & Cables",
    slug: "wires-and-cables",
    description: "Pure copper electrical wires, single core and multi-strand cables for residential, commercial and industrial wiring in Islamabad.",
    image: "/images/cable-image.png",
    seoTitle: "Pure Copper Electrical Wires & Cables in Islamabad | Hassan Electric & Traders",
    metaDescription: "Browse 1.5mm, 2.5mm, 4mm, 6mm, and 7/029 copper wires at Hassan Electric & Traders, G-8/1 Islamabad. In-stock availability and fast WhatsApp quotes.",
    keySpecs: ["99.9% Electrolytic Copper", "PVC Flame Retardant", "450/750V Voltage Rating", "Standard 90m Coils"],
  },
  {
    name: "Switches & Switch Boards",
    slug: "switches",
    description: "Premium modular switch plates from 1-gang to 4-gang, bell pushes, fan dimmers, and tactile rocker switches.",
    image: "/images/switch-board.webp",
    seoTitle: "Electrical Switches & Switch Boards in Islamabad | Hassan Electric & Traders",
    metaDescription: "Shop 1-button, 2-button, 3-button switch boards and switches in G-8 Islamabad. Quality finishes from Hassan Electric & Traders.",
    keySpecs: ["1-Gang to 4-Gang Buttons", "Flame-retardant Polycarbonate", "Silver-alloy Contacts", "10A - 16A Current"],
  },
  {
    name: "Sockets & Power Outlets",
    slug: "sockets",
    description: "Universal multi-plug sockets, 3-pin power outlets, and heavy-duty appliance wall connections for modern homes.",
    image: "/images/switch-board.webp",
    seoTitle: "Electrical Sockets & Wall Plugs in Islamabad | Hassan Electric & Traders",
    metaDescription: "Shop wall sockets, universal pins and multi-plug boards from Hassan Electric & Traders in G-8/1, Islamabad.",
    keySpecs: ["Universal Multi-plug Compatibility", "Child Safety Shutter Options", "13A - 16A Sockets", "Grounding Pin Protection"],
  },
  {
    name: "Circuit Breakers & Protection",
    slug: "circuit-breakers",
    description: "Miniature Circuit Breakers (MCB), Earth Leakage (RCCB), and distribution boxes for reliable home overload protection.",
    image: "/images/cable-image.png",
    seoTitle: "Circuit Breakers (MCB/RCCB) in Islamabad | Hassan Electric & Traders",
    metaDescription: "Quality single-pole, double-pole circuit breakers and main distribution boxes in G-8/1 Islamabad. Protect your wiring safely.",
    keySpecs: ["Single Pole & Double Pole", "6kA - 10kA Breaking Capacity", "35mm DIN Rail Mount", "Thermal-Magnetic Trip"],
  },
];

export const products: Product[] = [
  {
    name: "2.5mm Single Core Copper Electrical Wire",
    slug: "2-5mm-copper-electrical-wire",
    category: "wires-and-cables",
    price: 0,
    currency: "PKR",
    image: "/images/cable-image.png",
    imageAlt: "2.5mm single core copper electrical wire coil",
    shortDescription: "High-conductivity 2.5mm pure copper electrical wire ideal for socket circuits, room wiring, and appliances in Islamabad.",
    description: "2.5mm single core pure copper electrical wire manufactured to standard electrical safety specifications. Designed for 220V/240V residential and commercial installations. Available in red, black, blue, and green earth colors. Contact Hassan Electric & Traders in G-8/1 Islamabad to verify current coil lengths (90m standard), brand availability, and current market price.",
    sku: "WIRE-CU-2.5MM",
    brand: "Pakistan Cables / Pioneer / Equivalent",
    availability: "InStock",
    specs: {
      "Wire Size": "2.5 mm²",
      "Conductor Material": "99.9% Pure Electrolytic Copper",
      "Insulation": "PVC Flame Retardant Grade",
      "Voltage Rating": "450/750V",
      "Standard Coil Length": "90 Meters (approx 100 yards)",
      "Recommended Application": "Room Socket Circuits, Home Appliances",
      "Shop Location": "Hassan Electric & Traders, G-8/1 Islamabad",
    },
    seoTitle: "2.5mm Copper Electrical Wire in Islamabad | Hassan Electric & Traders",
    metaDescription: "Shop 2.5mm copper electrical wire from Hassan Electric & Traders in G-8/1 Islamabad. Check specifications, coil lengths and contact us on WhatsApp.",
    canonicalUrl: "/products/2-5mm-copper-electrical-wire",
    isIndexable: true,
  },
  {
    name: "4.0mm Heavy Duty Pure Copper Electrical Wire",
    slug: "4mm-copper-electrical-wire",
    category: "wires-and-cables",
    price: 0,
    currency: "PKR",
    image: "/images/cable-image.png",
    imageAlt: "4.0mm heavy duty copper electrical wire coil",
    shortDescription: "Heavy-duty 4mm copper electrical wire for air conditioners, electric geysers, and high-load sub-mains.",
    description: "4.0mm pure copper cable engineered for high continuous current capacity. Suitable for 1.5 ton to 2.0 ton inverter air conditioners, water heaters, and heavy kitchen appliances. Available in standard 90-meter rolls at Hassan Electric & Traders, G-8/1, Islamabad.",
    sku: "WIRE-CU-4MM",
    brand: "Standard Quality Copper",
    availability: "InStock",
    specs: {
      "Wire Size": "4.0 mm²",
      "Conductor Material": "High Purity Electrolytic Copper",
      "Insulation": "Heat Resistant PVC",
      "Voltage Rating": "450/750V",
      "Recommended Application": "Inverter ACs (1.5-2 Ton), Electric Geysers, Sub-mains",
      "Availability": "In stock at G-8/1 shop",
    },
    seoTitle: "4mm Copper Electrical Wire for AC & Geyser in Islamabad | Hassan Electric",
    metaDescription: "Buy 4mm copper wire in Islamabad from Hassan Electric & Traders. High-load cable for ACs and heavy appliances. WhatsApp 0330 3000093.",
    canonicalUrl: "/products/4mm-copper-electrical-wire",
    isIndexable: true,
  },
  {
    name: "1.5mm Single Core Copper Electrical Wire",
    slug: "1-5mm-copper-electrical-wire",
    category: "wires-and-cables",
    price: 0,
    currency: "PKR",
    image: "/images/cable-image.png",
    imageAlt: "1.5mm single core copper electrical wire coil for lighting",
    shortDescription: "Standard 1.5mm copper wire for ceiling lights, fans, LED fixtures, and low-voltage control circuits.",
    description: "1.5mm copper wire engineered for optimal conductivity across residential lighting and ceiling fan loops. Low resistance reduces energy loss across long conduit runs.",
    sku: "WIRE-CU-1.5MM",
    brand: "Verified Copper Standard",
    availability: "InStock",
    specs: {
      "Wire Size": "1.5 mm²",
      "Conductor Material": "Pure Copper",
      "Insulation": "PVC",
      "Voltage Rating": "300/500V - 450/750V",
      "Recommended Application": "LED Downlights, Ceiling Fans, Low-load Switches",
      "Availability": "In stock at G-8/1 shop",
    },
    seoTitle: "1.5mm Copper Wire for Lights & Fans in Islamabad | Hassan Electric",
    metaDescription: "Order 1.5mm copper electrical wire for lights and fans in Islamabad. Hassan Electric & Traders G-8/1. Contact 0330 3000093 on WhatsApp.",
    canonicalUrl: "/products/1-5mm-copper-electrical-wire",
    isIndexable: true,
  },
  {
    name: "3-Gang Modular Electrical Switch Board",
    slug: "3-gang-modular-switch-board",
    category: "switches",
    price: 0,
    currency: "PKR",
    image: "/images/switch-board.webp",
    imageAlt: "White 3-gang modular electrical switch board plate",
    shortDescription: "Contemporary 3-button modular switch plate with smooth rocker action and flame-retardant finish.",
    description: "Durable 3-gang wall switch board designed for modern interiors. Features smooth tactile operation, silver contact points for minimal arcing, and UV-resistant white finish. Suitable for bedrooms, drawing rooms, and office lighting circuits.",
    sku: "SW-3G-MOD",
    brand: "Premium Modular",
    availability: "InStock",
    specs: {
      "Gang Count": "3 Buttons (1-Way / 2-Way compatible)",
      "Current Rating": "10A - 16A",
      "Voltage": "220V - 250V AC",
      "Material": "Polycarbonate Flame Retardant Plate",
      "Contact Points": "Silver-alloy anti-spark contacts",
      "Color": "Clean White / Off-white",
    },
    seoTitle: "3-Gang Electrical Switch Board in Islamabad | Hassan Electric & Traders",
    metaDescription: "High quality 3-gang electrical switch board in Islamabad. Available at Hassan Electric & Traders, I&T Center G-8/1.",
    canonicalUrl: "/products/3-gang-modular-switch-board",
    isIndexable: true,
  },
  {
    name: "2-Gang Modular Electrical Switch Board",
    slug: "2-gang-modular-switch-board",
    category: "switches",
    price: 0,
    currency: "PKR",
    image: "/images/switch-board.webp",
    imageAlt: "2-button modular electrical switch board",
    shortDescription: "Compact 2-gang modular switch board for dual-light or light-fan circuit operation.",
    description: "Sleek 2-gang switch board crafted from durable polycarbonate with clean aesthetic styling. Fits standard concealed electrical metal/plastic back boxes.",
    sku: "SW-2G-MOD",
    brand: "Premium Modular",
    availability: "InStock",
    specs: {
      "Gang Count": "2 Buttons",
      "Current Rating": "10A",
      "Voltage": "220V - 250V AC",
      "Material": "Flame-Retardant Polycarbonate",
      "Compatibility": "Standard Pakistani Backbox Sizes",
    },
    seoTitle: "2-Gang Modular Switch Board in Islamabad | Hassan Electric & Traders",
    metaDescription: "Buy 2-button modular switch plates in Islamabad from Hassan Electric & Traders in G-8/1. Ask availability on WhatsApp.",
    canonicalUrl: "/products/2-gang-modular-switch-board",
    isIndexable: true,
  },
  {
    name: "Single Pole 20A Miniature Circuit Breaker (MCB)",
    slug: "20a-single-pole-mcb-breaker",
    category: "circuit-breakers",
    price: 0,
    currency: "PKR",
    image: "/images/cable-image.png",
    imageAlt: "Single pole 20A miniature circuit breaker for distribution board",
    shortDescription: "Single pole 20 Amp miniature circuit breaker for overload and short-circuit circuit protection.",
    description: "20A single pole MCB designed for DIN rail mounting in consumer distribution boxes. Provides thermal-magnetic trip protection against electrical faults, preventing wire burnout and fire hazards.",
    sku: "MCB-1P-20A",
    brand: "Standard Protective Equipment",
    availability: "InStock",
    specs: {
      "Poles": "1 Pole (Single Phase Protection)",
      "Rated Current": "20 Amperes",
      "Breaking Capacity": "6kA",
      "Mounting": "Standard 35mm DIN Rail",
      "Trip Mechanism": "Thermal-Magnetic Overload & Short Circuit",
    },
    seoTitle: "20A Single Pole Circuit Breaker (MCB) in Islamabad | Hassan Electric",
    metaDescription: "Protect electrical circuits with 20A single-pole MCB breakers from Hassan Electric & Traders, G-8/1 Islamabad. In-stock and verified.",
    canonicalUrl: "/products/20a-single-pole-mcb-breaker",
    isIndexable: true,
  },
  {
    name: "Universal Multi-Pin Socket Outlet with Switch",
    slug: "universal-multi-pin-socket-outlet",
    category: "sockets",
    price: 0,
    currency: "PKR",
    image: "/images/switch-board.webp",
    imageAlt: "Universal multi-pin socket outlet with dedicated switch",
    shortDescription: "Universal 13A/16A socket accommodating 2-pin flat, 2-pin round, and 3-pin British plugs.",
    description: "Versatile wall socket unit featuring an integrated on/off rocker switch. Accepts international and Pakistani plug types without requiring hazardous external adapters.",
    sku: "SKT-UNI-SW",
    brand: "Premium Modular",
    availability: "InStock",
    specs: {
      "Socket Type": "Universal Multi-Pin",
      "Current Rating": "13A / 16A",
      "Voltage": "220V - 250V",
      "Safety": "Internal Shutter & Ground Connection",
      "Mounting": "Standard Wall Box",
    },
    seoTitle: "Universal Multi-Pin Socket with Switch in Islamabad | Hassan Electric",
    metaDescription: "Shop universal multi-plug wall sockets with switch in Islamabad. Hassan Electric & Traders, G-8/1. Contact on WhatsApp.",
    canonicalUrl: "/products/universal-multi-pin-socket-outlet",
    isIndexable: true,
  },
];

export const articles: Article[] = [
  {
    title: "How to Choose the Right Electrical Wire Size for Your Home (1.5mm, 2.5mm vs 4mm)",
    slug: "how-to-choose-electrical-wire-size",
    excerpt: "A practical guide to wire gauges in Pakistan: choosing the right copper cross-section for lights, sockets, inverter ACs, and fire prevention.",
    publishedDate: "2026-03-15",
    readTime: "4 min read",
    featuredImage: "/images/cable-image.png",
    featuredImageAlt: "Copper electrical wire sizing and gauges comparison guide",
    category: "Buying Guide",
    seoTitle: "How to Choose Electrical Wire Size in Pakistan | Hassan Electric Guide",
    metaDescription: "Learn how to choose between 1.5mm, 2.5mm, and 4mm copper electrical wire for your home wiring in Islamabad. Practical guide by Hassan Electric & Traders.",
    content: `Selecting the right electrical wire size is critical for both electrical efficiency and fire prevention. In Pakistani residential wiring, copper wire sizing is typically measured in square millimeters (mm²) or traditional strand gauges (like 3/029 or 7/029).

### 1. Lighting and Fan Circuits: 1.5mm² (or 3/029)
For standard room lights, LED downlights, and ceiling fans, 1.5mm copper wire is the standard choice. It carries up to 10-14 Amperes comfortably, well above the load of modern LED lighting.

### 2. General Power Sockets: 2.5mm² (or 7/029)
Wall sockets in bedrooms, living areas, and small appliances require 2.5mm copper wire. This accommodates irons, vacuum cleaners, televisions, and desktop computers safely without voltage drop.

### 3. Inverter Air Conditioners & Geysers: 4.0mm² to 6.0mm²
Heavy inductive loads like 1.5-ton and 2.0-ton inverter ACs, instant electric water heaters, and kitchen microwaves draw higher continuous current. A dedicated 4.0mm copper line directly from the distribution board is strongly advised.

### Summary Checklist for Islamabad Homeowners:
- Always choose 99.9% pure electrolytic copper cables.
- Match circuit breaker amperage to the wire capacity (e.g., 10A for 1.5mm, 16A/20A for 2.5mm, 32A for 4.0mm).
- Visit Hassan Electric & Traders in G-8/1 Islamabad for verified copper cable options.`,
  },
  {
    title: "Understanding Electrical Switch Boards: 1-Gang to 4-Gang & Button Types",
    slug: "understanding-electrical-switch-types",
    excerpt: "Learn what switch 'gangs' mean, differences between 1-way and 2-way switches, fan dimmers, and how to plan switch boards for each room.",
    publishedDate: "2026-03-10",
    readTime: "3 min read",
    featuredImage: "/images/switch-board.webp",
    featuredImageAlt: "Modular electrical switch board types and buttons",
    category: "Buying Guide",
    seoTitle: "Electrical Switch Board Types & Gang Guide | Hassan Electric Islamabad",
    metaDescription: "Understanding 1-gang, 2-gang, and 3-gang switch boards and button options for home wiring. Read the guide from Hassan Electric & Traders.",
    content: `When rewiring or renovating a house or office in Islamabad, selecting the correct switch configurations ensures both convenience and modern aesthetics.

### What Does 'Gang' Mean in Electrical Switches?
The term 'gang' refers to the number of individual switch buttons mounted on a single front plate:
- **1-Gang Switch**: Controls a single lighting point or appliance.
- **2-Gang Switch**: Two independent buttons on one plate (e.g., ceiling light + accent light).
- **3-Gang / 4-Gang Switch**: Multiple buttons grouped together for complex room lighting.

### 1-Way vs. 2-Way Switches
A standard 1-way switch operates a light from a single location. A 2-way switch allows you to control the same light fixture from two different locations (commonly used at the top and bottom of staircases or bedside switchboards).

### Safe Material Quality
Ensure plates are made from flame-retardant polycarbonate and contain silver-alloy contacts to prevent sparking and contact welding under frequent use.

Have questions about switch board setups? Contact Hassan Electric & Traders in G-8/1, Islamabad on WhatsApp at +92 330 3000093.`,
  },
  {
    title: "Circuit Breakers Explained: How Single Pole & Double Pole MCBs Protect Your Home",
    slug: "how-to-choose-circuit-breaker",
    excerpt: "Why miniature circuit breakers (MCBs) trip, differences between single-pole and double-pole breakers, and proper distribution board sizing.",
    publishedDate: "2026-03-05",
    readTime: "4 min read",
    featuredImage: "/images/cable-image.png",
    featuredImageAlt: "Miniature circuit breaker installation diagram",
    category: "Buying Guide",
    seoTitle: "How to Choose Circuit Breakers (MCB) in Islamabad | Hassan Electric",
    metaDescription: "Understand single pole vs double pole MCB breakers and safety sizing for your electrical board. Expert advice from Hassan Electric & Traders.",
    content: `Circuit breakers are the primary defense against electrical fires, wiring overload, and short-circuits.

### How a Miniature Circuit Breaker (MCB) Works
An MCB detects two types of faults:
1. **Overcurrent / Overload**: When too many appliances run simultaneously, heating the bimetallic strip until it trips before the wire insulation melts.
2. **Short Circuit**: When live and neutral wires touch, triggering an electromagnetic trip within milliseconds.

### Single Pole (SP) vs. Double Pole (DP)
- **Single Pole (SP)**: Breaks the live (phase) wire only. Used on individual room circuits (10A for lights, 20A for sockets).
- **Double Pole (DP)**: Breaks both the live and neutral conductors simultaneously. Standardly installed as the main incoming isolation switch for each sub-distribution board.

Get genuine, tested circuit breakers at Hassan Electric & Traders, located at I&T Center G-8/1, Islamabad.`,
  },
];

export const faqs: FAQItem[] = [
  {
    question: "Where is Hassan Electric & Traders located in Islamabad?",
    answer: "Hassan Electric & Traders is located at I & T Center, Block 47 Street 14, G-8/1, G-8, Islamabad, 44090, Pakistan. We are situated in the commercial center, conveniently accessible from Kashmir Highway, F-8, and Blue Area.",
    category: "Location & Store",
  },
  {
    question: "How can I check product availability or get current prices?",
    answer: "Call us directly at 0330 3000093 or send a WhatsApp message to +92 330 3000093 with the product name, wire gauge, or specification you require. We confirm brand and stock promptly.",
    category: "Ordering & Inquiries",
  },
  {
    question: "What electrical wire gauges and sizes do you stock?",
    answer: "We supply pure copper electrical wires including 1.5mm, 2.5mm, 4.0mm, 6.0mm, and traditional strand gauges such as 3/029 and 7/029 in standard 90-meter coils.",
    category: "Products",
  },
  {
    question: "Do you sell modular switch boards with different button counts?",
    answer: "Yes, we stock modular switch boards ranging from 1-gang to 4-gang, along with fan regulators, bell pushes, and universal multi-pin sockets.",
    category: "Products",
  },
  {
    question: "Can contractors and electricians purchase materials for project wiring?",
    answer: "Yes, electricians, building contractors, and homeowners can visit our G-8/1 shop to source wiring essentials, distribution boards, breakers, and accessories.",
    category: "Services",
  },
  {
    question: "Do you provide delivery or can I pick up in-store?",
    answer: "You can visit our physical shop in G-8/1 Islamabad during business hours (Monday to Saturday 9:00 AM - 8:30 PM). For local deliveries or large orders, contact us on WhatsApp to discuss arrangements.",
    category: "Store Hours & Delivery",
  },
];

// --- Retrieval helpers with fallback ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchProducts(categorySlug?: string): Promise<Product[]> {
  try {
    const url = categorySlug
      ? `${API_URL}/api/products?category=${encodeURIComponent(categorySlug)}`
      : `${API_URL}/api/products`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => ({
          name: d.name,
          slug: d.slug,
          category: d.category_slug,
          price: d.price || 0,
          currency: d.currency || "PKR",
          image: d.image_url || "/images/cable-image.png",
          imageAlt: d.image_alt || d.name,
          shortDescription: d.short_description || "",
          description: d.description || "",
          sku: d.sku,
          brand: d.brand,
          availability: (d.availability as any) || "InStock",
          specs: d.specs || {},
          seoTitle: d.seo_title,
          metaDescription: d.meta_description,
          canonicalUrl: d.canonical_url,
          isIndexable: d.is_indexable ?? true,
        }));
      }
    }
  } catch {
    // Graceful fallback to static catalog
  }
  return categorySlug ? products.filter((p) => p.category === categorySlug) : products;
}

export async function fetchProduct(slug: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const d = await res.json();
      return {
        name: d.name,
        slug: d.slug,
        category: d.category_slug,
        price: d.price || 0,
        currency: d.currency || "PKR",
        image: d.image_url || "/images/cable-image.png",
        imageAlt: d.image_alt || d.name,
        shortDescription: d.short_description || "",
        description: d.description || "",
        sku: d.sku,
        brand: d.brand,
        availability: (d.availability as any) || "InStock",
        specs: d.specs || {},
        seoTitle: d.seo_title,
        metaDescription: d.meta_description,
        canonicalUrl: d.canonical_url,
        isIndexable: d.is_indexable ?? true,
      };
    }
  } catch {
    // Graceful fallback
  }
  return products.find((p) => p.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
