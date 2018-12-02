"use strict";

// returns [ linkedVenues, notLinkedVenues, unLinkedVenues ]
const linkVenues = (scrapedVenues, foursquareVenues, previousResult) => {
  const linkedVenues = [];
  const notLinkedVenues = [];
  const unLinkedVenues = [];

  // check every scraped venues
  scrapedVenues.forEach(venue => {
    const linkedVenue = previousResult.findVenue(venue, { guess: true });

    if (linkedVenue) {
      previousResult.removeVenue(linkedVenue, { guess: true });
      foursquareVenues.removeVenue(linkedVenue, { guess: true });

      linkedVenue.scraped = venue.scraped;
      linkedVenues.push(linkedVenue);
    } else {
      const newVenueIndex = foursquareVenues.findVenueIndex(venue, {
        guess: true
      });

      if (newVenueIndex >= 0) {
        const newVenue = foursquareVenues[newVenueIndex];
        foursquareVenues.splice(newVenueIndex, 1);

        newVenue.scraped = venue.scraped;
        linkedVenues.push(newVenue);
      } else {
        notLinkedVenues.push(venue);
      }
    }
  });

  notLinkedVenues.push(...foursquareVenues);
  unLinkedVenues.push(
    ...previousResult.filter(a => !linkedVenues.some(b => b.equals(a)))
  );

  return [linkedVenues, notLinkedVenues, unLinkedVenues];
};

module.exports = { linkVenues };
