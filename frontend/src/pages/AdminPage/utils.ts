import type { ColDef } from "ag-grid-community";
import { formatDateToLocalTime } from "../../shared/utils/formatDate";

export const createColDefsFromData = (data: any, parentKey = "") => {
    const ignoredProperties = ["password", "_id", "__v"];
    const dateProperties = [
        "date",
        "Date",
        "createdAt",
        "updateAt",
        "timestamp",
    ];
    if (!data) {
        return [];
    }
    const colDefs: ColDef[] = [];
    const defaultColDef: ColDef = {
        minWidth: 150,
        flex: 1,
        resizable: true,
        sortable: true,
        filter: true,
    };
    for (const property of Object.keys(data)) {
        if (!ignoredProperties.includes(property)) {
            const value = data[property];
            const fieldName = parentKey ? `${parentKey}.${property}` : property;
            if (
                value &&
                typeof value === "object" &&
                !Array.isArray(value) &&
                value !== null
            ) {
                // Recursively add sub-properties
                colDefs.push(...createColDefsFromData(value, fieldName));
            } else {
                const colDef: ColDef = {
                    ...defaultColDef,
                    field: fieldName,
                    ...(dateProperties.some((dateP) =>
                        fieldName.includes(dateP)
                    )
                        ? {
                              valueGetter: ({ data }) =>
                                  formatDateToLocalTime(
                                      fieldName
                                          .split(".")
                                          .reduce(
                                              (acc, key) => acc && acc[key],
                                              data
                                          ),
                                      { onlyDate: false }
                                  ),
                          }
                        : {}),
                };
                colDefs.push(colDef);
            }
        }
    }
    return colDefs;
};
