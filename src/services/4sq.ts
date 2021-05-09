import fetch from "node-fetch";
import yargs from "yargs";

import {
  SuccessfulFoursquareResponse,
  SuccessfulGetVenueChildernResponse,
  SuccessfulGetVenueResponse,
  SuccessfulVenueResponse,
} from "../types/4sq/response";

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

  async closeVenue({ venueId }: { venueId: string }): Promise<SuccessfulVenueResponse["response"]> {
    return (await this._post(`/venues/${venueId}/flag`, { problem: "closed" }))
      .response as SuccessfulVenueResponse["response"];
  }

  async deleteVenue({ venueId }: { venueId: string }): Promise<SuccessfulVenueResponse["response"]> {
    return (await this._post(`/venues/${venueId}/flag`, { problem: "doesnt_exist" }))
      .response as SuccessfulVenueResponse["response"];
  }

  async _get(path: string, params: { [x: string]: string } = {}): Promise<SuccessfulFoursquareResponse> {
    const paramsWithToken = Object.assign({ oauth_token: this.accessToken, locale: "ja", v: "20181127" }, params);

    const response = await fetch(`https://api.foursquare.com/v2${path}?${new URLSearchParams(paramsWithToken)}`);
    if (response.status >= 400) throw `request failed with ${response.status}`;

    return (await response.json()) as SuccessfulFoursquareResponse;
  }

  async _post(path: string, body: { [x: string]: string } = {}): Promise<SuccessfulFoursquareResponse> {
    const params = Object.assign({ oauth_token: this.accessToken, locale: "ja", v: "20181127" }, body);

    const response = await fetch(`https://api.foursquare.com/v2${path}?${new URLSearchParams(params)}`, {
      method: "POST",
    });
    if (response.status >= 400) throw `request failed with ${response.status}`;

    return (await response.json()) as SuccessfulFoursquareResponse;
  }
}

export function addFoursquareClientOptions<T extends yargs.Argv>(yargs: T) {
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

export function injectFoursqureClient({ foursquareAccessToken }: { foursquareAccessToken: string }) {
  return { foursquareClient: new FoursquareClient({ accessToken: foursquareAccessToken }) };
}
