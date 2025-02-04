import { InputAdornment, MenuItem, SvgIcon, TextField } from '@mui/material';
import { useRef } from 'react';
import { TbArrowNarrowRight, TbArrowsUpDown } from 'react-icons/tb';
import type { TripType } from '../types';

type Props = {
  tripType: TripType;
  setTripType: React.Dispatch<React.SetStateAction<TripType>>;
};

/**
 * A component that renders a dropdown menu for selecting a trip type (round trip or one-way).
 * It uses a MUI TextField with a custom startAdornment that displays a rotating arrow icon
 * depending on the selected trip type. The component also handles the case where the user
 * clicks on the select icon, which would normally open the dropdown menu, but in this case
 * is used to toggle the trip type.
 *
 * @param {{ tripType: TripType, setTripType: React.Dispatch<React.SetStateAction<TripType>> }} props
 * @returns {JSX.Element}
 */
export const TripTypePicker = ({ tripType, setTripType }: Props) => {
  const selectRef = useRef<HTMLDivElement | null>(null);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const isRoundTrip = tripType === 'round-trip';

  /**
   * Handles the case where the user clicks on the select icon, which would normally
   * open the dropdown menu, but in this case is used to toggle the trip type.
   * @param {React.SyntheticEvent} e - The event emitted when the user clicks on the select icon.
   */
  const handleAdornmentClick = (e: React.SyntheticEvent) => {
    const selectTrigger = selectRef.current?.querySelector('.MuiSelect-select');
    if (selectTrigger) {
      if (e.currentTarget === selectTrigger) {
        (selectTrigger as HTMLElement).blur();
      }
      selectTrigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    }
  };

  return (
    <TextField
      variant="filled"
      select
      ref={selectRef}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start" onClick={handleAdornmentClick}>
              <SvgIcon sx={{ rotate: isRoundTrip ? '90deg' : undefined }}>
                {isRoundTrip ? <TbArrowsUpDown /> : <TbArrowNarrowRight />}
              </SvgIcon>
            </InputAdornment>
          ),
          sx: {
            cursor: 'pointer',
          },
          ref: textFieldRef,
          fullWidth: true,
        },
      }}
      value={tripType}
      onChange={(e) => setTripType(e.target.value as TripType)}
    >
      <MenuItem value="round-trip">Round trip</MenuItem>
      <MenuItem value="one-way">One-way</MenuItem>
    </TextField>
  );
};
