import Yargs from "yargs/yargs";

Yargs()
  .scriptName("$ npm run 4sq --")
  .commandDir("./commands", { extensions: ["ts"] })
  .strict()
  .version(false)
  .wrap(120)
  .parse(process.argv.slice(2));
