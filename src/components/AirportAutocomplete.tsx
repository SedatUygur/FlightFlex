import { Autocomplete, TextField } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getNearbyAirports, searchAirport } from '../services/AirScraperService';
import type { AirportResult } from '../types';
type Props = {
  value: AirportResult | null;
  icon?: React.ReactNode;
  label: string;
  onChange: (newValue: AirportResult) => void;
  showNearbyAirports?: boolean;
};
/**
 * AirportAutocomplete component provides an input field with autocomplete
 * functionality for searching and selecting airports. It supports displaying
 * nearby airports based on the user's geolocation or input search queries.
 *
 * Props:
 * - `value`: Current selected airport.
 * - `icon`: Icon to display within the input field.
 * - `label`: Label for the input field.
 * - `onChange`: Callback triggered when an airport is selected.
 * - `showNearbyAirports`: Flag to show nearby airports based on geolocation.
 *
 * The component uses a debounced input handler to fetch and display airport
 * options. It also manages loading state during async operations.
 */

export const AirportAutocomplete = (props: Props) => {
  const { value, icon, label, onChange, showNearbyAirports } = props;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialRender = useRef(true);
  const [options, setOptions] = useState<AirportResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!showNearbyAirports) return;
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { current, nearby } = await getNearbyAirports(position.coords);
      if (initialRender.current) {
        onChange(current);
        initialRender.current = false;
      }
      setOptions(nearby);
    });
  }, [onChange, showNearbyAirports]);
  const handleInput = useCallback((e: React.SyntheticEvent) => {
    setLoading(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      try {
        const input = e.target as HTMLInputElement;
        const airports = await searchAirport(input.value);
        setOptions(airports);
        timeoutRef.current = null;
      } catch (e) {
        console.error(e);
        // Handle errors gracefully
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);
  /**
   * Checks if the input element has a search value and sets the isOpen state accordingly.
   * This is used to determine whether to show the autocomplete options or not.
   * @param {React.SyntheticEvent} e - The event emitted when the input element is focused or blurred.
   */
  function handleShouldOpen(e: React.SyntheticEvent) {
    const hasSearchValue = (e.target as HTMLInputElement).value.trim().length > 0;
    setIsOpen(hasSearchValue);
  }
  return (
    <Autocomplete<AirportResult>
      value={value}
      onChange={(_e, newValue) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        newValue && onChange(newValue);
        setIsOpen(false);
      }}
      onFocus={handleShouldOpen}
      onBlur={() => setIsOpen(false)}
      options={options}
      getOptionLabel={(option) => (option ? option.presentation.suggestionTitle : '')}
      open={!loading && isOpen}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          onChange={(e) => {
            handleInput(e);
            handleShouldOpen(e);
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: icon,
              endAdornment: null,
            },
          }}
        />
      )}
    />
  );
};
