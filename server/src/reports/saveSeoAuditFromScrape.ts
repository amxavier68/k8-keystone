import crypto from "crypto";
import { connect } from "mongoose";
import { DomainModel, SeoAuditModel } from "../models/index.ts";
import { seoScraper } from "../utils/seoScraper.js";

interface IScrapeSuccess {
  status: "success";
  title?: string;
  metaDescription?: string;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  links: { internal: number; external: number };
  wordCount: number;
  fetch?: { usedHttpFallback?: boolean };
}

interface IScrapeFail {
  status: "failed";
  message: string;
}

type IScrapeResult = IScrapeSuccess | IScrapeFail | null;

/**
 * Generates a SHA256 content hash for version tracking.
 */
function hashContent(parts: string[]): string {
  return crypto.createHash("sha256").update(parts.join("|")).digest("hex");
}

/**
 * Runs a scrape and saves the resulting audit to MongoDB.
 * If the domain doesn't exist yet, it's automatically created.
 */
export async function saveSeoAuditFromScrape(domainName: string, url?: string) {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/kollabor8_seo";
  await connect(mongoUri);
  console.log("✅ Connected to MongoDB.");

  // 🎯 Normalize domain + URL
  const hostname = domainName.toLowerCase().trim();
  const targetUrl = url || `https://${hostname}`;

  // 🧠 Ensure domain record exists
  let domain = await DomainModel.findOne({ hostname });
  if (!domain) {
    domain = await DomainModel.create({
      hostname,
      client: null,
      status: "active",
    });
    console.log(`🌐 Created new domain record for ${hostname}`);
  }

  // 🕸 Run SEO scrape
  console.log(`🔍 Scraping ${targetUrl} ...`);
  const result: IScrapeResult = await seoScraper(targetUrl);

  // 🧩 Handle failed scrapes gracefully
  if (!result || result.status === "failed") {
    const msg = result?.message || "Scrape failed or returned no data.";
    console.warn(`⚠️ Scrape failed for ${targetUrl}: ${msg}`);

    await SeoAuditModel.create({
      domain: domain._id,
      url: targetUrl,
      fetch: { error: msg },
      status: "error",
      summary: msg,
    });
    return null;
  }

  // 🧾 Build audit record
  const contentHash = hashContent([
    result.title || "",
    result.metaDescription || "",
    result.headings.h1.join(","),
    result.headings.h2.join(","),
    result.headings.h3.join(","),
    String(result.wordCount),
    String(result.links.internal),
    String(result.links.external),
  ]);

  // Basic, inferential issue generation (expand via IssueCatalog later)
  const issues = [];
  if (!result.metaDescription || result.metaDescription.length < 60) {
    issues.push({
      issueCode: "META_DESCRIPTION_WEAK_OR_MISSING",
      severity: "medium",
      message: "Meta description missing or too short.",
    });
  }
  if (!result.headings.h1?.length) {
    issues.push({
      issueCode: "H1_MISSING",
      severity: "high",
      message: "Missing <h1> tag — each page needs one primary heading.",
    });
  }

  // 🧠 Compute basic scores (baseline heuristics)
  const scores = {
    contentDepth: Math.min(100, Math.floor((result.wordCount / 800) * 100)),
    structure: Math.min(100, (result.headings.h2.length + result.headings.h3.length) > 0 ? 70 : 30),
    technical: 80,
    accessibility: 60,
  };

  // 🗂 Save to database
  const audit = await SeoAuditModel.create({
    domain: domain._id,
    url: targetUrl,
    fetch: { usedHttpFallback: result.fetch?.usedHttpFallback },
    title: result.title,
    metaDescription: result.metaDescription,
    headings: result.headings,
    links: result.links,
    wordCount: result.wordCount,
    contentHash,
    issues,
    scores,
    status: "success",
    summary: `Scanned ${targetUrl}. Found ${issues.length} structural opportunities.`,
  });

  await DomainModel.findByIdAndUpdate(domain._id, { lastAuditAt: new Date() });

  console.log(`✅ Saved SEO audit for ${targetUrl}`);
  return audit;
}

// Example CLI trigger
if (process.argv[2]) {
  const domain = process.argv[2];
  saveSeoAuditFromScrape(domain)
    .then(() => {
      console.log("🎉 Audit complete.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("💥 Error:", err.message);
      process.exit(1);
    });
}
