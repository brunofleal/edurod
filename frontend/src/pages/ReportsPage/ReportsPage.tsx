import React, { useEffect, useState } from "react";
import AgGrid from "../../components/AgGrid/AgGrid";
import { colDefs, defaultColumnDef } from "./setup/constants";
import { HStack } from "@chakra-ui/react";
import DateScroller, {
    type Period,
} from "../../components/DateScroller/DateScroller";
import { useFetch } from "../../shared/hooks/useFetch";
import { useNavigate, useSearchParams } from "react-router";
import ExportXLSX from "../../components/ExportXLSX/ExportXLSX";
import type { GridApi } from "ag-grid-community";

const ReportsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [period, setPeriod] = useState<Period>();
    const { data, loading } = useFetch(
        `/api/driversReport?startDate=${startDate ?? ""}&endDate=${endDate ?? ""}`
    );
    const rowData = data ? data.data : [];

    useEffect(() => {
        if (startDate && endDate) {
            setPeriod({ start: startDate, end: endDate });
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if (period?.start && period?.end) {
            navigate(
                `/reports?startDate=${period?.start}&endDate=${period?.end}`
            );
        }
    }, [period?.start, period?.end]);

    return (
        <AgGrid
            title={"Ocorrências acumaladas por Motorista"}
            gridButtons={
                <HStack>
                    <DateScroller value={period} setValue={setPeriod} />
                    <ExportXLSX
                        gridApi={gridApi}
                        period={period}
                        title="Relatório de Motoristas"
                        subtitle="Ocorrências acumuladas por motorista"
                        fileName={`Relatorio_Motoristas_${period?.start}_${period?.end || "registros"}.xlsx`}
                    />
                </HStack>
            }
            rowData={rowData}
            loading={loading}
            height="85vh"
            columnDefs={colDefs}
            defaultColDef={defaultColumnDef}
            autoSizeStrategy={{
                type: "fitGridWidth",
                defaultMinWidth: 100,
            }}
            onGridReady={({ api }) => {
                setGridApi(api);
            }}
        />
    );
};

export default ReportsPage;
