import { Config } from "../../src/config";

const config: Config = {
  id: "4b3f1743f964a520eba325e3",
  name: "渋谷マークシティ",
  subvenues: [
    { id: "4b7d16f1f964a5204cae2fe3", name: "渋谷エクセルホテル東急" },
    { id: "5f5f634e017ea123d39b622c", name: "東急フードショー" },
  ],
  linker: {
    ignore: ["渋谷", "マークシティ", "東急", "フードショー"],
  },
  scraper: [
    // マークシティ
    ...[1, 2, 3, 4, 5, 6].map((i) => ({
      url: `http://www.s-markcity.co.jp/floor/floor.php?no=${i}`,
      venues: {
        "tr a:not([href='/busterminal/'])": {
          followLink: { xpath: ".", property: "href" },
          name: { selector: "#shopname dt" },
          phone: { xpath: "//img[@alt='TEL']/../following-sibling::dd[1]", nullable: true as true },
          level: { xpath: "//img[@alt='場所']/../following-sibling::dd[1]", modifier: levelExtractor },
        },
      },
    })),
    // フードショー
    {
      url: "https://www.tokyu-dept.co.jp/shibuya_foodshow/floor/index.html",
      venues: {
        ".list_shop_block li": {
          followLink: { selector: "a", property: "href" },
          name: { selector: ".heading_shop", modifier: nameModifier },
          altName: { selector: ".heading_shop", modifier: altNameExtractor },
          phone: {
            xpath: "//th[contains(text(), '電話番号')]/following-sibling::td",
            nullable: true,
          },
          level: -1,
        },
      },
    },
  ],
};

function nameModifier(name: string) {
  return name.replace(/[（\(].+[\)）]/, "");
}

function altNameExtractor(name: string) {
  const matched = name.match(/[（\(](.+)[\)）]/);
  return matched ? matched[1] : undefined;
}

function levelExtractor(text: string) {
  const matched = text.match(/\d+/);
  return matched ? parseInt(matched[0]) * (text.includes("地下") ? -1 : 1) : undefined;
}

export = config;
