import { Config } from "../../src/config";

const config: Config = {
  id: "4b73d25bf964a520e8bc2de3",
  name: "自由が丘 スイーツフォレスト",
  subvenues: [],
  linker: {
    ignore: [],
  },
  scraper: [
    {
      url: "http://www.sweets-forest.com/shop.html",
      venues: {
        ".shop_list li": {
          name: { selector: "img", property: "alt" },
          url: { selector: "a", property: "href", nullable: true },
          bldg: "スイーツの森ゾーン",
        },
      },
    },
    {
      url: "http://www.sweets-forest.com/sweets_select.html",
      venues: {
        "#sweers_select h3[id], #sweers_select div[id]": {
          name: { selector: "img", property: "alt" },
          url: { selector: "a", property: "href", nullable: true },
          bldg: "スイーツセレクトゾーン",
        },
      },
    },
  ],
};

export = config;
