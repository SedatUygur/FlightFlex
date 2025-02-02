import type { AirportResult } from "./AirportResponseType";
import type { APIResponse } from "./APIResponseType";

export type NearbyAirportsResult = {
  current: AirportResult;
  nearby: AirportResult[];
  recent: object[];
};

export type NearbyAirportsResponse = APIResponse<NearbyAirportsResult>;