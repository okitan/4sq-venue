"use strict";

module.exports = {
  id: "4c0f742698102d7f2f32e506",
  name: "MAGNET by SHIBUYA109",
  subvenues: [{ id: "5af43e0f336273003909fe13", name: "MAG7" }],
  linker: {
    ignore: ["SHIBUYA", "渋谷", "109", "MAGNET"]
  }
};

module.exports.scraper = [
  {
    url: `https://magnetbyshibuya109.jp/shop/`,
    options: {
      waitUntil: "domcontentloaded"
    },
    venues: {
      // TODO:
      ".results article": {
        followLink: { selector: "a", property: "href" },
        name: {
          selector: ".shop-name",
          property: "innerHTML",
          modifier: e => e.split("</span>")[1].trim()
        },
        phone: {
          xpath: "//td[contains(text(), 'TEL')]/following-sibling::td",
          nullable: true
        },
        level: {
          selector: ".type-floor",
          modifier: e => {
            if (e.includes("MAG 7")) {
              return 7;
            } else {
              const matched = e.match(/(地下)?(\d+)階/);
              return matched[1] ? -matched[2] : matched[1];
            }
          }
        }
      }
    }
  }
];
