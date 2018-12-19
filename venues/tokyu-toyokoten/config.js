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

// fucking workaround
// these can be mark to distinguish venues
const venuesHavingAdditionalInfo = ["ハヤシフルーツ", "味の浜藤", "お食事"];

const venueDescriptions = [
  "カフェ",
  "洋服お直し",
  "時計修理",
  "介護・健康用品"
];

// also removes
const nameModifier = name => {
  if (venuesHavingAdditionalInfo.some(e => name.includes(e))) {
    // reserves additionalInfo but removes description
    return name;
  } else {
    return name.replace(/[（\(].+[\)）]/, "");
  }
};

const altNameExtractor = name => {
  if (
    [...venuesHavingAdditionalInfo, ...venueDescriptions].some(e =>
      name.includes(e)
    )
  ) {
    // do not consider additional info and description as altName
    return null;
  } else {
    const matched = name.match(/[（\(](.+)[\)）]/);
    return matched && matched[1] !== "東横のれん街" ? matched[1] : null;
  }
};

const bldgExtractor = name => {
  const matched = name.match(/(\S+館)/);
  return matched ? matched[1] : null;
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
        level: -1,
        bldg: {
          xpath: "//th[contains(text(), 'フロア')]/following-sibling::td",
          modifier: bldgExtractor
        }
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
          level: i,
          bldg: {
            xpath: "//th[contains(text(), 'フロア')]/following-sibling::td",
            modifier: bldgExtractor
          }
        }
      }
    };
  })
];
