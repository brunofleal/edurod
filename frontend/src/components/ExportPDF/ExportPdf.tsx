import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@chakra-ui/react";
import type { GridApi } from "ag-grid-community";
import { formatDateDDMMYY } from "../../shared/utils/formatDate";
import { BsFilePdf } from "react-icons/bs";

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

        const doc = new jsPDF({ orientation: "landscape" });

        // Add title
        doc.setFontSize(16);
        doc.text(title, 14, 22);
        let y = 22;
        if (subtitle) {
            y += 10;
            doc.text(subtitle, 14, y);
        }
        // Add date range
        doc.setFontSize(12);
        y += 10;
        const dateRange =
            period?.start && period?.end
                ? `Período: ${formatDateDDMMYY(period.start)} até ${formatDateDDMMYY(period.end)}`
                : "Período: Todos os registros";
        doc.text(dateRange, 14, y);

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

        // Calculate totals row
        const columnTotals = visibleColumns.map((col, colIndex) => {
            const colId = col.getColId();
            let total = 0;
            let hasNumericValues = false;

            gridApi.forEachNodeAfterFilterAndSort((node) => {
                const cellValue = node.data[colId];
                const numValue = parseFloat(cellValue);

                if (!isNaN(numValue) && typeof cellValue === "number") {
                    total += numValue;
                    hasNumericValues = true;
                }
            });

            // First column shows "TOTAL" label
            if (colIndex === 0) {
                return "TOTAL";
            }

            return hasNumericValues ? Math.round(total).toString() : "-";
        });

        // Add totals row to the end of body rows
        tableRows.push(columnTotals);
        const totalsRowIndex = tableRows.length - 1;

        // Add table
        autoTable(doc, {
            head: [tableColumns],
            body: tableRows,
            startY: y + 8,
            styles: { fontSize: 6, overflow: "linebreak", cellPadding: 1 },
            headStyles: { fillColor: [64, 133, 126] },
            didParseCell: (data) => {
                // Apply zebra striping to body rows (excluding totals row)
                if (
                    data.section === "body" &&
                    data.row.index !== totalsRowIndex &&
                    data.row.index % 2 === 1
                ) {
                    data.cell.styles.fillColor = [225, 225, 225];
                }
                // Style the totals row
                if (
                    data.section === "body" &&
                    data.row.index === totalsRowIndex
                ) {
                    data.cell.styles.fillColor = [200, 200, 200];
                    data.cell.styles.fontStyle = "bold";
                    data.cell.styles.fontSize = 8;
                }
            },
            margin: { left: 14, right: 14 },
            tableWidth: "auto",
            horizontalPageBreak: true,
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
            <BsFilePdf />
            Exportar PDF
        </Button>
    );
};

export default ExportPDF;
