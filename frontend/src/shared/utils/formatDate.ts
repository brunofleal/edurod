import moment from "moment";

interface OptionalParams {
  onlyDate: boolean;
}
export const formatDateToLocalTime = (
  isoDate: string,
  { onlyDate = false }: OptionalParams,
) => {
  const date = new Date(isoDate);
  if (onlyDate) {
    return date.toLocaleString("pt-Br", {
      dateStyle: "short",
    });
  }
  return date.toLocaleString("pt-Br", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

export const getCurrentMonthRange = () => {
  const startOfMonth = moment().startOf("month");
  const endOfMonth = moment().endOf("month").subtract("hour", 1);
  return [startOfMonth, endOfMonth];
};
