import yargs from "yargs";

export const command = "venue <command>";
export const description = "venue";

export function builder(yargs: yargs.Argv) {
  return yargs.commandDir("./venue", { extensions: ["ts"] });
}
