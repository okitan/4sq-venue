"use strict";

module.exports = {
  id: "50966024e4b0ad0d96424f52",
  name: "武蔵小杉東急スクエア",
  linker: {
    ignore: ["武蔵小杉", "東急スクエア"]
  }
};

module.exports.scraper = [
  ...[1, 2, 3, 4, 5].map(e => {
    return {
      url: `http://www.kosugi-square.com/floor/?fcd=${e}`,
      venues: {
        ".floorlistInner li": {
          name: { selector: ".floorlist__txt--shopname" },
          phone: { selector: ".floorlist__txt--tel" },
          url: { selector: "a", property: "href", nullable: true },
          level: e
        }
      }
    };
  })
];
