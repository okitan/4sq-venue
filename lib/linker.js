"use strict";

const findVenue = (
  list,
  venue,
  { guess = false, remove = false, ...params } = {}
) => {
  // find exactly equal venue
  let index = list.findIndex(e => venue.equals(e));

  // guess venue by name similarity
  if (index == -1 && guess) {
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

// returns [ linkedVenues, notLinkedVenues, unLinkedVenues ]
const linkVenues = (scrapedVenues, foursquareVenues, previousResult) => {
  const linkedVenues = [];
  const notLinkedVenues = [];
  const unLinkedVenues = [];

  // check every scraped venues
  scrapedVenues.forEach(venue => {
    const linkedVenue = findVenue(previousResult, venue, { guess: true });

    if (linkedVenue) {
      linkedVenue.scraped = venue.scraped;
      linkedVenues.push(linkedVenue);

      findVenue(foursquareVenues, linkedVenue, { remove: true, guess: true });
    } else {
      const newVenue = findVenue(foursquareVenues, venue, {
        remove: true,
        guess: true
      });

      if (newVenue) {
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
