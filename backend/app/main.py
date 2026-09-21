"""
Hassan Electric & Traders — Enterprise FastAPI Backend
Features:
- Dynamic Product, Category, FAQ, Article (Buying Guides), and CMS Content management
- Schema.org aligned models with full SEO metadata (seo_title, meta_description, canonical_url, is_indexable)
- SEO Audit Endpoint (/api/admin/seo-audit) for real-time catalog optimization monitoring
- Dynamic Sitemap Data Endpoint (/api/sitemap-entries)
- Seeded initial catalog for instant offline/online operational readiness
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from os import getenv
from typing import Any, Optional
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    create_engine,
    select,
    func,
    inspect,
    text,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

DATABASE_URL = getenv("DATABASE_URL", "sqlite:///./hassan_electric.db").replace(
    "postgres://", "postgresql+psycopg://", 1
)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

ADMIN_API_KEY = getenv("ADMIN_API_KEY", "hassan-admin-2026")


class Base(DeclarativeBase):
    pass


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    seo_title: Mapped[Optional[str]] = mapped_column(String(180), nullable=True)
    meta_description: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    faq_items: Mapped[Optional[list]] = mapped_column(JSON, default=list)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)
    category_slug: Mapped[str] = mapped_column(String(160), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    short_description: Mapped[str] = mapped_column(Text, default="")
    sku: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    brand: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, default="Standard Quality")
    price: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String(10), default="PKR")
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    image_alt: Mapped[Optional[str]] = mapped_column(String(250), nullable=True)
    specs: Mapped[dict] = mapped_column(JSON, default=dict)
    seo_title: Mapped[Optional[str]] = mapped_column(String(180), nullable=True)
    meta_description: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    canonical_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_indexable: Mapped[bool] = mapped_column(Boolean, default=True)
    availability: Mapped[str] = mapped_column(String(30), default="InStock")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )


class Article(Base):
    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(250), nullable=False)
    slug: Mapped[str] = mapped_column(String(250), unique=True, index=True, nullable=False)
    excerpt: Mapped[str] = mapped_column(Text, default="")
    content: Mapped[str] = mapped_column(Text, default="")
    featured_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    featured_image_alt: Mapped[Optional[str]] = mapped_column(String(250), nullable=True)
    category: Mapped[str] = mapped_column(String(100), default="Buying Guide")
    seo_title: Mapped[Optional[str]] = mapped_column(String(180), nullable=True)
    meta_description: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )


class FAQItem(Base):
    __tablename__ = "faqs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    question: Mapped[str] = mapped_column(String(300), nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), default="General")
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class BusinessContent(Base):
    __tablename__ = "business_content"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    content: Mapped[dict] = mapped_column(JSON, default=dict)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )


# --- Pydantic Schemas ---
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str = ""
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None
    image_url: Optional[str] = None
    faq_items: Optional[list] = []


class CategoryOut(CategoryBase):
    id: int
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    name: str
    slug: str
    category_slug: str
    description: str = ""
    short_description: str = ""
    sku: str
    brand: Optional[str] = "Standard Quality"
    price: float = 0.0
    currency: str = "PKR"
    image_url: Optional[str] = None
    image_alt: Optional[str] = None
    specs: dict = Field(default_factory=dict)
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None
    canonical_url: Optional[str] = None
    is_indexable: bool = True
    availability: str = "InStock"


class ProductOut(ProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


class ArticleBase(BaseModel):
    title: str
    slug: str
    excerpt: str = ""
    content: str = ""
    featured_image: Optional[str] = None
    featured_image_alt: Optional[str] = None
    category: str = "Buying Guide"
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_published: bool = True


class ArticleOut(ArticleBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


class FAQBase(BaseModel):
    question: str
    answer: str
    category: str = "General"
    display_order: int = 0
    is_active: bool = True


class FAQOut(FAQBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class SEOAuditReport(BaseModel):
    total_products: int
    products_missing_seo_title: list[str]
    products_missing_meta_description: list[str]
    products_missing_image_alt: list[str]
    products_unindexed: list[str]
    total_categories: int
    categories_missing_description: list[str]
    total_articles: int
    articles_missing_seo: list[str]
    seo_health_score: int


def verify_admin(x_admin_key: Optional[str] = Header(None)):
    if x_admin_key != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    return True


def seed_database():
    with SessionLocal() as db:
        if db.scalar(select(func.count(Category.id))) == 0:
            categories_seed = [
                Category(
                    name="Wires & Cables",
                    slug="wires-and-cables",
                    description="Pure copper electrical wires, single core and multi-strand cables for residential, commercial and industrial wiring in Islamabad.",
                    seo_title="Pure Copper Electrical Wires & Cables in Islamabad | Hassan Electric & Traders",
                    meta_description="Browse 1.5mm, 2.5mm, 4mm, 6mm and 7/029 copper wires at Hassan Electric & Traders, G-8/1 Islamabad. In-stock availability and fast WhatsApp quotes.",
                    image_url="/images/cable-image.png",
                ),
                Category(
                    name="Switches & Sockets",
                    slug="switches",
                    description="Premium 1-gang to 4-gang modular switches, bell pushes, fan dimmers, and universal multi-pin sockets.",
                    seo_title="Electrical Switches & Switch Boards in Islamabad | Hassan Electric & Traders",
                    meta_description="Shop 1-button, 2-button, 3-button switch boards and sockets in G-8 Islamabad. Reliable switches from Hassan Electric & Traders.",
                    image_url="/images/switch-board.webp",
                ),
                Category(
                    name="Circuit Breakers & Protection",
                    slug="circuit-breakers",
                    description="Miniature Circuit Breakers (MCB), Earth Leakage (RCCB) and distribution boards for home and building electrical protection.",
                    seo_title="Circuit Breakers (MCB/RCCB) in Islamabad | Hassan Electric & Traders",
                    meta_description="Quality single-pole, double-pole circuit breakers and main distribution boxes in G-8/1 Islamabad. Protect your wiring safely.",
                    image_url="/images/cable-image.png",
                ),
                Category(
                    name="Sockets & Power Outlets",
                    slug="sockets",
                    description="Universal multi-plug sockets, 3-pin power plugs, and heavy appliance wall outlets.",
                    seo_title="Electrical Sockets & Wall Plugs in Islamabad | Hassan Electric & Traders",
                    meta_description="Shop wall sockets, universal pins and multi-plug boards from Hassan Electric & Traders in G-8/1, Islamabad.",
                    image_url="/images/switch-board.webp",
                ),
            ]
            db.add_all(categories_seed)
            db.commit()

        if db.scalar(select(func.count(Product.id))) == 0:
            products_seed = [
                Product(
                    name="2.5mm Single Core Copper Electrical Wire",
                    slug="2-5mm-copper-electrical-wire",
                    category_slug="wires-and-cables",
                    sku="WIRE-CU-2.5MM",
                    brand="Pakistan Cables / Pioneer / Equivalent",
                    price=0.0,
                    image_url="/images/cable-image.png",
                    image_alt="2.5mm single core copper electrical wire coil",
                    short_description="High-conductivity 2.5mm copper electrical wire ideal for socket circuits, room wiring, and appliances in Islamabad.",
                    description="2.5mm single core pure copper electrical wire manufactured to standard electrical safety specifications. Designed for 220V/240V residential and commercial installations. Available in red, black, blue, and green earth colors. Contact Hassan Electric & Traders in G-8/1 Islamabad to verify current coil lengths (90m standard), brand availability, and current market price.",
                    specs={
                        "Wire Size": "2.5 mm²",
                        "Conductor Material": "99.9% Pure Copper",
                        "Insulation": "PVC Flame Retardant",
                        "Voltage Rating": "450/750V",
                        "Standard Coil Length": "90 Meters (approx 100 yards)",
                        "Recommended Use": "General Power Sockets & Appliances",
                        "Origin": "Islamabad / Pakistan Market Stock",
                    },
                    seo_title="2.5mm Copper Electrical Wire in Islamabad | Hassan Electric & Traders",
                    meta_description="Shop 2.5mm copper electrical wire from Hassan Electric & Traders in G-8/1 Islamabad. Check specifications, coil lengths and contact us on WhatsApp.",
                    is_indexable=True,
                    availability="InStock",
                ),
                Product(
                    name="4.0mm Pure Copper Electrical Wire",
                    slug="4mm-copper-electrical-wire",
                    category_slug="wires-and-cables",
                    sku="WIRE-CU-4MM",
                    brand="Standard Quality Copper",
                    price=0.0,
                    image_url="/images/cable-image.png",
                    image_alt="4.0mm heavy duty copper electrical wire",
                    short_description="Heavy-duty 4mm copper electrical wire for air conditioners, geysers, and high-load sub-mains.",
                    description="4.0mm pure copper cable engineered for high current capacity. Suitable for 1.5 ton to 2 ton inverter air conditioners, water heaters, and heavy kitchen appliances. Available in standard 90-meter rolls at Hassan Electric & Traders, G-8/1, Islamabad.",
                    specs={
                        "Wire Size": "4.0 mm²",
                        "Conductor Material": "High Purity Electrolytic Copper",
                        "Voltage Rating": "450/750V",
                        "Recommended Use": "Air Conditioners (1.5 - 2 Ton), Geysers",
                        "Availability": "In stock at G-8/1 shop",
                    },
                    seo_title="4mm Copper Electrical Wire for AC & Geyser in Islamabad | Hassan Electric",
                    meta_description="Buy 4mm copper wire in Islamabad from Hassan Electric & Traders. High-load cable for ACs and heavy appliances. WhatsApp 0330 3000093.",
                    is_indexable=True,
                    availability="InStock",
                ),
                Product(
                    name="3-Gang Modular Electrical Switch Board",
                    slug="3-gang-modular-switch-board",
                    category_slug="switches",
                    sku="SW-3G-MOD",
                    brand="Premium Modular",
                    price=0.0,
                    image_url="/images/switch-board.webp",
                    image_alt="White 3-gang modular electrical switch board",
                    short_description="Contemporary 3-button modular switch plate with smooth rocker action and flame-retardant finish.",
                    description="Durable 3-gang wall switch board designed for modern interiors. Features smooth tactile operation, silver contact points for minimal arcing, and UV-resistant white finish. Suitable for bedrooms, drawing rooms, and office lighting circuits.",
                    specs={
                        "Gang Count": "3 Buttons (1-Way / 2-Way compatible)",
                        "Current Rating": "10A - 16A",
                        "Voltage": "220V - 250V AC",
                        "Material": "Polycarbonate Flame Retardant Plate",
                        "Color": "Clean White / Off-white",
                    },
                    seo_title="3-Gang Electrical Switch Board in Islamabad | Hassan Electric & Traders",
                    meta_description="High quality 3-gang electrical switch board in Islamabad. Available at Hassan Electric & Traders, I&T Center G-8/1.",
                    is_indexable=True,
                    availability="InStock",
                ),
                Product(
                    name="Single Pole 20A Miniature Circuit Breaker (MCB)",
                    slug="20a-single-pole-mcb-breaker",
                    category_slug="circuit-breakers",
                    sku="MCB-1P-20A",
                    brand="Schneider / Terasaki / Legrand Equivalent",
                    price=0.0,
                    image_url="/images/cable-image.png",
                    image_alt="Single pole 20A miniature circuit breaker",
                    short_description="Single pole 20 Amp miniature circuit breaker for overload and short-circuit circuit protection.",
                    description="20A single pole MCB designed for DIN rail mounting in consumer distribution boxes. Provides thermal-magnetic trip protection against electrical faults, preventing wire burnout and fire hazards.",
                    specs={
                        "Poles": "1 Pole (Single Phase)",
                        "Rated Current": "20 Amperes",
                        "Breaking Capacity": "6kA",
                        "Mounting": "Standard 35mm DIN Rail",
                        "Trip Curve": "Type C",
                    },
                    seo_title="20A Single Pole Circuit Breaker (MCB) in Islamabad | Hassan Electric",
                    meta_description="Protect electrical circuits with 20A single-pole MCB breakers from Hassan Electric & Traders, G-8/1 Islamabad. In-stock and verified.",
                    is_indexable=True,
                    availability="InStock",
                ),
            ]
            db.add_all(products_seed)
            db.commit()

        if db.scalar(select(func.count(Article.id))) == 0:
            articles_seed = [
                Article(
                    title="How to Choose the Right Electrical Wire Size for Your Home (1.5mm, 2.5mm vs 4mm)",
                    slug="how-to-choose-electrical-wire-size",
                    excerpt="A practical guide to wire gauges in Pakistan: choosing the right copper cross-section for lights, sockets, inverter ACs, and safety.",
                    content="""Selecting the right electrical wire size is critical for both electrical efficiency and fire prevention. In Pakistani residential wiring, copper wire sizing is typically measured in square millimeters (mm²) or traditional strand gauges (like 3/029 or 7/029).

### 1. Lighting and Fan Circuits: 1.5mm² (or 3/029)
For standard room lights, LED downlights, and ceiling fans, 1.5mm copper wire is the standard choice. It carries up to 10-14 Amperes comfortably, well above the load of modern LED lighting.

### 2. General Power Sockets: 2.5mm² (or 7/029)
Wall sockets in bedrooms, living areas, and small appliances require 2.5mm copper wire. This accommodates irons, vacuum cleaners, televisions, and desktop computers safely without voltage drop.

### 3. Inverter Air Conditioners & Geysers: 4.0mm² to 6.0mm²
Heavy inductive loads like 1.5-ton and 2.0-ton inverter ACs, instant electric water heaters, and kitchen microwaves draw higher continuous current. A dedicated 4.0mm copper line directly from the distribution board is strongly advised.

### Summary Checklist for Islamabad Homeowners:
- Always choose 99.9% pure electrolytic copper cables.
- Match circuit breaker amperage to the wire capacity (e.g., 10A for 1.5mm, 16A/20A for 2.5mm, 32A for 4.0mm).
- Visit Hassan Electric & Traders in G-8/1 Islamabad for verified copper cable options.
""",
                    featured_image="/images/cable-image.png",
                    featured_image_alt="Electrical copper wire coil comparison guide",
                    category="Buying Guide",
                    seo_title="How to Choose Electrical Wire Size in Pakistan | Hassan Electric Guide",
                    meta_description="Learn how to choose between 1.5mm, 2.5mm, and 4mm copper electrical wire for your home wiring in Islamabad. Practical guide by Hassan Electric & Traders.",
                    is_published=True,
                ),
                Article(
                    title="Understanding Electrical Switch Boards: 1-Gang to 4-Gang & Button Types",
                    slug="understanding-electrical-switch-types",
                    excerpt="Learn what switch 'gangs' mean, differences between 1-way and 2-way switches, fan dimmers, and how to plan switch boards for each room.",
                    content="""When rewiring or renovating a house or office in Islamabad, selecting the correct switch configurations ensures both convenience and modern aesthetics.

### What Does 'Gang' Mean in Electrical Switches?
The term 'gang' refers to the number of individual switch buttons mounted on a single front plate:
- **1-Gang Switch**: Controls a single lighting point or appliance.
- **2-Gang Switch**: Two independent buttons on one plate (e.g., ceiling light + accent light).
- **3-Gang / 4-Gang Switch**: Multiple buttons grouped together for complex room lighting.

### 1-Way vs. 2-Way Switches
A standard 1-way switch operates a light from a single location. A 2-way switch allows you to control the same light fixture from two different locations (commonly used at the top and bottom of staircases or bedside switchboards).

### Safe Material Quality
Ensure plates are made from flame-retardant polycarbonate and contain silver-alloy contacts to prevent sparking and contact welding under frequent use.

Have questions about switch board setups? Contact Hassan Electric & Traders in G-8/1, Islamabad on WhatsApp at +92 330 3000093.
""",
                    featured_image="/images/switch-board.webp",
                    featured_image_alt="Modular electrical switch board types",
                    category="Buying Guide",
                    seo_title="Electrical Switch Board Types & Gang Guide | Hassan Electric Islamabad",
                    meta_description="Understanding 1-gang, 2-gang, and 3-gang switch boards and button options for home wiring. Read the guide from Hassan Electric & Traders.",
                    is_published=True,
                ),
                Article(
                    title="Circuit Breakers Explained: How Single Pole & Double Pole MCBs Protect Your Home",
                    slug="how-to-choose-circuit-breaker",
                    excerpt="Why miniature circuit breakers (MCBs) trip, differences between single-pole and double-pole breakers, and proper distribution board sizing.",
                    content="""Circuit breakers are the primary defense against electrical fires, wiring overload, and short-circuits.

### How a Miniature Circuit Breaker (MCB) Works
An MCB detects two types of faults:
1. **Overcurrent / Overload**: When too many appliances run simultaneously, heating the bimetallic strip until it trips before the wire insulation melts.
2. **Short Circuit**: When live and neutral wires touch, triggering an electromagnetic trip within milliseconds.

### Single Pole (SP) vs. Double Pole (DP)
- **Single Pole (SP)**: Breaks the live (phase) wire only. Used on individual room circuits (10A for lights, 20A for sockets).
- **Double Pole (DP)**: Breaks both the live and neutral conductors simultaneously. Standardly installed as the main incoming isolation switch for each sub-distribution board.

Get genuine, tested circuit breakers at Hassan Electric & Traders, located at I&T Center G-8/1, Islamabad.
""",
                    featured_image="/images/cable-image.png",
                    featured_image_alt="Miniature circuit breaker installation diagram",
                    category="Buying Guide",
                    seo_title="How to Choose Circuit Breakers (MCB) in Islamabad | Hassan Electric",
                    meta_description="Understand single pole vs double pole MCB breakers and safety sizing for your electrical board. Expert advice from Hassan Electric & Traders.",
                    is_published=True,
                ),
            ]
            db.add_all(articles_seed)
            db.commit()

        if db.scalar(select(func.count(FAQItem.id))) == 0:
            faqs_seed = [
                FAQItem(
                    question="Where is Hassan Electric & Traders located in Islamabad?",
                    answer="Hassan Electric & Traders is located at I & T Center, Block 47 Street 14, G-8/1, G-8, Islamabad, 44090, Pakistan. We are easily accessible from Kashmir Highway, F-8, and Blue Area.",
                    category="Location & Store",
                    display_order=1,
                ),
                FAQItem(
                    question="How can I check product availability or get current prices?",
                    answer="Call us directly at 0330 3000093 or send a WhatsApp message to +92 330 3000093 with the product name, wire gauge, or specification you require.",
                    category="Ordering & Inquiries",
                    display_order=2,
                ),
                FAQItem(
                    question="What electrical wire gauges and sizes do you stock?",
                    answer="We provide pure copper electrical wires including 1.5mm, 2.5mm, 4.0mm, 6.0mm, and traditional strand gauges such as 3/029 and 7/029. Please confirm current coil lengths and brands directly on WhatsApp.",
                    category="Products",
                    display_order=3,
                ),
                FAQItem(
                    question="Do you sell switch boards with different button counts?",
                    answer="Yes, we stock modular switch boards ranging from 1-gang to 4-gang, along with fan regulators, bell pushes, and universal multi-pin sockets.",
                    category="Products",
                    display_order=4,
                ),
                FAQItem(
                    question="Can contractors and electricians purchase materials for project wiring?",
                    answer="Yes, electricians, building contractors, and homeowners can visit our G-8/1 shop to source wiring essentials, distribution boards, breakers, and accessories.",
                    category="Services",
                    display_order=5,
                ),
            ]
            db.add_all(faqs_seed)
            db.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(engine)
    # Lightweight migration for databases created before category image versioning.
    if "updated_at" not in {column["name"] for column in inspect(engine).get_columns("categories")}:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE categories ADD COLUMN updated_at DATETIME"))
            connection.execute(text("UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL"))
    # Demo rows are opt-in. A cleared production catalogue must stay cleared.
    if getenv("SEED_DEMO_DATA", "false").lower() == "true":
        seed_database()
    yield


app = FastAPI(
    title="Hassan Electric & Traders API",
    description="Production-ready Catalogue, CMS, and Dynamic SEO Engine for Hassan Electric & Traders in Islamabad",
    version="2.0.0",
    lifespan=lifespan,
)

origins = [o.strip() for o in getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",") if o]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "business": "Hassan Electric & Traders", "time": datetime.now(timezone.utc).isoformat()}


# --- Public Catalogue Endpoints ---
@app.get("/api/categories", response_model=list[CategoryOut])
def list_categories():
    with SessionLocal() as db:
        return db.scalars(select(Category).order_by(Category.id)).all()


@app.get("/api/categories/{slug}", response_model=CategoryOut)
def get_category(slug: str):
    with SessionLocal() as db:
        item = db.scalar(select(Category).where(Category.slug == slug))
        if not item:
            raise HTTPException(404, "Category not found")
        return item


@app.get("/api/products", response_model=list[ProductOut])
def list_products(category: Optional[str] = None):
    with SessionLocal() as db:
        query = select(Product).where(Product.is_indexable.is_(True))
        if category:
            query = query.where(Product.category_slug == category)
        return db.scalars(query.order_by(Product.name)).all()


@app.get("/api/products/{slug}", response_model=ProductOut)
def get_product(slug: str):
    with SessionLocal() as db:
        item = db.scalar(select(Product).where(Product.slug == slug))
        if not item:
            raise HTTPException(404, "Product not found")
        return item


# --- Public Blog / Buying Guides Endpoints (Item 83) ---
@app.get("/api/articles", response_model=list[ArticleOut])
def list_articles():
    with SessionLocal() as db:
        return db.scalars(
            select(Article).where(Article.is_published.is_(True)).order_by(Article.created_at.desc())
        ).all()


@app.get("/api/articles/{slug}", response_model=ArticleOut)
def get_article(slug: str):
    with SessionLocal() as db:
        item = db.scalar(select(Article).where(Article.slug == slug, Article.is_published.is_(True)))
        if not item:
            raise HTTPException(404, "Article not found")
        return item


# --- Public FAQ Endpoints (Item 77, 78) ---
@app.get("/api/faqs", response_model=list[FAQOut])
def list_faqs(category: Optional[str] = None):
    with SessionLocal() as db:
        query = select(FAQItem).where(FAQItem.is_active.is_(True))
        if category:
            query = query.where(FAQItem.category == category)
        return db.scalars(query.order_by(FAQItem.display_order, FAQItem.id)).all()


# --- Dynamic Sitemap Feed (Item 92) ---
@app.get("/api/sitemap-entries")
def get_sitemap_entries():
    with SessionLocal() as db:
        categories = db.scalars(select(Category.slug)).all()
        products = db.scalars(select(Product.slug).where(Product.is_indexable.is_(True))).all()
        articles = db.scalars(select(Article.slug).where(Article.is_published.is_(True))).all()
        return {
            "categories": [{"slug": s, "changefreq": "weekly", "priority": 0.8} for s in categories],
            "products": [{"slug": s, "changefreq": "weekly", "priority": 0.9} for s in products],
            "articles": [{"slug": s, "changefreq": "monthly", "priority": 0.7} for s in articles],
            "static": [
                {"path": "", "priority": 1.0},
                {"path": "/islamabad", "priority": 0.9},
                {"path": "/about", "priority": 0.7},
                {"path": "/contact", "priority": 0.8},
                {"path": "/faq", "priority": 0.8},
                {"path": "/blog", "priority": 0.8},
            ],
        }


# --- Admin SEO Audit Endpoint (Item 89) ---
@app.get("/api/admin/seo-audit", response_model=SEOAuditReport, dependencies=[Depends(verify_admin)])
def seo_audit():
    with SessionLocal() as db:
        all_products = db.scalars(select(Product)).all()
        all_categories = db.scalars(select(Category)).all()
        all_articles = db.scalars(select(Article)).all()

        missing_title = [p.name for p in all_products if not p.seo_title or len(p.seo_title.strip()) < 10]
        missing_meta = [p.name for p in all_products if not p.meta_description or len(p.meta_description.strip()) < 20]
        missing_alt = [p.name for p in all_products if not p.image_alt or len(p.image_alt.strip()) < 5]
        unindexed = [p.name for p in all_products if not p.is_indexable]

        cat_missing_desc = [c.name for c in all_categories if not c.description or len(c.description.strip()) < 20]
        art_missing_seo = [a.title for a in all_articles if not a.seo_title or not a.meta_description]

        # Calculate a realistic 0-100 score
        total_items = max(len(all_products) + len(all_categories) + len(all_articles), 1)
        flaws = len(missing_title) + len(missing_meta) + len(missing_alt) + len(cat_missing_desc) + len(art_missing_seo)
        score = max(10, min(100, int(100 - (flaws / (total_items * 3)) * 100)))

        return SEOAuditReport(
            total_products=len(all_products),
            products_missing_seo_title=missing_title,
            products_missing_meta_description=missing_meta,
            products_missing_image_alt=missing_alt,
            products_unindexed=unindexed,
            total_categories=len(all_categories),
            categories_missing_description=cat_missing_desc,
            total_articles=len(all_articles),
            articles_missing_seo=art_missing_seo,
            seo_health_score=score,
        )


# --- Admin CRUD for Products (Items 60, 74) ---
@app.get("/api/admin/products", response_model=list[ProductOut], dependencies=[Depends(verify_admin)])
def admin_list_products():
    with SessionLocal() as db:
        return db.scalars(select(Product).order_by(Product.id.desc())).all()


@app.post("/api/admin/products", response_model=ProductOut, dependencies=[Depends(verify_admin)])
def admin_create_product(payload: ProductBase):
    with SessionLocal() as db:
        if db.scalar(select(Product).where(Product.slug == payload.slug)):
            raise HTTPException(400, "Product slug already exists")
        if db.scalar(select(Product).where(Product.sku == payload.sku)):
            raise HTTPException(400, "Product SKU already exists")

        # Auto-generate SEO fields if omitted
        if not payload.seo_title:
            payload.seo_title = f"{payload.name} in Islamabad | Hassan Electric & Traders"
        if not payload.meta_description:
            payload.meta_description = f"Shop {payload.name} from Hassan Electric & Traders in G-8/1 Islamabad. Check specifications, availability and price on WhatsApp."

        item = Product(**payload.model_dump())
        db.add(item)
        db.commit()
        db.refresh(item)
        return item


@app.put("/api/admin/products/{id}", response_model=ProductOut, dependencies=[Depends(verify_admin)])
def admin_update_product(id: int, payload: ProductBase):
    with SessionLocal() as db:
        item = db.get(Product, id)
        if not item:
            raise HTTPException(404, "Product not found")

        if not payload.seo_title:
            payload.seo_title = f"{payload.name} in Islamabad | Hassan Electric & Traders"
        if not payload.meta_description:
            payload.meta_description = f"Ask about {payload.name} at Hassan Electric & Traders in G-8/1 Islamabad. See product details and confirm availability on WhatsApp."
        for key, value in payload.model_dump().items():
            setattr(item, key, value)

        db.commit()
        db.refresh(item)
        return item


@app.delete("/api/admin/products/{id}", dependencies=[Depends(verify_admin)])
def admin_delete_product(id: int):
    with SessionLocal() as db:
        item = db.get(Product, id)
        if not item:
            raise HTTPException(404, "Product not found")
        db.delete(item)
        db.commit()
        return {"ok": True, "message": "Product removed"}


@app.delete("/api/admin/products", dependencies=[Depends(verify_admin)])
def admin_delete_all_products():
    """Clear the catalogue deliberately; this never re-seeds unless SEED_DEMO_DATA=true."""
    with SessionLocal() as db:
        count = len(db.scalars(select(Product)).all())
        db.query(Product).delete()
        db.commit()
        return {"ok": True, "deleted": count}


@app.get("/api/admin/categories", response_model=list[CategoryOut], dependencies=[Depends(verify_admin)])
def admin_list_categories():
    with SessionLocal() as db:
        return db.scalars(select(Category).order_by(Category.id)).all()


@app.post("/api/admin/categories", response_model=CategoryOut, dependencies=[Depends(verify_admin)])
def admin_create_category(payload: CategoryBase):
    with SessionLocal() as db:
        if db.scalar(select(Category).where(Category.slug == payload.slug)):
            raise HTTPException(400, "Category slug already exists")
        if not payload.seo_title:
            payload.seo_title = f"{payload.name} in Islamabad | Hassan Electric & Traders"
        if not payload.meta_description:
            payload.meta_description = f"Browse {payload.name} at Hassan Electric & Traders in G-8/1 Islamabad. Ask about current availability and product details."
        item = Category(**payload.model_dump())
        db.add(item)
        db.commit()
        db.refresh(item)
        return item


@app.put("/api/admin/categories/{id}", response_model=CategoryOut, dependencies=[Depends(verify_admin)])
def admin_update_category(id: int, payload: CategoryBase):
    with SessionLocal() as db:
        item = db.get(Category, id)
        if not item:
            raise HTTPException(404, "Category not found")
        # Keep the slug stable when products already use it, avoiding broken URLs.
        if payload.slug != item.slug and db.scalar(select(Product).where(Product.category_slug == item.slug)):
            raise HTTPException(400, "Keep this category slug while products use it")
        if not payload.seo_title:
            payload.seo_title = f"{payload.name} in Islamabad | Hassan Electric & Traders"
        if not payload.meta_description:
            payload.meta_description = f"Browse {payload.name} at Hassan Electric & Traders in G-8/1 Islamabad. Ask about current availability and product details."
        for key, value in payload.model_dump().items():
            setattr(item, key, value)
        db.commit()
        db.refresh(item)
        return item


@app.delete("/api/admin/categories/{id}", dependencies=[Depends(verify_admin)])
def admin_delete_category(id: int):
    with SessionLocal() as db:
        item = db.get(Category, id)
        if not item:
            raise HTTPException(404, "Category not found")
        if db.scalar(select(Product).where(Product.category_slug == item.slug)):
            raise HTTPException(400, "Delete or move products in this category first")
        db.delete(item)
        db.commit()
        return {"ok": True, "message": "Category removed"}


# --- Admin CRUD for Articles / Buying Guides (Item 83) ---
@app.get("/api/admin/articles", response_model=list[ArticleOut], dependencies=[Depends(verify_admin)])
def admin_list_articles():
    with SessionLocal() as db:
        return db.scalars(select(Article).order_by(Article.id.desc())).all()


@app.post("/api/admin/articles", response_model=ArticleOut, dependencies=[Depends(verify_admin)])
def admin_create_article(payload: ArticleBase):
    with SessionLocal() as db:
        if db.scalar(select(Article).where(Article.slug == payload.slug)):
            raise HTTPException(400, "Article slug already exists")

        if not payload.seo_title:
            payload.seo_title = f"{payload.title} | Hassan Electric & Traders"
        if not payload.meta_description:
            payload.meta_description = payload.excerpt[:160]

        item = Article(**payload.model_dump())
        db.add(item)
        db.commit()
        db.refresh(item)
        return item


@app.put("/api/admin/articles/{id}", response_model=ArticleOut, dependencies=[Depends(verify_admin)])
def admin_update_article(id: int, payload: ArticleBase):
    with SessionLocal() as db:
        item = db.get(Article, id)
        if not item:
            raise HTTPException(404, "Article not found")

        for key, value in payload.model_dump().items():
            setattr(item, key, value)

        db.commit()
        db.refresh(item)
        return item


@app.delete("/api/admin/articles/{id}", dependencies=[Depends(verify_admin)])
def admin_delete_article(id: int):
    with SessionLocal() as db:
        item = db.get(Article, id)
        if not item:
            raise HTTPException(404, "Article not found")
        db.delete(item)
        db.commit()
        return {"ok": True, "message": "Article removed"}


# --- Admin CRUD for FAQs (Item 78) ---
@app.get("/api/admin/faqs", response_model=list[FAQOut], dependencies=[Depends(verify_admin)])
def admin_list_faqs():
    with SessionLocal() as db:
        return db.scalars(select(FAQItem).order_by(FAQItem.display_order, FAQItem.id)).all()


@app.post("/api/admin/faqs", response_model=FAQOut, dependencies=[Depends(verify_admin)])
def admin_create_faq(payload: FAQBase):
    with SessionLocal() as db:
        item = FAQItem(**payload.model_dump())
        db.add(item)
        db.commit()
        db.refresh(item)
        return item


@app.put("/api/admin/faqs/{id}", response_model=FAQOut, dependencies=[Depends(verify_admin)])
def admin_update_faq(id: int, payload: FAQBase):
    with SessionLocal() as db:
        item = db.get(FAQItem, id)
        if not item:
            raise HTTPException(404, "FAQ item not found")

        for key, value in payload.model_dump().items():
            setattr(item, key, value)

        db.commit()
        db.refresh(item)
        return item


@app.delete("/api/admin/faqs/{id}", dependencies=[Depends(verify_admin)])
def admin_delete_faq(id: int):
    with SessionLocal() as db:
        item = db.get(FAQItem, id)
        if not item:
            raise HTTPException(404, "FAQ item not found")
        db.delete(item)
        db.commit()
        return {"ok": True, "message": "FAQ item removed"}
