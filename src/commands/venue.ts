import type { Argv } from "yargs";

export const command = "venue <command>";
export const description = "venue";

export function builder<T>(yargs: Argv<T>) {
  return yargs.commandDir("./venue", { extensions: ["ts"] });
}
