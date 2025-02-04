import { useCallback, useMemo, useState } from 'react';
import { searchFormSchema } from '../schemas/SearchFormSchema';
import { searchFlights } from '../services/AirScraperService';
import type { FlightResult, SearchFlightOptions, TripType } from '../types';
import { CabinClass } from '../types';

/**
 * useSearchForm hook manages the state and logic for searching flights.
 *
 * It returns an object with the following properties:
 * - `loading`: A boolean indicating whether the search is currently running.
 * - `result`: The result of the search query, or null if the search is not
 *   successful, or if the search is not yet complete.
 * - `tripType`: The trip type selected by the user, either 'one-way' or
 *   'round-trip'.
 * - `searchData`: The current search data, including origin, destination,
 *   date, return date, cabin class, and passenger count.
 * - `isFormValid`: A boolean indicating whether the search form is valid.
 * - `setTripType`: A function to update the trip type.
 * - `handleSearch`: A function to perform the search. It returns a promise
 *   that resolves with the search result.
 * - `handleSwapLocations`: A function to swap the origin and destination.
 * - `handleSearchDataChange`: A function that returns a dispatch function to
 *   update the search data. The dispatch function takes a key and a value, or
 *   a function that takes the current value and returns a new value.
 */
export const useSearchForm = () => {
  const [tripType, setTripType] = useState<TripType>('round-trip');
  const [searchData, setSearchData] = useState<SearchFlightOptions>({
    origin: null,
    destination: null,
    date: null,
    returnDate: null,
    cabinClass: CabinClass.Economy,
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FlightResult | null>(null);
  const { success: isFormValid } = useMemo(
    () => searchFormSchema.safeParse({ ...searchData, tripType }),
    [searchData, tripType],
  );
  /**
   * handleSearch performs the search query. It returns a promise that resolves
   * with the search result. If the form is invalid, it does not perform the
   * search and returns immediately.
   *
   * Todo: Improve error handling. Currently, if the search fails, it only logs
   * an error to the console. It should probably display a descriptive error to
   * the user and focus on the relevant input.
   */
  async function handleSearch() {
    try {
      if (!isFormValid) return; // Todo: Descriptive error / focus on relevant input
      setLoading(true);
      const result = await searchFlights(searchData);
      setResult(result);
    } catch (e) {
      console.error(e);
      // Todo: Handle errors gracefully
    } finally {
      setLoading(false);
    }
  }
  const handleSwapLocations = useCallback(() => {
    setSearchData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  }, []);
  const handleSearchDataChange = useCallback(
    <K extends keyof SearchFlightOptions>(
      key: K,
    ): React.Dispatch<React.SetStateAction<(typeof searchData)[K]>> =>
      (dispatch) =>
        setSearchData((prev) => ({
          ...prev,
          [key]: typeof dispatch !== 'function' ? dispatch : dispatch(prev[key]),
        })),
    [],
  );
  return {
    loading,
    result,
    tripType,
    searchData,
    isFormValid,
    setTripType,
    handleSearch,
    handleSwapLocations,
    handleSearchDataChange,
  };
};
