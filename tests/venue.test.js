"use strict";

const { Venue } = require("../src/venue");

describe("Venue", () => {
  describe(".getSimilarityOfName", () => {
    test("returns the most similar score", () => {
      const a = new Venue({
        name: "あいうえおA",
        scraped: {
          name: "アイウエオ",
          altName: "AIUEO",
        },
      });

      const b = new Venue({
        name: "あいうえおほげ",
        scraped: {
          name: "あいうえおB",
        },
      });

      expect(a.getSimilarityOfName(b)).toBe(5 / 6);
    });
  });
});
