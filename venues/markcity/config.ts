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
    ...["east1", "west1", "east2", "west2", "east3", 4, 5].map((i) => ({
      url: `https://www.s-markcity.co.jp/${i}f/`,
      venues: {
        "li.shopinfo_cmd_post_list_item": {
          followLink: { selector: "a", property: "href" },
          name: { selector: "#main h1" },
          phone: { xpath: "//th[contains(text(),'電話番号')]/following-sibling::td", nullable: true as true },
          bldg: {
            selector: ".shop_place div",
            modifier: (txt: string) => {
              const matched = txt.match(/(\W+?)(\d+)(F|階)/);
              return (matched && matched[1]) || undefined;
            },
          },
          level: {
            selector: ".shop_place div",
            modifier: (txt: string) => {
              const matched = txt.match(/(\W+?)(\d+)(F|階)/);
              return (matched && parseInt(matched[2])) || undefined;
            },
          },
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

export = config;
