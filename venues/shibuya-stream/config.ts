import type { Config, ScrapeConfig } from '../../src/types/config';

const config: Config = {
  id: "597f0333dec1d60e99087df2",
  name: "渋谷ストリーム",
  subvenues: [
    {
      id: "5c0b73c0dee770002c73c9da",
      name: "TORQUE Spice & Herb, Table & Court",
    },
  ],
  linker: {
    ignore: ["渋谷", "ストリーム"],
  },
  scraper: [
    ...[1, 2, 3, 4].map(
      (floor): ScrapeConfig => ({
        url: `https://shibuyastream.jp/shop/?floor=${floor}f`,
        venues: {
          "li.cmn-card02": {
            followLink: { selector: "a", property: "href" },
            name: { selector: "h1.name" },
            phone: { selector: "xpath/.//dt[contains(text(),'電話番号')]/following-sibling::dd", nullable: true },
            level: floor,
          },
        },
      }),
    ),
  ],
};

export = config;
