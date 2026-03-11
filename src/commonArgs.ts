import yargs from "yargs";

import { guessTargetFromBranchName } from "./util.ts";

export type Extract<T> = T extends yargs.Argv<infer U> ? U : never;

export const commonArgs = {
  targetWithCompletion: {
    type: "string" as const,
    alias: "t",
    // TODO: with choices
    default: guessTargetFromBranchName() as string, // with demandOption, yargs ensures non empty string
    demandOption: true as const,
  },
  venueId: {
    type: "string" as const,
    alias: ["v", "venue"],
    demandOption: true as const,
  },
  dryRun: {
    type: "boolean" as const,
    default: true,
    demandOption: true as const,
    deprecate: true,
  },
  exec: {
    type: "boolean" as const,
    default: false,
    demandOption: true as const,
  },
};
