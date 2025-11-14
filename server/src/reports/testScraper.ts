import { seoScraper } from "../utils/seoScraper.ts"; // ✅ TS-compatible import (no .js)

const url = process.argv[2];

if (!url) {
  console.error("❌ Please provide a business URL.\nExample: pnpm ts-node --esm server/src/reports/testScraper.ts https://clientsite.com");
  process.exit(1);
}

(async () => {
  console.log(`🔍 Scraping SEO data from: ${url} ...\n`);
  const result = await seoScraper(url);
  console.log(JSON.stringify(result, null, 2));
})();
