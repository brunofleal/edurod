import type { ColDef } from "ag-grid-community";
import AgGrid from "../../components/AgGrid/AgGrid";
import { useFetch } from "../../shared/hooks/useFetch";
import { createColDefsFromData } from "./utils";
import { getEditDeleteActionsColDef } from "./setup/colDefs";

interface PanelProps {
    url: string;
}
const PanelGrid = ({ url }: PanelProps) => {
    const { data, loading, refetch } = useFetch<any>(url);

    const rowData = data ? data.data : [];

    const colDefs: ColDef[] = createColDefsFromData(
        rowData ? rowData[0] : undefined
    );
    const editDeleteColDef = getEditDeleteActionsColDef(url, refetch);

    return (
        <AgGrid
            width={"90vw"}
            height={"75vh"}
            rowData={rowData}
            columnDefs={[...colDefs, editDeleteColDef]}
            loading={loading}
        />
    );
};

export default PanelGrid;
