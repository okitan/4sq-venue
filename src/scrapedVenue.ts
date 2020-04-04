import { LtsvRecord } from "ltsv/dist/cjs";

export type Properties = {
  name: string;
  altName?: string;
  bldg?: string;
  level?: number;
  phone?: string;
  url?: string;
};

export class ScrapedVenue implements Properties {
  name: string;
  altName?: string;
  bldg?: string;
  level?: number;
  phone?: string;
  url?: string;

  constructor({ name, altName, bldg, level, phone, url }: Properties) {
    this.name = name;
    this.altName = altName;
    this.bldg = bldg;
    this.level = level;
    this.phone = phone;
    this.url = url;
  }

  static keys(): (keyof Properties)[] {
    return ["name", "altName", "bldg", "level", "phone", "url"];
  }

  // TOOD: FIXME: return undefined instead of object
  static parse(obj: LtsvRecord): ScrapedVenue | {} {
    if (!obj) return {};

    const venue = this.keys().reduce((result, e) => {
      // because `""` is falsy in javascript `hoge:` is converted to `{ hoge: undefined }`
      // Note: `0` is also converted to undefined, but I only have `level` as number and there are no level:0 in my world
      if (obj[`scraped.${e}`]) {
        const value: string = obj[`scraped.${e}`];
        // @ts-ignore result[e] = does not work
        result[e] = typeof result[e] === "number" ? parseInt(value) : value;
      }
      return result;
    }, {} as Properties);

    // FIXME: do not do like this
    if (Object.keys(venue).length === 0) return {};

    return new ScrapedVenue(venue);
  }

  format({ cascade = false }: { cascade?: boolean } = { cascade: false }): LtsvRecord {
    return ScrapedVenue.keys().reduce((result, key) => {
      if (cascade) {
        result[`scraped.${key}`] = this[key]?.toString() ?? "";
      } else {
        result[key] = this[key]?.toString() ?? "";
      }
      return result;
    }, {} as LtsvRecord);
  }
}
