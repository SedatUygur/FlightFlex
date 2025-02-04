import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';

interface Props extends DatePickerProps<Dayjs> {
  label: string;
  value: Dayjs | null;
  onSelectDate: (value: Dayjs | null) => void;
}

/**
 * A component that renders a date picker for selecting flight dates.
 *
 * @param {string} label - The label for the date picker input.
 * @param {Dayjs | null} value - The current selected date value.
 * @param {(value: Dayjs | null) => void} onSelectDate - Callback function called with the selected date.
 * @param {Props} props - Additional props that can be passed to the DatePicker component.
 */

export const FlightDatePicker = ({ label, value, onSelectDate, ...props }: Props) => {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onSelectDate}
      slotProps={{
        textField: {
          fullWidth: true,
        },
      }}
      {...props}
    />
  );
};
