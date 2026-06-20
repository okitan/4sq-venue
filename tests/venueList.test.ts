import { Venue } from "../src/venue.ts";
import { VenueList } from "../src/venueList.ts";

describe(VenueList, () => {
  describe(".removeVenue", () => {
    test("returns null if not matched", () => {
      const list = new VenueList(
        new Venue({
          name: "あいうえお",
        })
      );

      const venue = new Venue({
        name: "かきくけとこ",
      });

      expect(list.removeVenue(venue)).toBe(null);
    });
  });
});
