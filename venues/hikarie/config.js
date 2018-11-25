"use strict";

module.exports = {
  id: "4bd557cc6798ef3b4735638d",
  name: "ヒカリエ",
  subvenues: [
    { id: "4f7f9ceae4b023c637e055ec", name: "ShinQs" },
    { id: "4fa8cfe1e4b01db6889d52e1", name: "8/" }
  ]
};

// remove ［11月22日（木）オープン］
const nameModifier = name => name.replace(/［.+］$/, "").trim();

module.exports.scraper = [
  // background floor of Shinqs
  ...[3, 2, 1].map(e => {
    return {
      url: `https://www.tokyu-dept.co.jp/shinqs/floor/b${e}.html`,
      venues: {
        "ul.shopList li": {
          followLink: { selector: "a", property: "href" },
          name: { selector: "h3", modifier: nameModifier },
          //fucking no semantics
          phone: { selector: "h3 + p + p" },
          level: -e
        }
      }
    };
  }),
  // Shinqs
  ...[1, 2, 3, 4, 5].map(e => {
    return {
      url: `https://www.tokyu-dept.co.jp/shinqs/floor/${e}f.html`,
      venues: {
        "ul.shopList li": {
          followLink: { selector: "a", property: "href" },
          name: { selector: "h3", modifier: nameModifier },
          //fucking no semantics
          phone: { selector: "h3 + p + p" },
          level: -e
        }
      }
    };
  }),
  // Hikarie (no venues on 9F and 10F)
  ...[6, 7, 8, 11].map(e => {
    return {
      url: `http://www.hikarie.jp/floormap/${e}F.html`,
      venues: {
        "#floorshop .shopbox": {
          name: { selector: ".shoplogo" },
          phone: {
            // fucking no semantics
            selector:
              ".shop_info_m dd:nth-of-type(2), .shop_info_67_r dl:nth-of-type(3) dd"
          },
          level: e
        }
      }
    };
  })
];
