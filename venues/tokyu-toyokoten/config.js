"use strict";

module.exports = {
  id: "4b6170d8f964a520a7132ae3",
  name: "東急百貨店 東横店",
  subvenues: [
    { id: "4b54335ff964a5206bb427e3", name: "東急フードショー" },
    { id: "4b6036e1f964a5204dda29e3", name: "東横のれん街" }
  ],
  linker: {
    ignore: ["東急", "東横店", "フードショー", "百貨店"]
  }
};

const nameModifier = name => {
  return name.replace(/[（\(].+[\)）]/, "");
};

const altNameExtractor = name => {
  const matched = name.match(/[（\(](.+)[\)）]/);
  return matched ? matched[1] : null;
};

module.exports.scraper = [
  {
    url: "https://www.tokyu-dept.co.jp/shibuya_foodshow/floor/index.html",
    venues: {
      ".list_shop_block li": {
        followLink: { selector: "a", property: "href" },
        name: { selector: ".heading_shop", modifier: nameModifier },
        altName: { selector: ".heading_shop", modifier: altNameExtractor },
        phone: {
          xpath: "//th[contains(text(), '電話番号')]/following-sibling::td",
          nullable: true
        }
      }
    }
  }
];
