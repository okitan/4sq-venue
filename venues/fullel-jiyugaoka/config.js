"use strict";

module.exports = {
  id: "4ddee63c1fc70c691ef7fda3",
  name: "フレル・ウィズ 自由が丘",
  subvenues: [],
  linker: {
    ignore: ["フレル・ウィズ", "自由が丘", "東急"]
  }
};

module.exports.scraper = [
  ...[1, 2, 3, 4].map(level => {
    return {
      url: `http://www.fullel.com/jiyugaoka/shopguide/?floor=${level}f`,
      venues: {
        ".table_basic01 tr:not(.thBg)": {
          followLink: { selector: "a", property: "href" },
          name: { selector: ".shopCmnTitle01 dd" },
          phone: { selector: ".shopDetailInfo01 tr:nth-of-type(3) td" },
          level
        }
      }
    }
  })
];
