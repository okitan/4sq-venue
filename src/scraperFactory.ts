import { LtsvRecord } from "ltsv";

import { _ScrapedProperties, ScrapeSetting } from "./types/scrape";

export function create<T extends ScrapeSetting, U extends _ScrapedProperties<T>>(setting: T) {
  return {
    config: setting,
    parse: (record: LtsvRecord | U) => {
      return Object.entries(setting).reduce((result, [key, option]) => {
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
