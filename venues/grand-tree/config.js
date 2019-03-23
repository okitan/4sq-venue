"use strict";

module.exports = {
  id: "5361cba0498e5839aa495469",
  name: "グランツリー武蔵小杉",
  subvenues: [
    {
      id: "54a38f1b498ea176a18bd8ac",
      name: "グランツリー武蔵小杉-フードコート"
    }
  ],
  linker: {
    ignore: ["グランツリー", "武蔵小杉", "ムサシコスギ"]
  }
};

const nameExtractor = name => name.split("｜")[0];
const altNameExtractor = name => name.split("｜")[1];

const phoneSelector = async venue => {
  return (await venue.$x())[0];
};

module.exports.scraper = [
  {
    url: "http://www.grand-tree.jp/web/shop/index.html",
    options: {
      timeout: 60 * 1000
    },
    venues: {
      "#shopList div.item:not(.all)": {
        followLink: { selector: "a", property: "href" },
        name: { selector: "h3", modifier: nameExtractor },
        altName: { selector: "h3", modifier: altNameExtractor },
        phone: {
          xpath: "//dt[contains(text(), '電話')]/following-sibling::dd"
        },
        level: {
          selector: "#subData dd:nth-of-type(1)",
          modifier: level => level.replace("F", "")
        }
      }
    }
  }
];
