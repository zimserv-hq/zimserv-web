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

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function formatDate(date: string | null): string {
  if (!date) return new Date().toISOString().split("T")[0];
  return new Date(date).toISOString().split("T")[0];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
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

// ─────────────────────────────────────────────────────────────
// Main Generator
// ─────────────────────────────────────────────────────────────

async function generateSitemap() {
  console.log("🗺️  Generating sitemap...");

  const today = new Date().toISOString().split("T")[0];

  // ── Static pages ────────────────────────────────────────────
  const staticUrls = [
    buildUrl(`${SITE_URL}/`,                today, "weekly",  "1.0"),
    buildUrl(`${SITE_URL}/providers`,       today, "daily",   "0.9"),
    buildUrl(`${SITE_URL}/categories`,      today, "weekly",  "0.9"),
    buildUrl(`${SITE_URL}/become-provider`, today, "monthly", "0.6"),
  ];

  // ── Providers ───────────────────────────────────────────────
  const { data: providers, error: providersError } = await supabase
    .from("providers")
    .select("slug, updated_at")
    .eq("status", "active")
    .not("slug", "is", null);

  if (providersError) {
    console.error("❌ Providers fetch error:", providersError.message);
    process.exit(1);
  }

  console.log(`✅ Providers: ${providers.length}`);

  const providerUrls = providers.map((p: any) =>
    buildUrl(
      `${SITE_URL}/providers/${p.slug}`,
      formatDate(p.updated_at),
      "weekly",
      "0.8"
    )
  );

  // ── Category + City (REAL combinations only) ─────────────────
  const { data: combos, error: combosError } = await supabase
    .from("providers")
    .select("primary_category, city, updated_at")
    .eq("status", "active");

  if (combosError) {
    console.error("❌ Combos fetch error:", combosError.message);
    process.exit(1);
  }

  const seen = new Set<string>();
  const categoryUrls: string[] = [];

  for (const p of combos as any[]) {
    const catSlug = slugify(p.primary_category || "");
    const citySlug = slugify(p.city || "");

    if (!catSlug || !citySlug) continue;

    // ── Category page (/services/plumbing)
    if (!seen.has(catSlug)) {
      seen.add(catSlug);
      categoryUrls.push(
        buildUrl(
          `${SITE_URL}/services/${catSlug}`,
          today,
          "daily",
          "0.85"
        )
      );
    }

    // ── Category + City page (/services/plumbing/harare)
    const key = `${catSlug}::${citySlug}`;

    if (!seen.has(key)) {
      seen.add(key);
      categoryUrls.push(
        buildUrl(
          `${SITE_URL}/services/${catSlug}/${citySlug}`,
          formatDate(p.updated_at),
          "daily",
          "0.9"
        )
      );
    }
  }

  // ── XML Assembly ────────────────────────────────────────────
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

  // ── Write file ──────────────────────────────────────────────
  const outputPath = path.resolve(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(outputPath, xml, "utf-8");

  const total = staticUrls.length + categoryUrls.length + providerUrls.length;

  console.log(`✅ Sitemap generated at: ${outputPath}`);
  console.log(`📊 Total URLs: ${total}`);
  console.log(`   - Static:    ${staticUrls.length}`);
  console.log(`   - Services:  ${categoryUrls.length}`);
  console.log(`   - Providers: ${providerUrls.length}`);
}

// ─────────────────────────────────────────────────────────────

generateSitemap().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});