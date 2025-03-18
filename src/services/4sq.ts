import type yargs from "yargs";

import {
  SuccessfulFoursquareResponse,
  SuccessfulGetVenueChildernResponse,
  SuccessfulGetVenueResponse,
  SuccessfulSearchCheckinsResponse,
  SuccessfulVenueResponse,
  SuccessfulVenuesResponse,
} from "../types/4sq/response";
import { off } from "process";

export class FoursquareClient {
  accessToken: string;

  constructor({ accessToken }: Pick<FoursquareClient, "accessToken">) {
    this.accessToken = accessToken;
  }

  async getVenue({ venueId }: { venueId: string }): Promise<SuccessfulGetVenueResponse["response"]> {
    return (await this._get(`/venues/${venueId}`)).response as SuccessfulGetVenueResponse["response"];
  }

  async getVenueChildren({ venueId }: { venueId: string }): Promise<SuccessfulGetVenueChildernResponse["response"]> {
    return (await this._get(`/venues/${venueId}/children`)).response as SuccessfulGetVenueChildernResponse["response"];
  }

  async mergeVenue({
    mergerId,
    mergeeId,
  }: {
    mergerId: string;
    mergeeId: string;
  }): Promise<SuccessfulVenueResponse["response"]> {
    return (await this._post(`/venues/${mergerId}/flag`, { problem: "duplicate", venueId: mergeeId }))
      .response as SuccessfulVenueResponse["response"];
  }

  private async reportVenue({
    venueId,
    reason,
  }: {
    venueId: string;
    reason: string;
  }): Promise<SuccessfulVenueResponse["response"]> {
    return (await this._post(`/venues/${venueId}/flag`, { problem: reason }))
      .response as SuccessfulVenueResponse["response"];
  }

  async updateVenue({
    venueId,
    options,
  }: {
    venueId: string;
    options: { [x: string]: string };
  }): Promise<SuccessfulFoursquareResponse["response"]> {
    return (await this._post(`/venues/${venueId}/proposeedit`, options))
      .response as SuccessfulVenueResponse["response"];
  }

  async closeVenue({ venueId }: { venueId: string }): Promise<SuccessfulVenueResponse["response"]> {
    return this.reportVenue({ venueId, reason: "closed" });
  }

  async deleteVenue({ venueId }: { venueId: string }): Promise<SuccessfulVenueResponse["response"]> {
    return this.reportVenue({ venueId, reason: "doesnt_exist" });
  }

  async privateVenue({ venueId }: { venueId: string }): Promise<SuccessfulVenueResponse["response"]> {
    return this.reportVenue({ venueId, reason: "private" });
  }

  async searchCheckins(options: {
    beforeTimestamp: string;
    afterTimestamp: string;
    locale?: string;
  }): Promise<SuccessfulSearchCheckinsResponse["response"]> {
    return (await this._get("/users/self/historysearch", options))
      .response as SuccessfulSearchCheckinsResponse["response"];
  }

  async getCreatedVenues({
    userId,
    limit,
    offset,
    ...options
  }: {
    userId: string;
    limit?: number;
    offset?: number;
    locale?: string;
  }): Promise<SuccessfulVenuesResponse["response"]> {
    return (
      await this._get(`/users/${userId}/venues`, {
        limit: limit?.toString() ?? "100",
        offset: offset?.toString() ?? "0",
        ...options,
      })
    ).response as SuccessfulVenuesResponse["response"];
  }

  async _get(path: string, params: { [x: string]: string } = {}): Promise<SuccessfulFoursquareResponse> {
    const paramsWithToken = Object.assign({ oauth_token: this.accessToken, locale: "ja", v: "20181127" }, params);

    const response = await fetch(`https://api.foursquare.com/v2${path}?${new URLSearchParams(paramsWithToken)}`);
    if (response.status >= 400)
      throw new Error(`request failed with ${response.status} because of ${await response.json()}`);

    return (await response.json()) as SuccessfulFoursquareResponse;
  }

  async _post(path: string, body: { [x: string]: string } = {}): Promise<SuccessfulFoursquareResponse> {
    const params = Object.assign({ oauth_token: this.accessToken, locale: "ja", v: "20181127" }, body);

    const response = await fetch(`https://api.foursquare.com/v2${path}?${new URLSearchParams(params)}`, {
      method: "POST",
    });
    if (response.status >= 400)
      throw new Error(`request failed with ${response.status} because of ${JSON.stringify(await response.json())}`);

    return (await response.json()) as SuccessfulFoursquareResponse;
  }
}

export function addFoursquareClientOptions<T>(yargs: yargs.Argv<T>) {
  return yargs
    .options({
      foursquareAccessToken: {
        type: "string",
        default: process.env.FOURSQUARE_TOKEN as string, // with demandOption, yargs ensures non empty string
        defaultDescription: "$FOURSQUARE_TOKEN",
        demandOption: true,
      },
      // just for type hint
      foursquareClient: {
        default: new FoursquareClient({ accessToken: "" }),
        hidden: true,
      },
    })
    .middleware([injectFoursqureClient]);
}

export function injectFoursqureClient(
  args: { foursquareAccessToken: string } & { foursquareClient: FoursquareClient },
): void {
  args.foursquareClient = new FoursquareClient({ accessToken: args.foursquareAccessToken });
}
