import yargs from "yargs";
import Yargs from "yargs/yargs";

export type Extract<T> = T extends yargs.Argv<infer U> ? U : never;

Yargs()
  .scriptName("$ npm run 4sq --")
  .commandDir("./commands", { extensions: ["ts"] })
  .strict()
  .version(false)
  .wrap(120)
  .parse(process.argv.slice(2));
