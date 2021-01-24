import { Config } from "../../src/config";
import { phoneExtractor } from "../../src/modifier";

const config: Config = {
  id: "5361cba0498e5839aa495469",
  name: "グランツリー武蔵小杉",
  subvenues: [{ id: "54a38f1b498ea176a18bd8ac", name: "グランツリー武蔵小杉-フードコート" }],
  linker: {
    ignore: ["グランツリー", "武蔵小杉", "ムサシコスギ"],
  },
  scraper: [
    {
      url: "https://grand-tree.jp/shop/",
      options: { waitUntil: "domcontentloaded" },
      venues: {
        "ul.shop-list-find-result-list li": {
          url: { selector: "a", property: "href" },
          name: { selector: ".shop-name", },
          phone: { selector: ".info", modifier: phoneExtractor },
          level: { selector: ".info", modifier: (text) => { 
            const matched = text.match(/(\d)F/);
            if (!matched) throw "no level found";
            return parseInt(matched[1]);
          } },
        },
      },
    },
  ],
};

export = config;
