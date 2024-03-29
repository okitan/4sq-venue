import { phoneExtractor } from "../../src/modifier";
import type { Config, ScrapeConfig } from "../../src/types/config";

const config: Config = {
  id: "4bd557cc6798ef3b4735638d",
  name: "ヒカリエ",
  subvenues: [
    { id: "4f7f9ceae4b023c637e055ec", name: "ShinQs" },
    { id: "4fa8cfe1e4b01db6889d52e1", name: "8/" },
    { id: "5ee8736edd56ba00075215f0", name: "東横のれん街" },
  ],
  linker: {
    ignore: ["ヒカリエ", "shinqs", "渋谷", "のれん街", "東急"],
  },
  scraper: [
    // background floor of Shinqs
    ...[3, 2, 1].map((e): ScrapeConfig => {
      return {
        url: `https://www.tokyu-dept.co.jp/shinqs/floor/b${e}.html`,
        venues: {
          "ul.catList li:not(.coming)": {
            followLink: { selector: "a", property: "href" },
            name: { selector: "h3", modifier: nameExtractor },
            altName: { selector: "h3", modifier: altNameExtractor },
            //fucking no semantics
            phone: { selector: "h3 + p + p" },
            level: -e,
          },
        },
      };
    }),
    // Shinqs
    ...[1, 2, 3, 4, 5].map((e): ScrapeConfig => {
      return {
        url: `https://www.tokyu-dept.co.jp/shinqs/floor/${e}f.html`,
        venues: {
          "ul.catList li:not(.coming)": {
            followLink: { selector: "a", property: "href" },
            skip: async (item) => {
              return (await (await item.$("a"))!.getProperty("href")).toString().includes("/patekphilippe/");
            },
            name: { selector: "h3", modifier: nameExtractor },
            altName: { selector: "h3", modifier: altNameExtractor },
            //fucking no semantics
            phone: { selector: "h3 + p + p" },
            level: e,
          },
        },
      };
    }),
    // special venue
    {
      url: "https://www.tokyu-dept.co.jp/shinqs/brand_info/patekphilippe/index.html",
      venues: {
        body: {
          name: { selector: ".logo_pp_authorized_retailer img", property: "alt" },
          url: "https://www.tokyu-dept.co.jp/shinqs/brand_info/patekphilippe/index.html",
          phone: { selector: ".pp_tel_button", modifier: phoneExtractor },
          level: 2,
        },
      },
    },
    // Hikarie (no venues on 10F)
    ...[6, 7, 8, 9, 11].map((e): ScrapeConfig => {
      return {
        url: `http://www.hikarie.jp/floormap/${e}F.html`,
        venues: {
          "li.cmn-card02": {
            followLink: { selector: "a", property: "href" },
            name: { selector: "h1.name" },
            // fucking table layout
            phone: { selector: "xpath/.//dt[contains(text(),'電話番号')]/following-sibling::dd", nullable: true },
            level: e,
          },
        },
      };
    }),
  ],
};

function nameExtractor(name: string) {
  return name
    .split("／")[0]
    .replace(/［.+］$/, "") // remove ［11月22日（木）オープン］
    .trim()
    .replace(/[（\(](.+)[\)）]$/, "") // remove （altName） or (altName)
    .trim();
}

function altNameExtractor(name: string) {
  const matched = name
    .split("／")[0]
    .replace(/［.+］$/, "") // remove ［11月22日（木）オープン］
    .trim()
    .match(/[（\(](.+)[\)）]$/);

  return matched ? matched[1] : undefined;
}

export = config;
