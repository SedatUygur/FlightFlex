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

/**
 * Searches for flights given a set of search criteria.
 *
 * @param {SearchFlightOptions} options - Object containing search criteria.
 * @param {AirportResult} options.origin - The origin airport.
 * @param {AirportResult} options.destination - The destination airport.
 * @param {object} [options] - Any additional search criteria.
 * @returns {Promise<FlightResult[]>} - A promise that resolves to an array of flight results.
 */
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

/**
 * Searches for airports matching a given query string.
 *
 * @param {string} query - The search query for airport names or codes.
 * @returns {Promise<AirportResult[]>} - A promise that resolves to an array of matching airport results.
 */

export async function searchAirport(query: string) {
  if (!query.trim()) return [];
  const params = { query };
  const cache = new APIResponseCache<AirportResponse>(query);
  const getter = () => clientV1.get<AirportResponse>('/searchAirport', { params });

  const { data } = cache.response || (await getter());
  cache.store(data);
  return data.data;
}

/**
 * Finds nearby airports given a geolocation.
 *
 * @param {{ latitude: number, longitude: number }} coordinates - The geolocation coordinates.
 * @returns {Promise<NearbyAirportsResult>} - A promise that resolves to an array of nearby airports.
 */
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
