import puppeteer, { WaitForOptions } from "puppeteer";

import { ScrapedProperties } from "../scraper";

export type Config<T = ScrapedProperties> = Venue & {
  subvenues: Venue[];
  linker: Linker;
  scraper: ReadonlyArray<ScrapeConfig<T> | Fetcher<T>>;
};

type Venue = {
  id: string;
  name: string;
};

type Linker = {
  ignore: string[];
};

export type ScrapeConfig<T = ScrapedProperties> = {
  url: string;
  options?: WaitForOptions;
  venues: {
    [classPath: string]: ScrapePropertiesConfig<T>;
  };
};

export type ScrapePropertiesConfig<T = ScrapedProperties> = {
  name: Selector<string>;
  followLink?: Selector;
  skip?: (element: puppeteer.ElementHandle<Element>) => Promise<boolean>;
} & {
  [key in keyof T]?: T[key] extends infer U ? Selector<Exclude<U, undefined>> | U : never;
};

// FIXME: actually T extends string | number but it shows error of typescript
export type Selector<T = string> = ClassSelector<T> | XPathSelector<T>;

type ClassSelector<T> = {
  selector: string;
} & SelectorOption<T>;

type XPathSelector<T> = {
  xpath: string;
} & SelectorOption<T>;

type SelectorOption<T> = {
  property?: string;
  modifier?: Modifier<T>;
  nullable?: true;
};

type Modifier<T> = (name: string) => T | undefined;

type Fetcher<T> = {
  fetch: FetchFunction<T>;
};
type FetchFunction<T> = () => Promise<T[]>;
