import ExcelJS from "exceljs";
import { Button, Icon } from "@chakra-ui/react";
import type { GridApi } from "ag-grid-community";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import { formatDateToLocalTime } from "../../shared/utils/formatDate";

interface Period {
    start: string;
    end: string;
}

interface ExportXLSXProps {
    gridApi: GridApi | null;
    period?: Period;
    title?: string;
    subtitle?: string;
    extraContent?: string[];
    fileName?: string;
}

const ExportXLSX = ({
    gridApi,
    period,
    title = "Relatório de Ocorrências",
    subtitle = "",
    extraContent,
    fileName,
}: ExportXLSXProps) => {
    const exportToXLSX = async () => {
        if (!gridApi) return;

        // Get filtered and visible columns (include all visible columns)
        const visibleColumns =
            gridApi.getColumns()?.filter((col) => col.isVisible()) || [];

        // Prepare table headers
        const headers = visibleColumns.map(
            (col) => col.getColDef().headerName || col.getColId()
        );

        // Create workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Ocorrências");

        // Set column widths
        worksheet.columns = visibleColumns.map((col, index) => ({
            key: col.getColId(),
            width: index === 0 ? 40 : 25,
        }));

        // Add title row
        const titleRow = worksheet.addRow([title]);
        worksheet.mergeCells(
            `A1:${String.fromCharCode(64 + visibleColumns.length)}1`
        );
        titleRow.height = 30;
        titleRow.getCell(1).style = {
            font: { bold: true, size: 16, color: { argb: "FFFFFFFF" } },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF366B69" },
            },
            alignment: { horizontal: "center", vertical: "middle" },
            border: {
                top: { style: "thick", color: { argb: "FF000000" } },
                left: { style: "thick", color: { argb: "FF000000" } },
                bottom: { style: "thick", color: { argb: "FF000000" } },
                right: { style: "thick", color: { argb: "FF000000" } },
            },
        };

        // Add subtitle row if subtitle exists
        let currentRowIndex = 2;
        if (subtitle) {
            const subtitleRow = worksheet.addRow([subtitle]);
            worksheet.mergeCells(
                `A2:${String.fromCharCode(64 + visibleColumns.length)}2`
            );
            subtitleRow.height = 25;
            subtitleRow.getCell(1).style = {
                font: { bold: true, size: 14, color: { argb: "FF2D3748" } },
                alignment: { horizontal: "center", vertical: "middle" },
                border: {
                    bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
                },
            };
            currentRowIndex = 3;
        }

        // Add date range row
        const dateRange =
            period?.start && period?.end
                ? `Período: ${formatDateToLocalTime(period.start, { onlyDate: true })} até ${formatDateToLocalTime(period.end, { onlyDate: true })}`
                : "Período: Todos os registros";
        const dateRow = worksheet.addRow([dateRange]);
        worksheet.mergeCells(
            `A${currentRowIndex}:${String.fromCharCode(64 + visibleColumns.length)}${currentRowIndex}`
        );
        dateRow.height = 25;
        dateRow.getCell(1).style = {
            font: { bold: true, size: 12, color: { argb: "FF2D3748" } },
            alignment: { horizontal: "center", vertical: "middle" },
            border: {
                bottom: { style: "medium", color: { argb: "FFE2E8F0" } },
            },
        };

        // Add extraContent row if it exists
        if (extraContent && extraContent.length > 0) {
            currentRowIndex++;
            const extraRow = worksheet.addRow(extraContent);
            extraRow.height = 25;
            extraRow.eachCell((cell) => {
                cell.style = {
                    font: { bold: true, size: 11, color: { argb: "FF2D3748" } },
                    alignment: { horizontal: "center", vertical: "middle" },
                    border: {
                        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
                    },
                };
            });
        }

        // Add empty row
        worksheet.addRow([]);

        // Add header row
        const headerRow = worksheet.addRow(headers);
        headerRow.height = 25;
        headerRow.eachCell((cell) => {
            cell.style = {
                font: { bold: true, size: 11, color: { argb: "FFFFFFFF" } },
                fill: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FF408582" },
                },
                alignment: { horizontal: "center", vertical: "middle" },
                border: {
                    top: { style: "medium", color: { argb: "FF2D3748" } },
                    left: { style: "thin", color: { argb: "FFFFFFFF" } },
                    bottom: { style: "medium", color: { argb: "FF2D3748" } },
                    right: { style: "thin", color: { argb: "FFFFFFFF" } },
                },
            };
        });

        // Add data rows
        let rowIndex = 0;
        gridApi.forEachNodeAfterFilterAndSort((node) => {
            // Skip if this is a header row or invalid data
            if (!node.data || node.rowPinned) {
                return;
            }

            const rowData = visibleColumns.map((col) => {
                const colId = col.getColId();
                const colDef = col.getColDef();
                const cellValue = node.data[colId];

                // For columns with cell renderers, try to get the underlying value
                if (colDef.cellRenderer) {
                    // If it's a detail/action column, skip it
                    if (
                        colId === "detail" ||
                        colDef.headerName === "Detalhes"
                    ) {
                        return "";
                    }
                    // For other cell renderer columns, return the raw value
                    return cellValue || "";
                }

                // Apply value getter first (this handles computed values like driver info)
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
                    return getterValue || "";
                }

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
                    return formattedValue || "";
                }

                return cellValue || "";
            });

            const dataRow = worksheet.addRow(rowData);
            dataRow.height = 20;

            // Apply alternating row colors
            const isEvenRow = rowIndex % 2 === 0;
            const bgColor = isEvenRow ? "FFF7FAFC" : "FFFFFFFF";

            dataRow.eachCell((cell) => {
                cell.style = {
                    font: { size: 10, color: { argb: "FF2D3748" } },
                    fill: {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: bgColor },
                    },
                    alignment: { horizontal: "left", vertical: "middle" },
                    border: {
                        top: { style: "hair", color: { argb: "FFE2E8F0" } },
                        left: { style: "hair", color: { argb: "FFE2E8F0" } },
                        bottom: { style: "hair", color: { argb: "FFE2E8F0" } },
                        right: { style: "hair", color: { argb: "FFE2E8F0" } },
                    },
                };
            });
            rowIndex++;
        });

        // Add autofilter to header row
        const headerRowNumber = subtitle ? 5 : 4;
        const finalHeaderRowNumber =
            extraContent && extraContent.length > 0
                ? headerRowNumber + 1
                : headerRowNumber;
        worksheet.autoFilter = {
            from: { row: finalHeaderRowNumber, column: 1 },
            to: { row: finalHeaderRowNumber, column: visibleColumns.length },
        };

        // Set freeze panes using the worksheet views property
        worksheet.views = [
            {
                state: "frozen",
                ySplit: finalHeaderRowNumber,
                xSplit: 1,
                topLeftCell: `B${finalHeaderRowNumber + 1}`,
                activeCell: `B${finalHeaderRowNumber + 1}`,
            },
        ];

        // Save file
        const finalFileName =
            fileName ||
            `ocorrencias_${
                period?.start || "todos"
            }_${period?.end || "registros"}.xlsx`;

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = finalFileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <Button variant={"outline"} onClick={exportToXLSX} disabled={!gridApi}>
            <Icon mr={2}>
                <BsFileEarmarkArrowDown />
            </Icon>
            Exportar
        </Button>
    );
};

export default ExportXLSX;
