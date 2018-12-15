"use strict";

module.exports = {
  id: "597f0333dec1d60e99087df2",
  name: "渋谷ストリーム",
  subvenues: [],
  linker: {
    ignore: ["渋谷", "ストリーム"]
  }
};

module.exports.scraper = [
  {
    url: "https://shibuyastream.jp/shop/",
    venues: {
      "#shop_lists li": {
        followLink: { selector: "a", property: "href" },
        name: { selector: ".shop_name" },
        altName: { selector: ".shop_kana" },
        phone: { selector: ".shop_detail_list dd:nth-of-type(3)" },
        level: { selector: ".shop_detail_list dd:nth-of-type(1)", modifier: e => e.replace("F", "") }
      }
    }
  }
];
