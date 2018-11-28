"use strict";

const puppeteer = require("puppeteer");

const { phoneExtractor } = require("./util");

const scrape = async (url, venues, notify) => {
  const results = [];

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: process.env.NO_HEADLESS ? false : true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(url);

    for (const [selector, { followLink, ...properties }] of Object.entries(
      venues
    )) {
      const items = await page.$$(selector);

      if (items.length === 0) {
        throw new Error(`no venues found for ${selector}`);
      }

      // console.error("\n", detail);
      for (const item of items) {
        if (followLink) {
          const subVenueUrl = await scrapeVenueValue(item, followLink);

          if (notify) notify(`Scraping subvenue ${subVenueUrl}`);

          let newPage;
          try {
            newPage = await browser.newPage();
            await newPage.goto(subVenueUrl);

            const result = await scrapeVenue(newPage, properties);
            result.url = subVenueUrl;

            results.push(result);
          } finally {
            if (newPage) await newPage.close();
          }
        } else {
          results.push(await scrapeVenue(item, properties));
        }
      }
    }
  } finally {
    if (browser) await browser.close();
  }

  return results;
};

const scrapeVenue = async (venue, properties) => {
  const results = {};

  for (const [key, value] of Object.entries(properties)) {
    let result = await scrapeVenueValue(venue, value);

    if (key === "phone") {
      result = phoneExtractor(result);
    }

    results[key] = result;
  }

  return results;
};

const scrapeVenueValue = async (venue, handler) => {
  switch (typeof handler) {
    case "object":
      let { selector, property, modifier, nullable } = handler;
      property = property || "innerText";

      const element = await venue.$(selector);

      if (nullable && !element) return;

      const result = (await (await element.getProperty(property)).jsonValue())
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
          return String.fromCharCode(s.charCodeAt(0) - 65248);
        })
        .replace(/\s/, " ")
        .replace(/\n/, "");

      return modifier ? modifier(result) : result;
    default:
      return handler;
  }
};

module.exports = {
  scrape
};
