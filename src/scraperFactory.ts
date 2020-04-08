import { LtsvRecord } from "ltsv";

import { _ScrapedProperties, ScrapeSetting } from "./types/scrape";

export function create<T extends ScrapeSetting, U extends _ScrapedProperties<T>>(
  setting: T
): [T, (record: LtsvRecord) => U] {
  return [
    setting,
    // parser
    (record: LtsvRecord) => {
      return Object.entries(setting).reduce((result, [key, option]) => {
        if (option.type === "string") {
          // @ts-ignore
          if (record[key]) result[key] = record[key];
          // @ts-ignore
          if (record[`scraped.${key}`]) result[key] = record[`scraped.${key}`];
        }
        if (option.type === "number") {
          // @ts-ignore
          if (record[key]) result[key] = parseInt(record[key]);
          // @ts-ignore
          if (record[`scraped.${key}`]) result[key] = parseInt(record[`scraped.${key}`]);
        }

        return result;
      }, {} as U);
    },
  ];
}
