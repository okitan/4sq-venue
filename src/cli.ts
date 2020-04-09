import Yargs from "yargs";

Yargs.scriptName("$ npm run 4sq --")
  // TODO: remove later
  .commandDir("../lib/commands")
  .commandDir("./commands", { extensions: ["ts"] })
  .strict()
  .version(false)
  .wrap(120)
  .fail((_, err) => {
    // XXX: without this handler will be executed twice when it errors
    console.trace(err);
    process.exit(192);
  })
  .parse(process.argv.slice(2));
