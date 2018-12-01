"use strict";

const findVenue = (list, venue, { remove = false, ...params }) => {
  // find exactly equal venue
  let index = list.findIndex(e => venue.equals(e));

  // guess venue by name similarity
  if (index == -1) {
    const scores = list.map(e => venue.getSimilarityOfName(e));
    // console.log(scores);
    const best = Math.max(...scores);
    if (best > 0) {
      index = scores.indexOf(best);
    }
  }

  if (index == -1) return null;

  if (remove) {
    return list.splice(index, 1)[0];
  } else {
    return list[index];
  }
};

const updateVenue = (toUpdate, venue) => {
  return toUpdate;
};

// returns [ linkedVenues, notLinkedVenues, unLinkedVenues ]
const linkVenues = (scrapedVenues, foursquareVenues, previousResult) => {
  const linkedVenues = [];
  const notLinkedVenues = [];
  const unLinkedVenues = [];

  scrapedVenues.forEach(venue => {
    const linkedVenue = findVenue(previousResult, venue, { remove: true });

    if (linkedVenue) {
      linkedVenue.scraped = venue.scraped;
      linkedVenues.push(linkedVenue);

      findVenue(foursquareVenues, linkedVenue, { remove: true });
    } else {
      const newVenue = findVenue(foursquareVenues, venue, { remove: true });

      if (newVenue) {
        newVenue.scraped = venue.scraped;
        linkedVenues.push(newVenue);
      } else {
        notLinkedVenues.push(venue);
      }
    }
  });

  notLinkedVenues.push(...foursquareVenues);
  unLinkedVenues.push(...previousResult);

  return [linkedVenues, notLinkedVenues, unLinkedVenues];
};

module.exports = { linkVenues };
