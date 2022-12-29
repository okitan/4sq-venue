import { Config } from "../../src/types/config";

const config: Config = {
  id: "4b6a8e4ff964a5208ad82be3",
  name: "自由が丘 ひかり街",
  subvenues: [],
  linker: {
    ignore: ["自由が丘", "ひかり街"],
  },
  scraper: [
    {
      url: "https://www.hikarigai.com/shoplist/",
      venues: {
        ".article-wrap article": {
          followLink: { selector: "a", property: "href" },
          name: { selector: "h1" },
          altName: { xpath: "//div[h4][1]/h4" },
          phone: {
            xpath: "//div[h4][1]/p/text()[contains(., 'TEL')]/..",
            modifier: (txt) =>
              txt
                .split("\n")
                .find((txt) => txt.includes("TEL"))
                ?.split("：")[1],
            nullable: true,
          },
          level: 1,
        },
        ".grid_6:not(.last) p": {
          name: { xpath: ".", modifier: (str) => str.split("（")[0].slice(1) },
          phone: {
            xpath: ".",
            modifier: (str) => {
              const matched = str.match(/\d{2,3}-\d{4}-\d{4}/);
              return matched ? matched[0] : "";
            },
            nullable: true,
          },
          level: 2,
          // really fucking dom
          skip: async (item) => {
            const value = (await (await (await item.$("xpath/."))!.getProperty("textContent")).jsonValue())!.trim();
            return value === "" || !!value.match(/^\d{2,3}-\d{4}-\d{4}$/);
          },
        },
        ".grid_6.last p": {
          name: { xpath: ".", modifier: (str) => str.split("（")[0].slice(1) },
          phone: {
            xpath: ".",
            modifier: (str) => {
              const matched = str.match(/\d{2,3}-\d{4}-\d{4}/);
              return matched ? matched[0] : "";
            },
            nullable: true,
          },
          level: 3,
          // really fucking dom
          skip: async (item) => {
            const value = (await (await (await item.$("xpath/."))!.getProperty("textContent")).jsonValue())!.trim();
            return value === "" || !!value.match(/^\d{2,3}-\d{4}-\d{4}$/);
          },
        },
      },
    },
  ],
};

export = config;
