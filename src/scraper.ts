import puppeteer from "puppeteer";

import { phoneExtractor } from "./modifier";
import { applySelector, create } from "./scraperFactory";
import { ScrapeConfig, ScrapePropertiesConfig } from "./types/config";

export const { config, scrape: scrapeProperties, parse, format } = create({
  name: { type: "string", required: true },
  altName: { type: "string" },
  bldg: { type: "string" },
  level: { type: "number" },
  phone: { type: "string" },
  url: { type: "string" },
});

export type ScrapedProperties = Parameters<typeof format> extends [infer T, ...any[]] ? T : never;

export async function scrape({
  url,
  options,
  venues,
  notify,
}: ScrapeConfig & { notify: (message: string) => void }): Promise<ScrapedProperties[]> {
  const results: ScrapedProperties[] = [];

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: process.env.NO_HEADLESS ? false : true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--lang=ja-JP"],
    });

    const page = await browser.newPage();
    await page.goto(url, options);

    for (const [selector, { followLink, ...properties }] of Object.entries(venues)) {
      const items = await page.$$(selector);

      if (items.length === 0) throw `no venues found for ${selector}`;

      // console.error("\n", detail);
      for (const item of items) {
        if (followLink) {
          const subVenueUrl = await applySelector(item, followLink);
          if (!subVenueUrl) throw `no sub venue found for ${followLink}`;

          if (notify) notify(`Scraping subvenue ${subVenueUrl}`);

          let newPage;
          try {
            newPage = await browser.newPage();
            await newPage.goto(subVenueUrl, options);

            const result = await scrapeVenue(newPage, properties);
            result.url = subVenueUrl;

            results.push(result);
          } catch (err) {
            throw `on scraping ${subVenueUrl}: ${err.message}`;
          } finally {
            if (newPage) await newPage.close();
          }
        } else {
          results.push(await scrapeVenue(item, properties));
        }
      }
    }
  } finally {
    if (browser) await browser.close();
  }

  return results;
}

async function scrapeVenue(page: puppeteer.Page | puppeteer.ElementHandle, properties: ScrapePropertiesConfig) {
  const results = await scrapeProperties(page, properties);

  if (results["phone"]) {
    results["phone"] = phoneExtractor(results["phone"]);
  }

  return results;
}
