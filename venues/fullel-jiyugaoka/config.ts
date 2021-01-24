import { Config, ScrapeConfig } from "../../src/config";

const config: Config = {
  id: "4ddee63c1fc70c691ef7fda3",
  name: "フレル・ウィズ 自由が丘",
  subvenues: [],
  linker: {
    ignore: ["フレル・ウィズ", "自由が丘", "東急"],
  },
  scraper: [1, 2, 3].map(
    // Now there are no venues on 4th floor
    (level): ScrapeConfig => {
      return {
        url: `http://www.fullel.com/jiyugaoka/shopguide/?floor=${level}f`,
        venues: {
          ".table_basic01 tr:not(.thBg)": {
            followLink: { selector: "a", property: "href" },
            name: { selector: ".shopCmnTitle01 dd" },
            phone: { selector: ".shopDetailInfo01 tr:nth-of-type(3) td" },
            level,
          },
        },
      };
    }
  ),
};

export = config;
