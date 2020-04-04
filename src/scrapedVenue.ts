type Key = "name" | "altName" | "bldg" | "level" | "phone" | "url";

export class ScrapedVenue {
  name: string;
  altName?: string;
  bldg?: string;
  level?: number;
  phone?: string;
  url?: string;

  constructor({ name, altName, bldg, level, phone, url }: Pick<ScrapedVenue, Key>) {
    this.name = name;
    this.altName = altName;
    this.bldg = bldg;
    this.level = level;
    this.phone = phone;
    this.url = url;
  }

  static keys(): Key[] {
    return ["name", "altName", "bldg", "level", "phone", "url"];
  }

  // TOOD: FIXME: return undefined instead of object
  static create(obj: { [x: string]: ScrapedVenue[Key] }): ScrapedVenue | {} {
    if (!obj) return {};

    const venue = this.keys().reduce((result, e) => {
      // because `""` is falsy in javascript `hoge:` is converted to `{ hoge: undefined }`
      // Note: `0` is also converted to undefined, but I just have `level` as number and there are no level:0
      if (obj[e]) {
        // @ts-ignore result[e] = does not work
        result[e] = obj[e];
      } else if (obj[`scraped.${e}`]) {
        // @ts-ignore result[e] = does not work
        result[e] = obj[`scraped.${e}`];
      }

      return result;
    }, {} as { [x in Key]: ScrapedVenue[x] });

    // FIXME: do not do like this
    if (Object.keys(venue).length === 0) return {};

    return new ScrapedVenue(venue);
  }

  format(cascade: boolean = false): { [x: string]: Exclude<ScrapedVenue[Key], undefined> } {
    return ScrapedVenue.keys().reduce((result, key) => {
      if (cascade) {
        result[`scraped.${key}`] = this[key] ?? "";
      } else {
        result[key] = this[key] ?? "";
      }
      return result;
    }, {} as { [x: string]: Exclude<ScrapedVenue[Key], undefined> });
  }
}
