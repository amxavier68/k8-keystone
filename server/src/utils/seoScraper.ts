import axios from "axios";
import * as cheerio from "cheerio";

interface IScrapeSuccess {
  status: "success";
  title?: string;
  metaDescription?: string;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  links: { internal: number; external: number };
  wordCount: number;
  fetch: { usedHttpFallback?: boolean };
}

interface IScrapeFail {
  status: "failed";
  message: string;
}

export type IScrapeResult = IScrapeSuccess | IScrapeFail;

/**
 * ✅ Fetches and parses SEO data from a given URL.
 * Automatically retries with HTTP if HTTPS fails.
 */
export async function seoScraper(inputUrl: string): Promise<IScrapeResult> {
  try {
    if (!inputUrl) {
      return {
        status: "failed",
        message: "No URL provided. Please enter a valid domain or webpage URL.",
      };
    }

    let normalizedUrl = inputUrl.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const fetchWithFallback = async (url: string): Promise<{ html: string; usedHttpFallback: boolean }> => {
      try {
        const { data } = await axios.get(url, {
          headers: { "User-Agent": "Kollabor8-SEO-Scraper/1.0" },
          timeout: 10000,
        });
        return { html: data, usedHttpFallback: false };
      } catch (err) {
        // Retry with HTTP if HTTPS fails
        if (url.startsWith("https://")) {
          const httpUrl = url.replace(/^https:\/\//, "http://");
          console.warn(`⚠️ HTTPS failed, retrying with HTTP: ${httpUrl}`);
          const { data } = await axios.get(httpUrl, {
            headers: { "User-Agent": "Kollabor8-SEO-Scraper/1.0" },
            timeout: 10000,
          });
          return { html: data, usedHttpFallback: true };
        }
        throw new Error(`❌ The domain '${url}' could not be reached. It may not exist or its DNS is misconfigured.`);
      }
    };

    const { html, usedHttpFallback } = await fetchWithFallback(normalizedUrl);
    const $ = cheerio.load(html);

    // Extract SEO data
    const title = $("title").first().text().trim() || "";
    const metaDescription = $('meta[name="description"]').attr("content")?.trim() || "";
    const h1 = $("h1").map((_, el) => $(el).text().trim()).get();
    const h2 = $("h2").map((_, el) => $(el).text().trim()).get();
    const h3 = $("h3").map((_, el) => $(el).text().trim()).get();

  const internalLinks = $("a[href]").filter((_, el) => {
      const href = $(el).attr("href") ?? "";
      if (!href) return false;
      const hostname = new URL(normalizedUrl).hostname;
      return href.startsWith("/") || href.includes(hostname);
    }).length;

    const externalLinks = $("a[href]").filter((_, el) => {
      const href = $(el).attr("href") ?? "";
      if (!href) return false;
      const hostname = new URL(normalizedUrl).hostname;
      return href.startsWith("http") && !href.includes(hostname);
    }).length;

    const textContent = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = textContent.split(" ").filter(Boolean).length;

    return {
      status: "success",
      title,
      metaDescription,
      headings: { h1, h2, h3 },
      links: { internal: internalLinks, external: externalLinks },
      wordCount,
      fetch: { usedHttpFallback },
    };
  } catch (error: any) {
    const msg =
      error.message?.includes("ENOTFOUND") || error.message?.includes("DNS")
        ? "Domain not found. Please verify the website address."
        : error.message?.includes("timeout")
        ? "The request timed out. The website may be slow or offline."
        : error.message?.includes("SSL")
        ? "SSL error detected. The website’s HTTPS certificate may be invalid."
        : error.message || "An unknown error occurred while scraping.";

    return {
      status: "failed",
      message: msg,
    };
  }
}
