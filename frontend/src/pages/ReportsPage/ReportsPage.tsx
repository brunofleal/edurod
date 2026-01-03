import React, { useEffect, useState } from "react";
import AgGrid from "../../components/AgGrid/AgGrid";
import { colDefs, defaultColumnDef } from "./setup/constants";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import DateScroller, {
    type Period,
} from "../../components/DateScroller/DateScroller";
import { formatDateDDMMYY } from "../../shared/utils/formatDate";
import { useFetch } from "../../shared/hooks/useFetch";
import { useNavigate, useSearchParams } from "react-router";
import ExportXLSX from "../../components/ExportXLSX/ExportXLSX";
import ExportPDF from "../../components/ExportPDF/ExportPdf";
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

    // Report constants
    const REPORT_TITLE = "Relatório de Premiação de Motoristas";
    const getReportSubtitle = () =>
        `Gerado em: ${new Date().toLocaleString("pt-BR")}`;
    const getExcelFileName = () =>
        `Relatorio_Premiação_Motoristas_${period?.start ? formatDateDDMMYY(period.start) : ""}--${period?.end ? formatDateDDMMYY(period.end) : ""}.xlsx`;
    const getPdfFileName = () =>
        `Relatorio_Premiação_Motoristas_${period?.start ? formatDateDDMMYY(period.start) : ""}--${period?.end ? formatDateDDMMYY(period.end) : ""}.pdf`;

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
                (total: number, row: DriverReport) =>
                    total + (Math.round(row.bonus) || 0),
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
        <Box gap={2} p={2}>
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
                            title={REPORT_TITLE}
                            subtitle={getReportSubtitle()}
                            fileName={getExcelFileName()}
                        />
                        <ExportPDF
                            gridApi={gridApi}
                            period={period}
                            fileName={getPdfFileName()}
                            title={REPORT_TITLE}
                            subtitle={getReportSubtitle()}
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
