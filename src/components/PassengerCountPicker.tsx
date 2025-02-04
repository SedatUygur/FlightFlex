import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { MdAdd, MdArrowDropDown, MdPerson, MdRemove } from 'react-icons/md';
import type { SearchFlightOptions } from '../types';

type Props = {
  passengers: SearchFlightOptions['passengers'];
  setPassengers: React.Dispatch<React.SetStateAction<SearchFlightOptions['passengers']>>;
};

/**
 * PassengerCountPicker component renders a clickable TextField that opens a Popover
 * for selecting the number of passengers for a flight search. It displays the total
 * number of passengers and supports incrementing and decrementing the number of
 * adults and children.
 *
 * Props:
 * - `setPassengers`: A dispatch function to update the state of passengers.
 * - `passengers`: An object with the current number of adults, children and infants.
 *
 * The component manages its own state and uses the `useRef` hook to keep track of the
 * original passenger count, so that it can be restored when the user clicks the
 * "Cancel" button.
 */
const PassengerCountPicker = ({ setPassengers, passengers }: Props) => {
  const originalValue = useRef<typeof passengers | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  /**
   * Handles the click event for the passenger count input field. It saves the
   * original passenger count in the `originalValue` ref and sets the anchor for
   * the Popover to the element that was clicked.
   */
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    originalValue.current = passengers;
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the passenger count popover. If the action is a cancel operation and the
   * original passenger count is available, it restores the count to its original value.
   * Resets the popover anchor and clears the original value.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} e - The click event that triggered the close action.
   */

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.dataset.cancel && originalValue.current) {
      setPassengers(originalValue.current);
    }
    setAnchorEl(null);
    originalValue.current = null;
  };

  /**
   * Increments the count of a specified type of passenger (adults, children, or infants).
   *
   * @param {keyof typeof passengers} type - The type of passenger to increment.
   */

  const handleIncrement = (type: keyof typeof passengers) => {
    setPassengers((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  /**
   * Decrements the count of a specified type of passenger (adults, children, or infants).
   * It ensures that the count is not decremented below 0, and also ensures that the count
   * of adults is not decremented below 1.
   *
   * @param {keyof typeof passengers} type - The type of passenger to decrement.
   */
  const handleDecrement = (type: keyof typeof passengers) => {
    if (passengers[type] > (type === 'adults' ? 1 : 0)) {
      setPassengers((prev) => ({
        ...prev,
        [type]: prev[type] - 1,
      }));
    }
  };

  const open = Boolean(anchorEl);

  const totalPassengers = Object.values(passengers).reduce((a, b) => a + b, 0);

  return (
    <>
      <TextField
        onClick={handleClick}
        type="button"
        variant="filled"
        focused={open}
        value={totalPassengers}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <MdPerson size={20} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="start"
                sx={{ transform: open ? 'rotate(180deg)' : undefined }}
              >
                <MdArrowDropDown size={24} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              padding: 2,
            },
          },
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1">Adults</Typography>
            <Typography variant="caption" color="text.secondary">
              Age 13+
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              size="small"
              onClick={() => handleDecrement('adults')}
              disabled={passengers.adults <= 1}
              sx={{
                bgcolor: 'action.hover',
                '&:hover': { bgcolor: 'action.selected' },
              }}
            >
              <MdRemove size={20} />
            </IconButton>
            <Typography minWidth={24} textAlign="center">
              {passengers.adults}
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleIncrement('adults')}
              sx={{
                bgcolor: 'action.hover',
                '&:hover': { bgcolor: 'action.selected' },
              }}
            >
              <MdAdd size={20} />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            mt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 2,
          }}
        >
          <Button onClick={handleClose} data-cancel color="inherit">
            Cancel
          </Button>
          <Button onClick={handleClose} variant="text">
            Done
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default PassengerCountPicker;
