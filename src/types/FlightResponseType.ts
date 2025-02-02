import type { APIResponse } from "./APIResponseType";
import type { Carrier } from "./CarrierType";
import type { Itinerary } from "./ItineraryType";

export type FlightResult = {
  context: {
    status: "incomplete" | string;
    sessionId: string;
    totalResults: number;
  };
  itineraries: Itinerary[];
  messages: unknown[];
  filterStats: {
    duration: {
      min: number;
      max: number;
      multiCityMin: number;
      multiCityMax: number;
    };
    airports: {
      city: string;
      airports: {
        id: string;
        entityId: string;
        name: string;
      }[];
    }[];
    carriers: Carrier[];
    stopPrices: {
      direct: { isPresent: boolean; formattedPrice: string };
      one: { isPresent: boolean; formattedPrice: string };
      twoOrMore: { isPresent: boolean };
    };
  };
  flightsSessionId: string;
  destinationImageUrl: string;
};

export type FlightResponse = APIResponse<FlightResult[]>;