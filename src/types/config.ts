export type Config = Venue & {
  subvenues: Venue[];
  linker: Linker;
  scraper: Scraper[];
};

type Venue = {
  id: string;
  name: string;
};

type Linker = {
  ignore: string[];
};

type Scraper = {
  url: string;
  venues: {
    [classPath: string]: {
      followLink?: Selector;
      name: Selector;
      phone?: Selector;
      level?: Selector | number;
    };
  };
};

type Selector = {
  selector: string;
  property?: string;
};
