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
      url: "https://www.hikarigai.com/shoplist/",
      venues: {
        "article#post-83 .themeblvd-gallery .entry-content": {
          followLink: { selector: "a", property: "href" },
          name: { selector: "h1" },
          altName: { selector: "h4:nth-child(1)" },
          phone: {
            selector: "h4:nth-child(1) + p",
            modifier: (txt) =>
              txt
                .split("\n")
                .find((txt) => txt.includes("TEL"))
                ?.split("：")[1],
          },
          level: 1,
        },
        // 1, 2 is missing 3 is LV1 4 is LV2 5 is LV3
        "article#post-83 > .entry-content > div:nth-child(4) li": {
          name: { xpath: "." },
          phone: { xpath: "./following-sibling::p[1]" },
          level: 2,
        },
        "article#post-83 > .entry-content > div:nth-child(5) li": {
          name: { xpath: "." },
          phone: { xpath: "./following-sibling::p[1]" },
          level: 3,
        },
      },
    },
  ],
};

export = config;
