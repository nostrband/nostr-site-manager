"use client";
import { CalendarIcon } from "@/components/Icons";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";

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
    }}
  />
);
