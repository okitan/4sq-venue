import { levelExtractor } from "../../src/modifier";
import { applySelector } from "../../src/scraper";
import { Config } from "../../src/types/config";

const config: Config = {
  id: "597f0333dec1d60e99087df2",
  name: "渋谷ストリーム",
  subvenues: [
    {
      id: "5c0b73c0dee770002c73c9da",
      name: "TORQUE Spice & Herb, Table & Court",
    },
  ],
  linker: {
    ignore: ["渋谷", "ストリーム"],
  },
  scraper: [
    {
      url: "https://shibuyastream.jp/shop/",
      venues: {
        "#shop_lists > li": {
          followLink: { selector: "a", property: "href" },
          name: { selector: ".shop_name" },
          altName: { selector: ".shop_kana" },
          phone: { selector: ".tel" },
          level: { selector: ".shop_detail_list .floor_no", modifier: levelExtractor },
          skip: async (item) => (await applySelector(item, { selector: ".shop_name" })) === "Coming soon...",
        },
      },
    },
  ],
};

export = config;
