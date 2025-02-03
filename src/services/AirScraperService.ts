import axios from 'axios';
import { searchFlightsParamsSchema } from '../schemas/SearchFlightParamsSchema';
import type {
  AirportResponse,
  FlightResponse,
  NearbyAirportsResponse,
  NearbyAirportsResult,
  SearchFlightOptions,
} from '../types';
import { APIResponseCache } from '../utils/APIResponseCache';

const clientV1 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_RapidAPI_BaseURL,
  headers: {
    'x-rapidapi-host': process.env.NEXT_PUBLIC_RapidAPI_HOST,
    'x-rapidapi-key': process.env.NEXT_PUBLIC_RapidAPI_KEY,
  },
});

export async function searchFlights({
  origin,
  destination,
  ...options
}: SearchFlightOptions) {
  const params = searchFlightsParamsSchema.parse({
    ...options,
    originSkyId: origin?.skyId,
    originEntityId: origin?.entityId,
    destinationSkyId: destination?.skyId,
    destinationEntityId: destination?.entityId,
  });

  const { data } = await clientV1.get<FlightResponse>('/searchFlights', { params });

  return data.data;
}

export async function searchAirport(query: string) {
  if (!query.trim()) return [];
  const params = { query };
  const cache = new APIResponseCache<AirportResponse>(query);
  const getter = () => clientV1.get<AirportResponse>('/searchAirport', { params });

  const { data } = cache.response || (await getter());
  cache.store(data);
  return data.data;
}

export async function getNearbyAirports({
  latitude,
  longitude,
}: GeolocationCoordinates): Promise<NearbyAirportsResult> {
  const params = { lng: longitude, lat: latitude };
  const cacheKey = [longitude.toFixed(2), latitude.toFixed(2)].join(','); // ~1km proximity
  const cache = new APIResponseCache<NearbyAirportsResponse>(cacheKey);

  const getter = () =>
    clientV1.get<NearbyAirportsResponse>('/getNearByAirports', { params });
  const { data } = cache.response || (await getter());
  cache.store(data);
  return data.data;
}
