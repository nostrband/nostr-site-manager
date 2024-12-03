import { format, parseISO } from "date-fns";

export const reorder = <T>(
  list: T[],
  startIndex: number,
  endIndex: number,
): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const getDateTime = (dateString: string) => {
  const date = parseISO(dateString);
  const formattedDate = format(date, "MMM d, yyyy HH:mm");

  return formattedDate;
};
