import { Config } from "../../src/types/config";

const config: Config = {
  id: "4b73d25bf964a520e8bc2de3",
  name: "自由が丘 スイーツフォレスト",
  subvenues: [],
  linker: {
    ignore: [],
  },
  scraper: [
    {
      url: "https://sweets-forest.cake.jp/",
      venues: {
        "li.has-child li": {
          followLink: { selector: "a", property: "href" },
          name: { selector: ".store-intro__content__left h2", modifier: (e) => e.split("(")[0] },
          altName: {
            selector: ".store-intro__content__left h2 span",
            modifier: (e) => e.split("(")[1].slice(0, -1), // omit )
          },
          level: 2,
        },
      },
    },
  ],
};

export = config;
