import type { ColDef } from "ag-grid-community";
import { formatDateToLocalTime } from "../../shared/utils/formatDate";

export const createColDefsFromData = (data: any) => {
    const ignoredProperties = ["password", "_id", "__v"];
    if (!data) {
        return [];
    }
    const colDefs: ColDef[] = [];
    const defaultColDef: ColDef = {
        minWidth: 150,
        flex: 1,
        resizable: true,
        sortable: true,
    };
    for (const property of Object.keys(data)) {
        if (!ignoredProperties.includes(property)) {
            if (property.includes("Date")) {
            }
            const colDef: ColDef = {
                ...defaultColDef,
                field: property,
                ...(property.includes("Date")
                    ? {
                          valueGetter: ({ data }) =>
                              formatDateToLocalTime(data[property], {
                                  onlyDate: false,
                              }),
                      }
                    : {}),
            };
            colDefs.push(colDef);
        }
    }
    return colDefs;
};
