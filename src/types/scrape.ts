export type ScrapeSetting = { [x: string]: ScrapeOption };

export type ScrapeOption = {
  type: "string" | "number";
  required?: true;
};

export type _ScrapedProperties<T extends ScrapeSetting> = { [key in keyof T]: InferredOptionType<T[key]> };

type InferredOptionType<T extends ScrapeOption> = T extends { required: true }
  ? RequiredOptionType<T>
  : RequiredOptionType<T> | undefined;

type RequiredOptionType<T extends ScrapeOption> = T extends { type: "string" }
  ? string
  : T extends { type: "number" }
  ? number
  : never;
