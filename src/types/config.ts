import { NavigationOptions } from "puppeteer";

import { ScrapeProperties } from "../scrapedVenue";

export type Config = Venue & {
  subvenues: Venue[];
  linker: Linker;
  scraper: ReadonlyArray<ScrapeConfig | Scraper>;
};

type Venue = {
  id: string;
  name: string;
};

type Linker = {
  ignore: string[];
};

export type ScrapeConfig = {
  url: string;
  options?: NavigationOptions;
  venues: {
    [classPath: string]: {
      [key in keyof ScrapeProperties]: ScrapeProperties[key] extends infer U ? Selector<Exclude<U, undefined>> : never;
    } & {
      followLink?: Selector;
    };
  };
};

type Selector<T = string> = ClassSelector<T> | XPathSelector<T>;

type ClassSelector<T> = {
  selector: string;
  property?: string;
} & SelectorOption<T>;

type XPathSelector<T> = {
  xpath: string;
} & SelectorOption<T>;

type SelectorOption<T> = {
  modifier?: Modifier<T>;
  nullable?: true;
};

type Modifier<T> = (name: string) => T | undefined;

type Scraper = {
  fetch: FetchFunction;
};
type FetchFunction = () => Promise<any>; // actually Venue class
