export interface Env { CATALOG: D1Database; ADMIN_PASSWORD: string; SITE_ORIGIN?: string; }
// Runtime credentials are configured in Cloudflare Worker secrets, never in this repository.

const headers = (origin: string) => ({
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": origin,
  "access-control-allow-headers": "content-type,x-admin-key",
  "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
});
const send = (data: unknown, status = 200, origin = "*") => new Response(status === 204 ? null : JSON.stringify(data), { status, headers: headers(origin) });
const slug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const product = (row: any) => ({ ...row, specs: JSON.parse(row.specs_json || "{}"), colors: JSON.parse(row.colors_json || "[]"), options: JSON.parse(row.options_json || "[]"), is_indexable: Boolean(row.is_indexable) });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.SITE_ORIGIN || "*";
    if (request.method === "OPTIONS") return send({}, 204, origin);
    if (new URL(request.url).pathname === "/api/health") {
      return send({ ok: true, databaseBound: Boolean(env.CATALOG), adminPasswordConfigured: Boolean(env.ADMIN_PASSWORD) }, 200, origin);
    }
    const parts = new URL(request.url).pathname.split("/").filter(Boolean);
    const isAdmin = parts[1] === "admin";
    const resource = (isAdmin ? parts[2] : parts[1]) as "products" | "categories";
    const idOrSlug = isAdmin ? parts[3] : parts[2];
    if (resource !== "products" && resource !== "categories") return send({ detail: "Not found" }, 404, origin);
    const table = resource;

    if (request.method === "GET" && !isAdmin) {
      if (idOrSlug) {
        const row = await env.CATALOG.prepare(`SELECT * FROM ${table} WHERE slug = ?`).bind(idOrSlug).first<any>();
        return row ? send(table === "products" ? product(row) : row, 200, origin) : send({ detail: "Not found" }, 404, origin);
      }
      const category = new URL(request.url).searchParams.get("category");
      const rows = category && table === "products"
        ? await env.CATALOG.prepare("SELECT * FROM products WHERE category_slug = ? ORDER BY id DESC").bind(category).all<any>()
        : await env.CATALOG.prepare(`SELECT * FROM ${table} ORDER BY id DESC`).all<any>();
      return send(rows.results.map((row) => table === "products" ? product(row) : row), 200, origin);
    }

    if (!isAdmin || request.headers.get("x-admin-key") !== env.ADMIN_PASSWORD) return send({ detail: "Admin password required" }, 401, origin);
    if (request.method === "GET") {
      const rows = await env.CATALOG.prepare(`SELECT * FROM ${table} ORDER BY id DESC`).all<any>();
      return send(rows.results.map((row) => table === "products" ? product(row) : row), 200, origin);
    }
    if (request.method === "DELETE") {
      await env.CATALOG.prepare(idOrSlug ? `DELETE FROM ${table} WHERE id = ?` : `DELETE FROM ${table}`).bind(...(idOrSlug ? [idOrSlug] : [])).run();
      return send({ ok: true }, 200, origin);
    }
    if (request.method !== "POST" && !(request.method === "PUT" && idOrSlug)) return send({ detail: "Method not allowed" }, 405, origin);

    const raw = await request.json<any>();
    const name = String(raw.name || "").trim();
    const description = String(raw.description || "").trim();
    const common = {
      name, slug: slug(raw.slug || name), description, image_url: String(raw.image_url || "").trim(),
      seo_title: `${name} in Islamabad | Hassan Electric & Traders`,
      meta_description: (description || `Shop ${name} from Hassan Electric & Traders in G-8/1 Islamabad.`).slice(0, 155),
      updated_at: new Date().toISOString(),
    };
    if (!common.name || !common.slug || (table === "products" && !common.image_url)) return send({ detail: table === "products" ? "Name and image URL are required." : "Category name is required." }, 400, origin);
    const values: Record<string, any> = table === "products" ? {
      ...common, category_slug: slug(raw.category_slug || ""), price: Number(raw.price || 0), currency: raw.currency || "PKR",
      image_alt: raw.image_alt || name, short_description: raw.short_description || description, sku: raw.sku || common.slug,
      brand: raw.brand || null, availability: raw.availability || "InStock", specs_json: JSON.stringify(raw.specs || {}), colors_json: JSON.stringify(Array.isArray(raw.colors) ? raw.colors : []), options_json: JSON.stringify(Array.isArray(raw.options) ? raw.options : []),
      canonical_url: raw.canonical_url || null, is_indexable: raw.is_indexable === false ? 0 : 1,
    } : common;
    const columns = Object.keys(values);
    if (request.method === "POST") {
      const result = await env.CATALOG.prepare(`INSERT INTO ${table} (${columns.join(",")}) VALUES (${columns.map(() => "?").join(",")})`).bind(...columns.map((key) => values[key])).run();
      const row = await env.CATALOG.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(result.meta.last_row_id).first<any>();
      return send(table === "products" ? product(row) : row, 201, origin);
    }
    await env.CATALOG.prepare(`UPDATE ${table} SET ${columns.map((key) => `${key} = ?`).join(",")} WHERE id = ?`).bind(...columns.map((key) => values[key]), idOrSlug).run();
    const row = await env.CATALOG.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(idOrSlug).first<any>();
    return send(table === "products" ? product(row) : row, 200, origin);
  },
};
