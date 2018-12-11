"use strict";

module.exports = {
  id: "52ef1927498e945f59640219",
  name: "ららテラス武蔵小杉",
  subvenues: [],
  linker: {
    ignore: ["ららテラス", "武蔵小杉"]
  }
};

module.exports.scraper = [
  ...[0, 40].map(i => {
    return {
      url: `https://mitsui-shopping-park.com/lalat-musashikosugi/shopguide/?start=${i}`,
      venues: {
        "ul.shop-guide-list-wrap li": {
          followLink: { selector: "a", property: "href" },
          name: { selector: ".brand__name" },
          phone: { selector: ".tel-link", nullable: true },
          level: {
            selector: ".brand__logo li:nth-of-type(2)",
            modifier: e => e.match(/(\d+)/)[1]
          }
        }
      }
    };
  })
];
