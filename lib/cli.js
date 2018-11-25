"use strict";

require("yargs")
  .commandDir("commands")
  .strict()
  .wrap(null)
  .version(false)
  .help().argv;
