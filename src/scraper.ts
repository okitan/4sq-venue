import { create } from "./scraperFactory";

export const { config, parse, format } = create({
  name: { type: "string", required: true },
  altName: { type: "string" },
  bldg: { type: "string" },
  level: { type: "number" },
  phone: { type: "string" },
  url: { type: "string" },
});

export type ScrapedProperties = ReturnType<typeof parse>;
