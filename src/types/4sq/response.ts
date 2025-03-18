import { DetailedFoursquareVenue, FoursquareVenue } from "./resource";

export type SuccessfulFoursquareResponse = {
  meta: {
    code: 200;
    requestId: string;
  };
  response: {
    [x: string]: unknown;
  };
};

export type SuccessfulVenueResponse = SuccessfulFoursquareResponse & {
  response: FoursquareVenue;
};

export type SuccessfulVenuesResponse = SuccessfulFoursquareResponse & {
  response: {
    venues: FoursquareVenue[];
  };
};

export type SuccessfulGetVenueResponse = SuccessfulFoursquareResponse & {
  response: {
    venue: DetailedFoursquareVenue;
  };
};

export type SuccessfulGetVenueChildernResponse = SuccessfulFoursquareResponse & {
  response: {
    children: {
      groups: { items: FoursquareVenue[] }[];
    };
  };
};

export type SuccessfulSearchCheckinsResponse = SuccessfulFoursquareResponse & {
  response: {
    checkins: {
      count: number;
      items: Array<{
        createdAt: number;
        venue: FoursquareVenue;
      }>;
    };
  };
};
