//
export type FoursquareVenue = {
  id: string;
  name: string;
  location: Location;
  categories: Category[];
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
export type DetailedFoursquareVenue = FoursquareVenue & {};
