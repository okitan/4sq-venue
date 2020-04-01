import { NavigationOptions } from "puppeteer";

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

export type Scraper = {
  url: string;
  options?: NavigationOptions;
  venues: {
    [classPath: string]: {
      followLink?: Selector;
      name: Selector;
      altName?: Selector;
      phone?: Selector;
      level?: Selector | number;
    };
  };
};

type Selector = ClassSelector | XPathSelector;

type ClassSelector = {
  selector: string;
  property?: string;
} & SelectorOption;

type XPathSelector = {
  xpath: string;
} & SelectorOption;

type SelectorOption = {
  modifier?: Modifier;
  nullable?: true;
};

type Modifier = (name: string) => string | undefined;
