import { Button, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AgGrid from "../../components/AgGrid/AgGrid";
import { colDefs, defaultColumnDef } from "./setup/constants";
import NewOccurrenceModal from "./NewOccurrenceModal/NewOccurrenceModal";
import { useFetch } from "../../shared/hooks/useFetch";
import { OccurrenceProvider } from "./OccurrenceContext";
import type { GridApi } from "ag-grid-community";
import DateScroller, {
    type Period,
} from "../../components/DateScroller/DateScroller";
import { useNavigate, useSearchParams } from "react-router";
import ExportXLSX from "../../components/ExportXLSX/ExportXLSX";

const OccurrencesPages = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const driver = searchParams.get("driver");

    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [period, setPeriod] = useState<Period>();

    const { data, loading, refetch } = useFetch(
        `/api/occurrences?startDate=${startDate ?? ""}&endDate=${endDate ?? ""}`
    );

    const rowData = data ? data.data : [];

    useEffect(() => {
        if (startDate && endDate) {
            setPeriod({ start: startDate, end: endDate });
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if (
            period?.start !== startDate &&
            period?.end !== endDate &&
            period?.start &&
            period?.end
        ) {
            navigate(
                `/occurrences?startDate=${period?.start}&endDate=${period?.end}&driver=${driver ?? ""}`
            );
        }
    }, [period?.start, period?.end]);

    useEffect(() => {
        if (driver && gridApi) {
            const currentFilter = gridApi.getFilterModel();
            const driverName = {
                filterType: "text",
                type: "contains",
                filter: driver,
            };
            gridApi.setFilterModel({
                ...currentFilter,
                "driver.name": driverName,
            });
        }
    }, [driver, gridApi]);

    return (
        <OccurrenceProvider refetch={refetch}>
            <HStack>
                <AgGrid
                    gridButtons={
                        <HStack>
                            <DateScroller value={period} setValue={setPeriod} />
                            <ExportXLSX
                                gridApi={gridApi}
                                period={period}
                                fileName={`Relatório_${period?.start}-${period?.end}_${driver ?? ""}.xlsx`}
                                title={`Relatório de Ocorrências`}
                                subtitle={driver ? `Motorista: ${driver}` : ""}
                            />
                            <NewOccurrenceModal mode="create" />
                        </HStack>
                    }
                    title="Ocorrências"
                    width={"100vw"}
                    height={"85vh"}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColumnDef}
                    loading={loading}
                    onGridReady={({ api }) => {
                        setGridApi(api);
                    }}
                />
            </HStack>
        </OccurrenceProvider>
    );
};

export default OccurrencesPages;
