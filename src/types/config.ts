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

type Scraper = {
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
  modifier?: Modifier;
};

type XPathSelector = {
  xpath: string;
  modifier?: Modifier;
};

type Modifier = (name: string) => string | undefined;
