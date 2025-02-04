import { Box, IconButton, InputAdornment } from '@mui/material';
import { MdOutlineLocationOn, MdSwapHoriz, MdTripOrigin } from 'react-icons/md';
import type { AirportResult, SearchFlightOptions } from '../types';
import { AirportAutocomplete } from './AirportAutocomplete';

type Props = {
  searchData: SearchFlightOptions;
  handleSwapLocations: () => void;
  handleSearchDataChange: (
    key: 'destination' | 'origin',
  ) => React.Dispatch<React.SetStateAction<AirportResult | null>>;
};

/**
 * AirportsPicker component renders an interface for selecting origin and
 * destination airports with the ability to swap locations. It utilizes
 * the AirportAutocomplete component for airport selection.
 *
 * Props:
 * - `searchData`: An object containing the current search data, including
 *   origin and destination airports.
 * - `handleSwapLocations`: A callback function to swap the selected origin
 *   and destination airports.
 * - `handleSearchDataChange`: A function that returns a dispatch function
 *   to update the search data for either 'origin' or 'destination'.
 */

export const AirportsPicker = (props: Props) => {
  const { searchData, handleSwapLocations, handleSearchDataChange } = props;

  return (
    <>
      <Box display="flex" alignItems="center" gap={1}>
        <Box flex={1}>
          <AirportAutocomplete
            value={searchData.origin}
            icon={
              <InputAdornment position="start" sx={{ marginInlineStart: 0.5 }}>
                <MdTripOrigin size={16} />
              </InputAdornment>
            }
            label="From"
            onChange={handleSearchDataChange('origin')}
            showNearbyAirports
          />
        </Box>

        <Box>
          <IconButton
            onClick={handleSwapLocations}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <MdSwapHoriz />
          </IconButton>
        </Box>

        <Box flex={1}>
          <AirportAutocomplete
            value={searchData.destination}
            icon={
              <InputAdornment position="start">
                <MdOutlineLocationOn size={28} />
              </InputAdornment>
            }
            label="To"
            onChange={handleSearchDataChange('destination')}
          />
        </Box>
      </Box>
    </>
  );
};
