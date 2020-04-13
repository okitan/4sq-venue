import { Venue } from "./venue";
import { VenueList } from "./venueList";

type VenueSet = {
  scrapedVenue: Venue;
  foursquareVenue: Venue;
};

type ScoredVenueSet = VenueSet & { score: number };

// returns [ linkedVenues, notLinkedVenues, unLinkedVenues ]
export function linkVenues({
  scrapedVenues,
  foursquareVenues,
  noListVenues,
  previousResult,
  previousUnLinkedVenues,
  ignore = [],
}: {
  scrapedVenues: VenueList;
  foursquareVenues: VenueList;
  noListVenues: VenueList;
  previousResult: VenueList;
  previousUnLinkedVenues: VenueList;
  ignore?: string[];
}) {
  const linkedVenues = new VenueList();
  const notLinkedVenues = new VenueList();
  const unLinkedVenues = new VenueList();

  // remove previousResult
  previousResult.forEach((result) => {
    // no guess seems OK
    const scrapedVenue = scrapedVenues.removeVenue(result);
    const foursquareVenue = foursquareVenues.removeVenue(result);

    if (scrapedVenue && foursquareVenue) {
      foursquareVenue.scraped = scrapedVenue.scraped;
      linkedVenues.push(foursquareVenue);
    } else {
      if (scrapedVenue) {
        // it means foursquareVenue disappeared, try to re-guess
        scrapedVenues.push(scrapedVenue);
      }
    }
  });

  previousUnLinkedVenues.forEach((result) => {
    // no guess seems OK
    const scrapedVenue = scrapedVenues.removeVenue(result);
    const foursquareVenue = foursquareVenues.removeVenue(result);

    if (scrapedVenue) {
      // it means scraping miss may be resolved
      scrapedVenues.push(scrapedVenue);
      if (foursquareVenue) {
        foursquareVenues.push(foursquareVenue);
      }
    } else {
      if (foursquareVenue) {
        // it means close have not been done
        unLinkedVenues.push(result);
      }
    }
  });

  // try link by equality
  matchVenues(scrapedVenues, foursquareVenues, { ignore }).forEach(({ scrapedVenue, foursquareVenue }) => {
    scrapedVenues.removeVenue(scrapedVenue);
    foursquareVenues.removeVenue(foursquareVenue);

    foursquareVenue.scraped = scrapedVenue.scraped;
    linkedVenues.push(foursquareVenue);
  });

  // never scraped but exists
  noListVenues.forEach((venue) => {
    foursquareVenues.removeVenue(venue);
  });

  // create guess map
  guessVenues(scrapedVenues, foursquareVenues, { ignore }).forEach(({ scrapedVenue, foursquareVenue }) => {
    console.log(`${scrapedVenue.scraped?.name} / ${foursquareVenue.name}`);

    scrapedVenues.removeVenue(scrapedVenue);
    foursquareVenues.removeVenue(foursquareVenue);

    foursquareVenue.scraped = scrapedVenue.scraped;
    linkedVenues.push(foursquareVenue);
  });

  notLinkedVenues.push(...foursquareVenues, ...scrapedVenues);
  unLinkedVenues.push(...previousResult.filter((a) => !linkedVenues.some((b) => b.equals(a))));

  return [linkedVenues, notLinkedVenues, unLinkedVenues];
}

function matchVenues(
  scrapedVenues: VenueList,
  foursquareVenues: VenueList,
  { ignore = [] }: { ignore?: string[] } = {}
): VenueSet[] {
  return scrapedVenues
    .map((scrapedVenue) => {
      return {
        scrapedVenue,
        foursquareVenue: foursquareVenues.findVenue(scrapedVenue, { ignore }),
      };
    })
    .filter(({ foursquareVenue }) => foursquareVenue);
}

// returns guess candidates Array of { scrapedVenue, foursquareVenue, score }
function guessVenues(
  scrapedVenues: VenueList,
  foursquareVenues: VenueList,
  { ignore = [] }: { ignore?: string[] } = {}
): ScoredVenueSet[] {
  return scrapedVenues
    .flatMap((scrapedVenue) => {
      // select best of columns
      const scores = foursquareVenues.map((foursquareVenue) => {
        return {
          scrapedVenue,
          foursquareVenue,
          score: scrapedVenue.getSimilarityOfName(foursquareVenue, { ignore }),
        };
      });

      const best = Math.max(...scores.map(({ score }) => score));
      return scores.find(({ score }) => score === best);
    })
    .filter((set): set is ScoredVenueSet => Boolean(set))
    .filter(({ score }) => score > 0.5) // heuristic threshold
    .filter(({ scrapedVenue, foursquareVenue }, _, array) => {
      const duplicates = array.filter((e) => foursquareVenue.equals(e.foursquareVenue));

      if (duplicates.length > 1) {
        const best = Math.max(...duplicates.map(({ score }) => score));

        return duplicates.find(({ score }) => score === best)?.scrapedVenue.equals(scrapedVenue);
      } else {
        return true;
      }
    });
}
