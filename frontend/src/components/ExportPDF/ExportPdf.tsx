import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@chakra-ui/react";
import type { GridApi } from "ag-grid-community";
import { formatDateToLocalTime } from "../../shared/utils/formatDate";

interface Period {
    start: string;
    end: string;
}

interface ExportPDFProps {
    gridApi: GridApi | null;
    period?: Period;
    title?: string;
    subtitle?: string;
    fileName?: string;
}

const ExportPDF = ({
    gridApi,
    period,
    title = "Relatório de Ocorrências",
    subtitle = "",
    fileName,
}: ExportPDFProps) => {
    const exportToPDF = () => {
        if (!gridApi) return;

        const doc = new jsPDF();

        // Add title
        doc.setFontSize(16);
        doc.text(title, 14, 22);
        doc.text(subtitle, 14, 32);

        // Add date range
        doc.setFontSize(12);
        const dateRange =
            period?.start && period?.end
                ? `Período: ${formatDateToLocalTime(period.start, { onlyDate: true })} até ${formatDateToLocalTime(period.end, { onlyDate: true })}`
                : "Período: Todos os registros";
        doc.text(dateRange, 14, 32);

        // Get filtered and visible columns
        const visibleColumns =
            gridApi.getColumns()?.filter((col) => col.isVisible()) || [];

        // Prepare table data using ag-Grid's displayed values
        const tableColumns = visibleColumns.map(
            (col) => col.getColDef().headerName || col.getColId()
        );

        const tableRows: string[][] = [];
        gridApi.forEachNodeAfterFilterAndSort((node) => {
            const row = visibleColumns.map((col) => {
                const colId = col.getColId();
                const colDef = col.getColDef();
                const cellValue = node.data[colId];

                // Apply value formatter if it exists and is a function
                if (
                    colDef.valueFormatter &&
                    typeof colDef.valueFormatter === "function"
                ) {
                    const formattedValue = colDef.valueFormatter({
                        value: cellValue,
                        data: node.data,
                        node: node,
                        colDef: colDef,
                        column: col,
                        api: gridApi,
                        context: undefined,
                    });
                    return formattedValue?.toString() || "";
                }

                // Apply value getter if it exists and is a function
                if (
                    colDef.valueGetter &&
                    typeof colDef.valueGetter === "function"
                ) {
                    const getterValue = colDef.valueGetter({
                        data: node.data,
                        node: node,
                        colDef: colDef,
                        column: col,
                        api: gridApi,
                        context: undefined,
                        getValue: (field: string) => node.data[field],
                    });
                    return getterValue?.toString() || "";
                }

                return cellValue?.toString() || "";
            });
            tableRows.push(row);
        });

        // Add table
        autoTable(doc, {
            head: [tableColumns],
            body: tableRows,
            startY: 40,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [64, 133, 126] },
            margin: { left: 14, right: 14 },
        });

        // Save PDF
        const finalFileName =
            fileName ||
            `ocorrencias_${
                period?.start || "todos"
            }_${period?.end || "registros"}.pdf`;
        doc.save(finalFileName);
    };

    return (
        <Button variant={"outline"} onClick={exportToPDF} disabled={!gridApi}>
            Exportar PDF
        </Button>
    );
};

export default ExportPDF;
