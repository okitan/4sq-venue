import yargs from "yargs";

import { commonArgs, Extract } from "../../cli";
import { getSimilarity } from "../../nameMatcher";
import { loadLinkedVenues } from "../../venueList";

export const command = "check [Options]";
export const description = "check links";

export function builder<T>(yargs: yargs.Argv<T>) {
  return yargs.options({ target: commonArgs.targetWithCompletion });
}

export function handler({ target }: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const linkedVenues = loadLinkedVenues(target);

  console.table(
    linkedVenues.map(({ id, name, scraped }) => {
      if (!scraped) throw `linked venues have no scraped venue`; // never

      return {
        url: `https://foursquare.com/v/${id}`,
        score: Math.max(getSimilarity(name, scraped.name), getSimilarity(name, scraped.altName)) > 0.7 ? "⭕" : "x",
        name,
        scraped: scraped.name,
        alt: scraped.altName,
      };
    })
  );
}
