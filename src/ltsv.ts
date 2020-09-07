import { LtsvRecord } from "ltsv";

import { numberProperties, ScrapedProperties, stringProperties } from "./scraper";

export function parse(record: LtsvRecord): ScrapedProperties | undefined {
  const name = record.name || record[`scraped.name`];
  const result: ScrapedProperties = { name };

  stringProperties.forEach((property) => {
    if (record[property]) result[property] = record[property];

    const scrapedProperty = record[`scrped.${property}`];
    if (scrapedProperty && typeof scrapedProperty === "string") result[property] = scrapedProperty;
  });

  numberProperties.forEach((property) => {
    if (record[property]) result[property] = parseInt(record[property]);

    const scrapedProperty = record[`scrped.${property}`];
    if (scrapedProperty) result[property] = parseInt(scrapedProperty);
  });

  return Object.keys(result).length ? result : undefined;
}

export function format(obj: ScrapedProperties, { cascade = false }: { cascade?: boolean } = {}): LtsvRecord {
  return (["name", "altName", "bldg", "level", "phone", "url"] as const).reduce((result: LtsvRecord, key) => {
    result[cascade ? `scraped.${key}` : key] = obj[key]?.toString() || "";

    return result;
  }, {});
}
