"use strict";

const { get: _get } = require("axios");
const flatmap = require("flatmap");

const get = async (url, params = {}) => {
  return await _get(url, {
    baseURL: "https://api.foursquare.com/v2",
    headers: { Accept: "application/json" },
    params: {
      oauth_token: process.env.FOURSQUARE_TOKEN,
      v: "20181127",
      locale: "ja",
      ...params
    }
  });
};

const getChildren = async venueId => {
  const response = await get(`/venues/${venueId}/children`);

  return flatmap(response.data.response.children.groups, e => {
    return e.items.map(e => {
      return { ...e, parentVenueId: venueId };
    });
  });
};

module.exports = {
  getChildren
};
