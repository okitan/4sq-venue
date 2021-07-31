import { Config } from "../../src/types/config";

const config: Config = {
  id: "4b6b4de3f964a52089ff2be3",
  name: "しぶちか SHIBUCHIKA",
  subvenues: [],
  linker: {
    ignore: [],
  },
  scraper: [
    {
      url: "https://shibuchika.jp/",
      venues: {
        "table tr td:nth-of-type(2)": {
          name: { xpath: "." },
          // TODO: if domain is shibuchika scarpe detail pages
          url: { selector: "a", property: "href", nullable: true },
        },
      },
    },
  ],
};

export = config;
