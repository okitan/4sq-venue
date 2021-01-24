import { Config, ScrapeConfig } from "../../src/config";

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
    ...[3, 2, 1].map(
      (e): ScrapeConfig => {
        return {
          url: `https://www.tokyu-dept.co.jp/shinqs/floor/b${e}.html`,
          venues: {
            "ul.shopList li:not(.coming)": {
              followLink: { selector: "a", property: "href" },
              name: { selector: "h3", modifier: nameExtractor },
              altName: { selector: "h3", modifier: altNameExtractor },
              //fucking no semantics
              phone: { selector: "h3 + p + p" },
              level: -e,
            },
          },
        };
      }
    ),
    // Shinqs
    ...[1, 2, 3, 4, 5].map(
      (e): ScrapeConfig => {
        return {
          url: `https://www.tokyu-dept.co.jp/shinqs/floor/${e}f.html`,
          venues: {
            "ul.shopList li:not(.coming)": {
              followLink: { selector: "a", property: "href" },
              name: { selector: "h3", modifier: nameExtractor },
              altName: { selector: "h3", modifier: altNameExtractor },
              //fucking no semantics
              phone: { selector: "h3 + p + p" },
              level: e,
            },
          },
        };
      }
    ),
    // Hikarie (no venues on 10F)
    ...[6, 7, 8, 9, 11].map(
      (e): ScrapeConfig => {
        return {
          url: `http://www.hikarie.jp/floormap/${e}F.html`,
          venues: {
            ".floorShopList2 li": {
              name: { selector: ".floorShopList2__name", modifier: nameExtractor },
              altName: { selector: ".floorShopList2__name", modifier: altNameExtractor },
              // fucking table layout
              phone: { xpath: ".//th[contains(text(),'TEL')]/following-sibling::td", nullable: true },
              url: { xpath: ".//th[contains(text(),'URL')]/following-sibling::td", nullable: true },
              level: e,
            },
          },
        };
      }
    ),
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
