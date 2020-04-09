import { LtsvRecord } from "ltsv";
import puppeteer from "puppeteer";

import { ScrapedPropertiesConfig, Selector } from "./types/config";
import { _ScrapedProperties, ScrapeSetting } from "./types/scrape";

export function create<T extends ScrapeSetting, U extends _ScrapedProperties<T>>(setting: T) {
  return {
    config: setting,
    scrape: async (page: puppeteer.Page | puppeteer.ElementHandle, config: ScrapedPropertiesConfig<U>): Promise<U> => {
      const result = {} as U;

      for (const [key, option] of Object.entries(setting)) {
        if (option.type === "string") {
          const propertyConfig = config[key] as Selector<string> | string | undefined;
          if (!propertyConfig) continue;

          if (typeof propertyConfig === "string") {
            (result[key] as string) = propertyConfig;
            continue;
          }

          const value = await applySelector(page, propertyConfig);
          if (value) {
            const normalizedValue = value
              .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 65248))
              .replace(/\s/g, " ") // node includes 全角スペース to \s
              .replace(/ +/g, " ")
              .trim();

            (result[key] as string | undefined) = propertyConfig.modifier
              ? propertyConfig.modifier(normalizedValue)
              : normalizedValue;
          }
        }

        if (option.type === "number") {
          const propertyConfig = config[key] as Selector<number> | number | undefined;
          if (!propertyConfig) continue;

          if (typeof propertyConfig === "number") {
            (result[key] as number) = propertyConfig;
            continue;
          }

          const value = await applySelector(page, propertyConfig);
          if (value) {
            (result[key] as number | undefined) = propertyConfig.modifier
              ? propertyConfig.modifier(value)
              : parseInt(value);
          }
        }
      }

      return result;
    },
    parse: (record: LtsvRecord | U) => {
      const result = Object.entries(setting).reduce((result, [key, option]) => {
        if (option.type === "string") {
          if (record[key]) (result[key] as string) = record[key] as string;
          if (record[`scraped.${key}`]) (result[key] as string) = record[`scraped.${key}`] as string;
        }
        if (option.type === "number") {
          if (record[key]) (result[key] as number) = parseInt(record[key] as string);
          if (record[`scraped.${key}`]) (result[key] as number) = parseInt(record[`scraped.${key}`] as string);
        }

        return result;
      }, {} as U);

      return Object.keys(result).length ? result : undefined;
    },
    format: (obj: U, { cascade = false }: { cascade?: boolean } = {}): LtsvRecord => {
      return Object.keys(setting).reduce((result, key: keyof U) => {
        // FIXME: obj[key] could be resolved by possible RequiredOptionType
        if (cascade) {
          result[`scraped.${key}`] = (obj[key] as string | number | undefined)?.toString() ?? "";
        } else {
          result[`${key}`] = (obj[key] as string | number | undefined)?.toString() ?? "";
        }
        return result;
      }, {} as LtsvRecord);
    },
  };
}

export async function applySelector<T extends string | number>(
  page: puppeteer.Page | puppeteer.ElementHandle,
  config: Selector<T>
): Promise<string | undefined> {
  const element: puppeteer.ElementHandle | null =
    "xpath" in config ? (await page.$x(config.xpath))[0] : await page.$(config.selector);

  if (!element) {
    if (config.nullable) {
      return undefined;
    } else {
      throw `unable to fetch ${config}`;
    }
  }

  return (await (await element.getProperty(config.property || "innerText")).jsonValue()) as string;
}
