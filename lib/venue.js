"use strict";

class Venue {
  constructor({ id, name, url, scraped }) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.scraped = scraped || {};
  }

  formatScraped() {
    return ["name", "altName", "level", "phone", "url"].reduce((object, e) => {
      object[e] = this.scraped[e] || "";
      return object;
    }, {});
  }
}

module.exports = {
  Venue,
  createScrapedVenue: data => {
    return new Venue({ scraped: data });
  }
};
