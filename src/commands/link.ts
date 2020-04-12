import yargs from "yargs";

export const command = "link <command>";
export const description = "link";

export function builder(yargs: yargs.Argv) {
  return yargs.commandDir("./link", { extensions: ["ts"] });
}
