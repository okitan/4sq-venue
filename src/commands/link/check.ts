import yargs from "yargs";

import { Extract } from "../../cli";
import { getSimilarity } from "../../nameMatcher";
import { guessTargetFromBranchName } from "../../util";
import { loadLinkedVenues } from "../../venueList";

export const command = "check";
export const description = "check links";

export function builder(yargs: yargs.Argv) {
  return yargs.options({
    target: {
      type: "string",
      default: guessTargetFromBranchName(),
      demandOption: true,
    },
  });
}

export function handler({ target }: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  if (!target) throw `target should not be null`; // never

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
