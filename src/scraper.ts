import puppeteer, { type ElementHandle } from "puppeteer";

import { phoneExtractor } from "./modifier";
import type { ScrapeConfig, ScrapePropertiesConfig, Selector } from "./types/config";

// name is mandatory
export const stringProperties = ["altName", "bldg", "phone", "url"] as const;
export const numberProperties = ["level"] as const;

type Unpacked<T> = T extends { [K in keyof T]: infer U } ? U : never;
export type ScrapedProperties = {
  name: string;
} & {
  [x in Unpacked<typeof stringProperties>]?: string;
} & {
  [y in Unpacked<typeof numberProperties>]?: number;
};

export async function scrape({
  url,
  options,
  venues,
  notify,
}: ScrapeConfig & { notify: (message: string) => void }): Promise<ScrapedProperties[]> {
  const results: ScrapedProperties[] = [];

  const browser = await puppeteer.launch({
    headless: process.env.NO_HEADLESS ? false : "shell",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--lang=ja-JP"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, options);

    for (const [selector, { followLink, skip, ...properties }] of Object.entries(venues)) {
      const items = await page.$$(selector);

      if (items.length === 0) throw new Error(`no venues found for ${selector}`);

      for (const item of items) {
        // check skip
        if (skip && (await skip(item))) continue;

        if (followLink) {
          const subVenueUrl = await applySelector(item, followLink);
          if (!subVenueUrl) throw new Error(`no sub venue found for ${JSON.stringify(followLink)}`);

          if (notify) notify(`Scraping subvenue ${subVenueUrl}`);

          const newPage = await browser.newPage();
          try {
            await newPage.goto(subVenueUrl, options);
            const body = await newPage.$("body");
            if (!body) throw new Error("no body found");

            const result = await scrapeVenue(body, properties);
            result.url = subVenueUrl;

            results.push(result);
          } catch (err) {
            if (err instanceof Error) {
              throw new Error(`on scraping ${subVenueUrl}: ${err.message}`);
            } else {
              throw err;
            }
          } finally {
            await newPage.close();
          }
        } else {
          results.push(await scrapeVenue(item, properties));
        }
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

async function scrapeVenue(page: ElementHandle, properties: ScrapePropertiesConfig) {
  const results = await scrapeProperties(page, properties);

  if (results["phone"]) {
    results["phone"] = phoneExtractor(results["phone"]);
  }

  return results;
}

async function scrapeProperties(
  page: ElementHandle,
  config: ScrapePropertiesConfig<ScrapedProperties>,
): Promise<ScrapedProperties> {
  // name
  const value = await applySelector(page, config.name);
  if (!value) throw new Error("name not found"); // TODO: more info
  const normalizedValue = normalizeString(value);
  const modifiedValue = config.name.modifier ? config.name.modifier(normalizedValue) : normalizedValue;
  if (!modifiedValue) throw new Error("name not determined"); // TODO: more info

  const result: ScrapedProperties = { name: modifiedValue };

  for (const property of stringProperties) {
    const propertyConfig = config[property];
    if (!propertyConfig) continue;

    if (typeof propertyConfig === "string") {
      result[property] = propertyConfig;
      continue;
    }

    const value = await applySelector(page, propertyConfig);
    if (value) {
      const normalizedValue = normalizeString(value);

      result[property] = propertyConfig.modifier ? propertyConfig.modifier(normalizedValue) : normalizedValue;
    }
  }

  // number properties
  for (const property of numberProperties) {
    const propertyConfig = config[property];
    if (!propertyConfig) continue;

    if (typeof propertyConfig === "number") {
      result[property] = propertyConfig;
      continue;
    }

    const value = await applySelector(page, propertyConfig);
    if (value) {
      result[property] = propertyConfig.modifier ? propertyConfig.modifier(value) : parseInt(value);
    }
  }

  return result;
}

export async function applySelector<T extends string | number>(
  page: ElementHandle,
  config: Selector<T>,
): Promise<string | undefined> {
  const element = await page.$(config.selector);

  if (!element) {
    if (config.nullable) {
      return;
    } else {
      throw new Error(`unable to fetch ${JSON.stringify(config)} on ${await page.evaluate((el) => el.outerHTML)}`);
    }
  }

  return (await (await element.getProperty(config.property || "textContent"))?.jsonValue()) as string;
}

function normalizeString(str: string): string {
  return str
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 65248))
    .replace(/\s/g, " ") // node includes 全角スペース to \s
    .replace(/ +/g, " ")
    .trim();
}
