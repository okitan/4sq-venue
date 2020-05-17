import { Venue } from "../src/venue";

describe(Venue, () => {
  describe(".getSimilarityOfName", () => {
    test("returns the most similar score", () => {
      const a = new Venue({
        name: "あいうえおA",
        scraped: {
          name: "アイウエオ",
          altName: "AIUEO",
          bldg: "",
          level: 0,
          phone: "",
          url: "",
        },
      });

      const b = new Venue({
        name: "あいうえおほげ",
        scraped: {
          name: "あいうえおB",
          altName: "",
          bldg: "",
          level: 0,
          phone: "",
          url: "",
        },
      });

      expect(a.getSimilarityOfName(b)).toBe(5 / 6);
    });
  });
});
