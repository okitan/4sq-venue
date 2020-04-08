import { NavigationOptions } from "puppeteer";

import { ScrapedProperties } from "../scraper";

export type Config = Venue & {
  subvenues: Venue[];
  linker: Linker;
  scraper: ReadonlyArray<ScrapeConfig | Fetcher>;
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
      [key in keyof ScrapedProperties]+?: ScrapedProperties[key] extends infer U
        ? Selector<Exclude<U, undefined>> | U
        : never;
    } & {
      followLink?: Selector;
    };
  };
};

// FIXME: actually T extends string | number but it shows error of typescript
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

type Fetcher = {
  fetch: FetchFunction;
};
type FetchFunction = () => Promise<any>; // actually Venue class
