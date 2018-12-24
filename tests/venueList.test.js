"use strict";

const { VenueList } = require("../lib/venueList");
const { Venue } = require("../lib/venue");

describe("VenueList", () => {
  describe(".removeVenue", () => {
    test("returns null if not matched", () => {
      const list = new VenueList(
        new Venue({
          name: "あいうえお"
        })
      );

      const venue = new Venue({
        name: "かきくけとこ"
      });

      expect(list.removeVenue(venue)).toBe(null);
    });
  });
});
