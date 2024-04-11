import yargs from "yargs";

import { Extract } from "../cli";
import { addFoursquareClientOptions } from "../services/4sq";
import dayjs from "dayjs";

export const command = "list [Options]";
export const description = "list checkins of a day";

export function builder<T>(yargs: yargs.Argv<T>) {
  return addFoursquareClientOptions(yargs).options({
    after: { type: "number", default: 2009 },
    date: { type: "string", default: dayjs().format("MM-DD"), demandOption: true },
  });
}

export async function handler({ foursquareClient, after, date }: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const thisYear = new Date().getFullYear();

  for (const year of new Array(thisYear - after + 1).fill(0).map((_, i) => after + i)) {
    const t = dayjs(`${year}-${date}`);

    const { checkins } = await foursquareClient.searchCheckins({
      beforeTimestamp: t.hour(23).minute(59).second(59).unix().toString(),
      afterTimestamp: t.hour(0).minute(0).second(0).unix().toString(),
    });

    if (checkins.count) {
      console.log(`${t.format("YYYY-MM-DD")}: ${checkins.count} checkins`);
      checkins.items.forEach((item) => {
        console.log(`${dayjs.unix(item.createdAt).format("HH:mm")} ${item.venue.name}`);
      });
      console.log("");
    }
  }
}
