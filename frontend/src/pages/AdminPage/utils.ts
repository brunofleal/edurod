import type { ColDef } from "ag-grid-community";

export const createColDefsFromData = (data: any) => {
    if (!data) {
        return [];
    }
    const colDefs: ColDef[] = [];
    const defaultColDef: ColDef = { width: 200 };
    console.log({ data });
    for (const property of Object.keys(data)) {
        const colDef: ColDef = { ...defaultColDef, field: property };
        colDefs.push(colDef);
    }
    return colDefs;
};
