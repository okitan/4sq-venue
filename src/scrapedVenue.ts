import { LtsvRecord } from "ltsv/dist/cjs";

import { parse, ScrapedProperties } from "./scraper";

export class ScrapedVenue implements ScrapedProperties {
  name: string;
  altName: string | undefined;
  bldg: string | undefined;
  level: number | undefined;
  phone: string | undefined;
  url: string | undefined;

  constructor({ name, altName, bldg, level, phone, url }: ScrapedProperties) {
    this.name = name;
    this.altName = altName;
    this.bldg = bldg;
    this.level = level ? Number(level) : level; // force number
    this.phone = phone;
    this.url = url;
  }

  static get keys(): ReadonlyArray<keyof ScrapedProperties> {
    return ["name", "altName", "bldg", "level", "phone", "url"];
  }

  // TOOD: FIXME: return undefined instead of object
  static parse(obj: LtsvRecord): ScrapedVenue | {} {
    if (!obj) return {};

    const venue = parse(obj);

    return Object.keys(venue).length > 0 ? new ScrapedVenue(venue) : {};
  }

  format({ cascade = false }: { cascade?: boolean } = {}): LtsvRecord {
    return ScrapedVenue.keys.reduce((result, key) => {
      if (cascade) {
        result[`scraped.${key}`] = this[key]?.toString() ?? "";
      } else {
        result[key] = this[key]?.toString() ?? "";
      }
      return result;
    }, {} as LtsvRecord);
  }
}
