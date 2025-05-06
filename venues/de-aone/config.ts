import type { Config } from "../../src/types/config";

const config: Config = {
  id: "652a43499757b5633cbfa360",
  name: "JIYUGAOKA de aone",
  subvenues: [],
  linker: {
    ignore: ["自由が丘", "ディアオーネ", "aone"],
  },
  scraper: [
    {
      url: "https://jiyugaoka-de-aone.aeonmall.com/",
      venues: {
        ".topic-modal .shop-modal__body": {
          name: { selector: ".shop-modal__name" },
          altName: { selector: ".shop-modal__ruby" },
          phone: { selector: ".shop-modal__num", nullable: true },
          level: {
            selector: ".shop-modal__map img",
            property: "src",
            modifier: (text) => {
              const level = text.match(/\/shops\/(\db?)/);
              if (!level) throw new Error(`no level found for ${text}`);

              return level[1].includes("b") ? -1 * parseInt(level[1]) : parseInt(level[1]);
            },
          },
        },
      },
    },
  ],
};

export = config;
