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
      level?: Selector<number> | number;
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
