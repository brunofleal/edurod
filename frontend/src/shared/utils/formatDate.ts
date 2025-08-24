export const formatDateToLocalTime = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString("pt-Br", {
    dateStyle: "short",
    timeStyle: "short",
  });
};
