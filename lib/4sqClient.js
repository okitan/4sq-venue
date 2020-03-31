"use strict";

const { get: _get } = require("axios");
const flatmap = require("flatmap");

const { Venue } = require("./venue");
const { VenueList } = require("./venueList");

const get = async (url, params = {}) => {
  return await _get(url, {
    baseURL: "https://api.foursquare.com/v2",
    headers: { Accept: "application/json" },
    params: {
      oauth_token: process.env.FOURSQUARE_TOKEN,
      v: "20181127",
      locale: "ja",
      ...params,
    },
  });
};

const getVenue = async (venueId) => {
  const response = await get(`/venues/${venueId}`);

  return new Venue(response.data.response.venue);
};

const getChildren = async (venueId) => {
  const response = await get(`/venues/${venueId}/children`);

  return new VenueList(
    ...flatmap(response.data.response.children.groups, (e) => {
      return e.items.map((e) => {
        return new Venue({
          ...e,
          crossStreet: e.location.crossStreet,
          parentVenueId: venueId,
        });
      });
    })
  );
};

module.exports = {
  getVenue,
  getChildren,
};
