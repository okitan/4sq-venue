//
export type FoursquareVenue = {
  id: string;
  name: string;
  location: Location;
  categories: Category[];
  flags: {
    count: number;
  };
};

// TODO: declare when I use
type Location = {
  postalCode: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  crossStreet: string | null;
  lat: number;
  lng: number;
};
type Category = {};

// https://developer.foursquare.com/docs/api-reference/venues/details/
export type DetailedFoursquareVenue = FoursquareVenue & {
  likes: {
    count: number;
  };
  beenHere: {
    count: number;
  };
  photos: {
    count: number;
  };
  reasons: {
    count: number;
  };
  tips: {
    count: number;
  };
  listed: {
    count: number;
  };
};
