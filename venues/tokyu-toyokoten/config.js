"use strict";

module.exports = {
  id: "4b6170d8f964a520a7132ae3",
  name: "東急百貨店 東横店",
  subvenues: [{ id: "4b54335ff964a5206bb427e3", name: "東急フードショー" }],
  linker: {
    ignore: ["東急", "東横店", "フードショー", "百貨店"]
  }
};

// also removes
const nameModifier = name => {
  // fucking workaround
  if (name.includes("ハヤシフルーツ") || name.includes("味の浜藤")) {
    return name;
  } else {
    return name.replace(/[（\(].+[\)）]/, "");
  }
};

const altNameExtractor = name => {
  if (
    name.includes("ハヤシフルーツ") ||
    name.includes("味の浜藤") ||
    name.includes("キャピタルコーヒー")
  ) {
    return null;
  } else {
    const matched = name.match(/[（\(](.+)[\)）]/);
    return matched && matched[1] !== "東横のれん街" ? matched[1] : null;
  }
};

module.exports.scraper = [
  {
    url: "https://www.tokyu-dept.co.jp/toyoko/floor/b1_norengai.html",
    venues: {
      ".list_shop_block li": {
        followLink: { selector: "a", property: "href" },
        name: { selector: ".heading_shop", modifier: nameModifier },
        altName: { selector: ".heading_shop", modifier: altNameExtractor },
        phone: {
          xpath: "//th[contains(text(), '電話番号')]/following-sibling::td",
          nullable: true
        },
        level: -1,
        bldg: "東横のれん街"
      }
    }
  },
  {
    url: "https://www.tokyu-dept.co.jp/toyoko/floor/b1_foodshow.html",
    venues: {
      ".list_shop_block li": {
        followLink: { selector: "a", property: "href" },
        name: { selector: ".heading_shop", modifier: nameModifier },
        altName: { selector: ".heading_shop", modifier: altNameExtractor },
        phone: {
          xpath: "//th[contains(text(), '電話番号')]/following-sibling::td",
          nullable: true
        },
        level: -1
      }
    }
  },
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
    return {
      url: `https://www.tokyu-dept.co.jp/toyoko/floor/${i}f.html`,
      venues: {
        ".list_shop_block li": {
          followLink: { selector: "a", property: "href" },
          name: { selector: ".heading_shop", modifier: nameModifier },
          altName: { selector: ".heading_shop", modifier: altNameExtractor },
          phone: {
            xpath: "//th[contains(text(), '電話番号')]/following-sibling::td",
            nullable: true
          },
          level: i
        }
      }
    };
  })
];
