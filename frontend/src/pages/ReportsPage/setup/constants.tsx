import type { ColDef } from "ag-grid-community";
import DriverDetailCellRenderer from "./DriverDetailCellRenderer/DriverDetailCellRenderer";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Icon, Tag } from "@chakra-ui/react";
import type { DriverReport } from "../../../interfaces/driver";
import { BsCash } from "react-icons/bs";

export const colDefs: ColDef[] = [
    {
        headerName: "Motorista",
        field: "driver",
        valueGetter: ({ data }) =>
            data.driver
                ? `${data.driver.matricula} | ${data.driver.name}`
                : "-",
        width: 350,
        pinned: "left",
    },
    {
        headerName: "Pontos",
        field: "points",
        width: 100,
    },
    {
        headerName: "Bônus",
        field: "bonus",
        width: 100,
        cellRenderer: ({ data }: CustomCellRendererProps<DriverReport>) => {
            return (
                <Tag.Root bgColor="green.300" mt={3}>
                    <Tag.Label>
                        <Icon mb={1} mr={1}>
                            <BsCash />
                        </Icon>
                        {data?.bonus}
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
            if (!data.topOccurrence) {
                return "-";
            }
            return `${data.topOccurrence.description}(${data.topOccurrence.points})`;
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
