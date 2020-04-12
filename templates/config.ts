import { Config } from "../../src/types/config";

const config: Config = {
  id: "<%= id %>",
  name: "<%= name %>",
  subvenues: [
    <% subVenues.forEach(subvenue => { %>
      <%- JSON.stringify(subvenue) %>
    <% }) %>
  ],
  linker: {
    ignore: [],
  },
  scraper: [
    {
      url: "URL",
      venues: {
        SELECTOR: {
          name: { selector: "SELECTOR" },
          altName: { selector: "SELECTOR" },
          phone: { selector: "SELECTOR" },
          level: { selector: "SELECTOR" },
        },
      },
    },
  ],
};

export = config;
