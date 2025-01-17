"use client";
import { CalendarIcon } from "@/components/Icons";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { pickersDayClasses } from "@mui/x-date-pickers/PickersDay/pickersDayClasses";

type ExtendedDatePickerProps = DatePickerProps<Date> & {
  sizeField: "small" | "medium";
};

export const DatePickerField = ({
  sizeField,
  ...props
}: ExtendedDatePickerProps) => (
  <DatePicker
    {...props}
    slots={{
      openPickerIcon: CalendarIcon,
    }}
    slotProps={{
      openPickerButton: {
        sx: { color: "#666666" },
      },
      textField: { size: sizeField },
      day: {
        sx: {
          [`&.${pickersDayClasses.selected}`]: {
            backgroundColor: "#FF3ED9 !important",
          },
          [`&.${pickersDayClasses.today}`]: {
            border: "1px solid #FF3ED9",
          },
        },
      },
      yearButton: {
        sx: {
          [`&.${pickersDayClasses.selected}`]: {
            backgroundColor: "#FF3ED9 !important",
          },
          [`&.${pickersDayClasses.today}`]: {
            border: "1px solid #FF3ED9",
          },
        },
      },
    }}
  />
);
