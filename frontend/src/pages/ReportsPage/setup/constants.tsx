import type { ColDef } from "ag-grid-community";
import DriverDetailCellRenderer from "./DriverDetailCellRenderer/DriverDetailCellRenderer";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Icon, Tag } from "@chakra-ui/react";
import type { DriverReport } from "../../../interfaces/driver";
import { BsCash } from "react-icons/bs";

export const colDefs: ColDef[] = [
    {
        headerName: "Matrícula Motorista",
        field: "driver",
        valueGetter: ({ data }) =>
            data.driver ? `${data.driver.matricula}` : "-",
        comparator: (valueA, valueB) => {
            const numA = parseFloat(valueA) || 0;
            const numB = parseFloat(valueB) || 0;
            return numA - numB;
        },
        width: 120,
        pinned: "left",
    },
    {
        headerName: "Motorista",
        field: "driver",
        valueGetter: ({ data }) => (data.driver ? `${data.driver.name}` : "-"),
        width: 250,
        pinned: "left",
    },
    {
        headerName: "Pontos",
        field: "points",
        width: 100,
        valueGetter: ({ data }) => Math.round(data?.points || 0),
        comparator: (valueA, valueB) => {
            return (valueA || 0) - (valueB || 0);
        },
    },
    {
        headerName: "Bônus",
        field: "bonus",
        width: 100,
        valueGetter: ({ data }) => Math.round(data?.bonus || 0),
        comparator: (valueA, valueB) => {
            return (valueA || 0) - (valueB || 0);
        },
        cellRenderer: ({ data }: CustomCellRendererProps<DriverReport>) => {
            return (
                <Tag.Root bgColor="green.300" mt={3}>
                    <Tag.Label>
                        <Icon mb={1} mr={1}>
                            <BsCash />
                        </Icon>
                        {Math.round(data?.bonus || 0)}
                    </Tag.Label>
                </Tag.Root>
            );
        },
    },
    {
        headerName: "Ocorrências",
        field: "totalOccurrences",
    },
    {
        headerName: "Ocorrências abertas",
        field: "totalUnresolvedOccurrences",
    },
    {
        headerName: "Ocorrência mais grave",
        width: 250,
        valueGetter: ({ data }) => {
            if (
                !data.topOccurrence ||
                !data?.topOccurrence?.occurrenceCategory
            ) {
                return "-";
            }
            return `${data.topOccurrence.description}(${data.topOccurrence.occurrenceCategory.points})`;
        },
    },
    {
        headerName: "Detalhes",
        field: "detail",
        pinned: "right",
        cellRenderer: DriverDetailCellRenderer,
    },
];

export const defaultColumnDef: ColDef = {
    filter: true,
    floatingFilter: true,
    width: 150,
    autoHeight: true,
};
