import { FoursquareVenue } from "./resource";

export type SuccessfulFoursquareResponse = {
  meta: {
    code: 200;
    requestId: string;
  };
  response: {
    [x: string]: unknown;
  };
};

export type SuccessfulGetVenueChildernResponse = SuccessfulFoursquareResponse & {
  response: {
    children: {
      groups: { items: FoursquareVenue[] }[];
    };
  };
};
