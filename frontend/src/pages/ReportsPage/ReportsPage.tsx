import React, { useEffect, useState } from "react";
import AgGrid from "../../components/AgGrid/AgGrid";
import { colDefs, defaultColumnDef } from "./setup/constants";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import DateScroller, {
    type Period,
} from "../../components/DateScroller/DateScroller";
import { useFetch } from "../../shared/hooks/useFetch";
import { useNavigate, useSearchParams } from "react-router";
import ExportXLSX from "../../components/ExportXLSX/ExportXLSX";
import type { GridApi } from "ag-grid-community";
import { DriverReport } from "../../interfaces/driver";

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

    const getTotalBonus = () => {
        if (!rowData) {
            return 0;
        } else {
            return rowData.reduce(
                (total: number, row: DriverReport) => total + (row.bonus || 0),
                0
            );
        }
    };

    const getTotalOccurrences = () => {
        if (!rowData) {
            return 0;
        } else {
            return rowData.reduce(
                (total: number, row: DriverReport) =>
                    total + (row.totalOccurrences || 0),
                0
            );
        }
    };

    const getTotalOpenOccurrences = () => {
        if (!rowData) {
            return 0;
        } else {
            return rowData.reduce(
                (total: number, row: DriverReport) =>
                    total + (row.totalUnresolvedOccurrences || 0),
                0
            );
        }
    };

    return (
        <Box gap={2}>
            <Flex gap={2}>
                <InfoField label="Total de Bônus:" value={getTotalBonus()} />
                <InfoField
                    label="Total de Ocorrências:"
                    value={getTotalOccurrences()}
                />
                <InfoField
                    label="Total de Ocorrências em aberto:"
                    value={getTotalOpenOccurrences()}
                />
            </Flex>

            <AgGrid
                title={"Ocorrências acumaladas por Motorista"}
                gridButtons={
                    <HStack>
                        <DateScroller value={period} setValue={setPeriod} />
                        <ExportXLSX
                            gridApi={gridApi}
                            period={period}
                            extraContent={[
                                `Total de Bônus: ${getTotalBonus()}`,
                                `Total de Ocorrências: ${getTotalOccurrences()}`,
                                `Total de Ocorrências em aberto: ${getTotalOpenOccurrences()}`,
                            ]}
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
        </Box>
    );
};

interface InfoProps {
    label: string;
    value: string | number;
}
const InfoField = ({ label, value }: InfoProps) => {
    return (
        <HStack
            color="white"
            p={2}
            bgColor="gray"
            w="fit-content"
            borderRadius="md"
        >
            <Text>{label}</Text>
            <Text fontWeight="bold">{value}</Text>
        </HStack>
    );
};

export default ReportsPage;
