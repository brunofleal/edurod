import type { ColDef } from "ag-grid-community";
import AgGrid from "../../components/AgGrid/AgGrid";
import { useFetch } from "../../shared/hooks/useFetch";
import { createColDefsFromData } from "./utils";

interface PanelProps {
    url: string;
}
const PanelGrid = ({ url }: PanelProps) => {
    const { data, loading } = useFetch<any>(url);

    const rowData = data ? data.data : [];

    const colDefs: ColDef[] = createColDefsFromData(
        rowData ? rowData[0] : undefined
    );

    return (
        <AgGrid
            width={"90vw"}
            rowData={rowData}
            columnDefs={colDefs}
            loading={loading}
        />
    );
};

export default PanelGrid;
