import yargs from "yargs";

export const command = "link <command>";
export const description = "link";

export function builder<T>(yargs: yargs.Argv<T>) {
  return yargs.commandDir("./link", { extensions: ["ts"] });
}
