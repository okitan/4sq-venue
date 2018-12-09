"use strict";

module.exports = {
  id: "<%= id %>",
  name: "<%= name %>",
  subvenues: [
  <% subVenues.forEach(subvenue => { %>
    <%- JSON.stringify(subvenue) %>
  <% }) %>
  ],
  linker: {
    ignore: []
  }
};

module.exports.scraper = [
  // {
  //   url: "URL",
  //   venues: {
  //     SELECTOR: {
  //       name: { selector: "SELECTOR" },
  //       altName: { selector: "SELECTOR" },
  //       phone: { selector: "SELECTOR" },
  //       level: { selector: "SELECTOR" }
  //     }
  //   }
  // }
];
