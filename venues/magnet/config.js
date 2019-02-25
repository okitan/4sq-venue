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
  ...[1].map(i => {
    return {
      url: `https://www.shibuya109.jp/shop/freeword/?msnId=MAGNET&p=${i}`,
      venues: {
        // TODO:
        ".shopList tbody tr:nth-of-type(n+1)": {
          name: { selector: "a" },
          phone: { selector: "td:nth-of-type(3)" },
          level: {
            selector: "td:nth-of-type(2)",
            modifier: e => e.match(/(\d+)/)[1]
          },
          url: { selector: "a", property: "href" }
        }
      }
    };
  })
];
