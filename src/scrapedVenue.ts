import { LtsvRecord } from "ltsv/dist/cjs";

export type ScrapeProperties = {
  name: string;
  altName?: string;
  bldg?: string;
  level?: number;
  phone?: string;
  url?: string;
};

export class ScrapedVenue implements ScrapeProperties {
  name: string;
  altName?: string;
  bldg?: string;
  level?: number;
  phone?: string;
  url?: string;

  constructor({ name, altName, bldg, level, phone, url }: ScrapeProperties) {
    this.name = name;
    this.altName = altName;
    this.bldg = bldg;
    this.level = level ? Number(level) : level; // force number
    this.phone = phone;
    this.url = url;
  }

  static get keys(): ReadonlyArray<keyof ScrapeProperties> {
    return ["name", "altName", "bldg", "level", "phone", "url"];
  }

  static get stringKeys(): ReadonlyArray<
    { [key in keyof ScrapeProperties]-?: string extends ScrapeProperties[key] ? key : never }[keyof ScrapeProperties]
  > {
    return ["name", "altName", "bldg", "phone", "url"];
  }

  static get numberKeys(): ReadonlyArray<
    { [key in keyof ScrapeProperties]-?: number extends ScrapeProperties[key] ? key : never }[keyof ScrapeProperties]
  > {
    return ["level"];
  }

  // TOOD: FIXME: return undefined instead of object
  static parse(obj: LtsvRecord): ScrapedVenue | {} {
    if (!obj) return {};

    const venue = {} as ScrapeProperties;

    this.stringKeys.forEach((key) => {
      // because `""` is falsy in javascript `hoge:` is converted to `{ hoge: undefined }`
      if (obj[`scraped.${key}`]) venue[key] = obj[`scraped.${key}`];
    });
    this.numberKeys.forEach((key) => {
      if (obj[`scraped.${key}`]) venue[key] = parseInt(obj[`scraped.${key}`]);
    });

    // FIXME: do not do like this
    if (Object.keys(venue).length === 0) return {};

    return new ScrapedVenue(venue);
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
