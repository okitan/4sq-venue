import { Venue } from "../src/venue";
import { VenueList } from "../src/venueList";

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
