"use strict";

const guess = (a, b) => {
  if (
    (a.name && b.name && a.name.toLowerCase() === b.name.toLowerCase()) ||
    (a.url && a.url === b.url) ||
    (a.phone && a.phone === b.phone)
  ) {
    return true;
  }

  // TODO: edit length

  return false;
};

const findVenue = (list, venue, { remove = false, ...params }) => {
  const index = list.findIndex(guess.bind(null, venue));

  if (index == -1) return null;

  if (remove) {
    return list.splice(index, 1)[0];
  } else {
    return list[index];
  }
};

const updateVenue = (toUpdate, venue) => {
  ["name", "level", "phone", "url"].forEach(key => {
    toUpdate[key] = venue[key];
  });

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
      linkedVenues.push(updateVenue(linkedVenue, venue));

      findVenue(foursquareVenues, venue, { remove: true });
    } else {
      const newVenue = findVenue(foursquareVenues, venue, { remove: true });

      if (newVenue) {
        linkedVenues.push(updateVenue(newVenue, venue));
      } else {
        notLinkedVenues.push(venue);
      }
    }
  });

  console.log(linkedVenues.length);
  console.log(notLinkedVenues.length);

  return [linkVenues, notLinkedVenues, unLinkedVenues];
};

module.exports = { linkVenues };
