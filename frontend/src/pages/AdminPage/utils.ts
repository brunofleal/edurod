import type { ColDef } from "ag-grid-community";

export const createColDefsFromData = (data: any) => {
    const ignoredProperties = ["password", "_id", "__v"];
    if (!data) {
        return [];
    }
    const colDefs: ColDef[] = [];
    const defaultColDef: ColDef = {
        minWidth: 100,
        flex: 1,
        resizable: true,
        sortable: true,
    };
    for (const property of Object.keys(data)) {
        if (!ignoredProperties.includes(property)) {
            const colDef: ColDef = { ...defaultColDef, field: property };
            colDefs.push(colDef);
        }
    }
    return colDefs;
};
