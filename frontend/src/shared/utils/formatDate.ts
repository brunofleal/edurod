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

export const formatDateDDMMYY = (dateString: string): string => {
    return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
};

export const getCurrentMonthRange = () => {
    moment.locale("pt-Br");
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");
    return [startOfMonth, endOfMonth];
};
