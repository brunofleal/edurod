import moment from "moment";

interface OptionalParams {
    onlyDate?: boolean;
    onlyMonth?: boolean;
}
export const formatDateToLocalTime = (
    isoDate: string,
    { onlyDate = false }: OptionalParams
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
    moment.locale("pt-Br");
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");
    return [startOfMonth, endOfMonth];
};
