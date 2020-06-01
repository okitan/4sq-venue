import { levelExtractor } from "../../src/modifier";
import { Config } from "../../src/types/config";

const config: Config = {
  id: "5361cba0498e5839aa495469",
  name: "グランツリー武蔵小杉",
  subvenues: [{ id: "54a38f1b498ea176a18bd8ac", name: "グランツリー武蔵小杉-フードコート" }],
  linker: {
    ignore: ["グランツリー", "武蔵小杉", "ムサシコスギ"],
  },
  scraper: [
    {
      url: "http://www.grand-tree.jp/web/shop/index.html",
      options: { waitUntil: "domcontentloaded" },
      venues: {
        "#shopList div.item:not(.all)": {
          followLink: { selector: "a", property: "href" },
          name: { selector: "h3", modifier: (name) => name.split("｜")[0].trim() },
          altName: { selector: "h3", modifier: (name) => name.split("｜")[1].trim() },
          phone: { xpath: "//dt[contains(text(), '電話')]/following-sibling::dd" }, // contains is only by xpath
          level: { selector: "#subData dd:nth-of-type(1)", modifier: levelExtractor },
        },
      },
    },
  ],
};

export = config;
