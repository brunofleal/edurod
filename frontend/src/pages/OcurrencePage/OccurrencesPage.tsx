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

const OccurrencesPages = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [period, setPeriod] = useState<Period>();

    const { data, loading, refetch } = useFetch(
        `/api/occurrences?startDate=${startDate ?? ""}&endDate=${endDate ?? ""}`
    );

    const rowData = data ? data.data : [];

    const toggleFilterStatus = () => {
        if (!gridApi) return;

        const currentFilter = gridApi.getFilterModel();
        const isResolved =
            currentFilter?.isResolved?.type !== "true"
                ? {
                      filterType: "text",
                      type: currentFilter?.isResolved?.type ? "true" : "false",
                  }
                : {};
        gridApi.setFilterModel({
            ...currentFilter,
            isResolved,
        });
    };

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
                `/occurrences?startDate=${period?.start}&endDate=${period?.end}`
            );
        }
    }, [period?.start, period?.end]);

    return (
        <OccurrenceProvider refetch={refetch}>
            <HStack>
                <AgGrid
                    gridButtons={
                        <HStack>
                            <DateScroller value={period} setValue={setPeriod} />
                            <Button
                                variant={"outline"}
                                onClick={() => toggleFilterStatus()}
                            >
                                Aberto / Fechado
                            </Button>
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
