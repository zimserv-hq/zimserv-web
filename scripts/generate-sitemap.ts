// scripts/generate-sitemap.ts
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const SITE_URL = "https://www.zimserv.co.zw";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

function formatDate(date: string | null): string {
  if (!date) return new Date().toISOString().split("T")[0];
  return new Date(date).toISOString().split("T")[0];
}

function buildUrl(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string
): string {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generateSitemap() {
  console.log("🗺️  Generating sitemap...");

  const today = new Date().toISOString().split("T")[0];

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticUrls = [
    buildUrl(`${SITE_URL}/`,                  today, "weekly",  "1.0"),
    buildUrl(`${SITE_URL}/providers`,         today, "daily",   "0.9"),
    buildUrl(`${SITE_URL}/categories`,        today, "weekly",  "0.8"),
    buildUrl(`${SITE_URL}/become-provider`,   today, "monthly", "0.7"),
  ];

  // ── Provider pages ────────────────────────────────────────────────────────
  const { data: providers, error: providersError } = await supabase
    .from("providers")
    .select("slug, updated_at")
    .eq("status", "active")
    .not("slug", "is", null);

  if (providersError) {
    console.error("❌ Error fetching providers:", providersError.message);
    process.exit(1);
  }

  console.log(`✅ Found ${providers.length} active providers`);

  const providerUrls = providers.map((p: { slug: string; updated_at: string }) =>
    buildUrl(
      `${SITE_URL}/providers/${p.slug}`,
      formatDate(p.updated_at),
      "weekly",
      "0.8"
    )
  );

  // ── Category pages ────────────────────────────────────────────────────────
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("name, updated_at")
    .eq("status", "Active");

  if (categoriesError) {
    console.error("❌ Error fetching categories:", categoriesError.message);
    process.exit(1);
  }

  console.log(`✅ Found ${categories.length} active categories`);

  const categoryUrls = categories.map((c: { name: string; updated_at: string }) =>
    buildUrl(
      `${SITE_URL}/providers?category=${encodeURIComponent(c.name)}`,
      formatDate(c.updated_at),
      "weekly",
      "0.7"
    )
  );

  // ── Assemble XML ──────────────────────────────────────────────────────────
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticUrls.join("")}
${categoryUrls.join("")}
${providerUrls.join("")}
</urlset>`;

  // ── Write to /public ──────────────────────────────────────────────────────
  const outputPath = path.resolve(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(outputPath, xml, "utf-8");

  const totalUrls = staticUrls.length + categoryUrls.length + providerUrls.length;
  console.log(`✅ Sitemap generated: ${outputPath}`);
  console.log(`📊 Total URLs: ${totalUrls}`);
  console.log(`   - Static pages: ${staticUrls.length}`);
  console.log(`   - Category pages: ${categoryUrls.length}`);
  console.log(`   - Provider pages: ${providerUrls.length}`);
}

generateSitemap().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
