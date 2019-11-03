"use strict";

module.exports = {
  id: "5d7b5d89d1334200083e1ae2",
  name: "渋谷スクランブルスクエア",
  subvenues: [{ id: "5dbc0e6405066e000711b091", name: "Tokyu Foodshow EDGE" }],
  linker: {
    ignore: []
  }
};

module.exports.scraper = [
  {
    url: "https://www.shibuya-scramble-square.com/floorguide/",
    options: {
      waitUntil: "load",
      timeout: 60 * 1000
    },
    venues: {
      ".articleBlock article": {
        followLink: { selector: "a", property: "href" },
        name: { selector: ".js-shop-name" },
        altName: { selector: ".ruby" },
        level: {
          selector: ".js-shop-floor",
          modifier: level => level.replace(/.*?(B?\d).*/, "$1")
        }
      }
    }
  }
];
