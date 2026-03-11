import yargs from "yargs";

import { commonArgs, type Extract } from "../../commonArgs.ts";
import { getSimilarity } from "../../nameMatcher.ts";
import { loadLinkedVenues } from "../../venueList.ts";

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
