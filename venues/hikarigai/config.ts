import { Config } from "../../src/types/config";

const config: Config = {
  id: "4b6a8e4ff964a5208ad82be3",
  name: "自由が丘 ひかり街",
  subvenues: [],
  linker: {
    ignore: [],
  },
  scraper: [
    {
      url: "URL",
      venues: {
        SELECTOR: {
          name: { selector: "SELECTOR" },
          altName: { selector: "SELECTOR" },
          phone: { selector: "SELECTOR" },
          level: { selector: "SELECTOR" },
        },
      },
    },
  ],
};

export = config;
