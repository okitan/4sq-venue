"use strict";

module.exports = {
  id: "50966024e4b0ad0d96424f52",
  name: "武蔵小杉東急スクエア"
};

module.exports.scraper = [
  ...[1, 2, 3, 4, 5].map(e => {
    return {
      url: `http://www.kosugi-square.com/floor/?fcd=${e}`,
      venues: {
        "div.floorlist__txt": {
          name: { selector: ".floorlist__txt--shopname" },
          phone: { selector: ".floorlist__txt--tel" },
          level: e
        }
      }
    };
  })
];
