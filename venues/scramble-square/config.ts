import fetch from "node-fetch";

import { phoneExtractor } from "../../src/modifier";
import { ScrapedProperties } from "../../src/scraper";
import { Config } from "../../src/types/config";

const config: Config = {
  id: "5d7b5d89d1334200083e1ae2",
  name: "渋谷スクランブルスクエア",
  subvenues: [
    { id: "5dbc0e6405066e000711b091", name: "Tokyu Foodshow EDGE" },
    { id: "5dbc0e18894bda0008708012", name: "TSUTAYA BOOKSTORE" },
    { id: "5db1240443598d00073edbe0", name: "SHIBUYA SKY" },
  ],
  linker: {
    ignore: ["渋谷", "SHIBUYA", "スクランブル", "スクエア", "SCRAMBLE", "SQUARE"],
  },
  scraper: [
    {
      fetch: async (): Promise<ScrapedProperties[]> => {
        const url = "https://tacsis-cdn-endpoint.azureedge.net/cms-web/shop.json";

        const result = await (await fetch(url)).json();
        assertResult(result);

        return result.map((shop) => {
          return {
            name: shop.shop_name,
            altName: shop.shop_name_kana,
            phone: phoneExtractor(shop.phone_no),
            bldg: undefined,
            level: parseInt((shop.floor as string).replace("F", "").replace("B", "-")),
            url: `https://www.shibuya-scramble-square.com/shops_restaurants/detail.html?shop_id=${shop.shop_id}`,
          };
        });
      },
    },
  ],
};

function assertResult(result: any): asserts result is Array<{ [x: string]: any }> {
  // TODO: declare response schema and check it
  result;
}

export = config;
