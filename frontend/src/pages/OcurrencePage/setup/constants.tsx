import type { CellRendererDeferParams, ColDef } from "ag-grid-community";
import { formatDateToLocalTime } from "../../../shared/utils/formatDate";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Badge, ButtonGroup, Button, Icon } from "@chakra-ui/react";
import { BsArchive, BsPencil, BsTrash } from "react-icons/bs";
import type { OccurrenceRegistry } from "../../../interfaces/occurrenceRegistry";

export const colDefs: ColDef[] = [
  {
    headerName: "Ocorrência",
    field: "occurrence.name",
  },
  {
    headerName: "Pontos",
    field: "occurrence.points",
    width: 100,
    cellRenderer: ({ data }: CustomCellRendererProps<OccurrenceRegistry>) => {
      return <Badge variant="solid">{data?.occurrence.points}</Badge>;
    },
  },
  {
    headerName: "Motorista",
    field: "driver.name",
  },
  {
    headerName: "Linha",
    field: "line.name",
  },
  {
    headerName: "Data",
    field: "createdAt",
    width: 200,
    valueGetter: ({ data }) =>
      formatDateToLocalTime(data["createdAt"], { onlyDate: false }),
  },
  {
    headerName: "Status",
    field: "isResolved",
    width: 150,
    cellRenderer: ({ data }: CustomCellRendererProps) => {
      {
        const isResolved = data["isResolved"];
        return (
          <Badge variant={"solid"} bgColor={isResolved ? "green" : "red"}>
            {isResolved ? "Fechado" : "Em Aberto"}
          </Badge>
        );
      }
    },
  },
  {
    headerName: "Ações",
    field: "actions",
    pinned: "right",
    filter: false,
    width: 280,
    cellRenderer: ({ data }: CustomCellRendererProps<OccurrenceRegistry>) => {
      return (
        <ButtonGroup>
          <Button size="xs" display={data?.isResolved ? "none" : "flex"}>
            <Icon>
              <BsArchive />
            </Icon>
            Fechar
          </Button>
          <Button size="xs" variant="outline">
            <Icon>
              <BsPencil />
            </Icon>
            Editar
          </Button>
          <Button size="xs" variant="outline" bgColor="red" color="white">
            <Icon>
              <BsTrash />
            </Icon>
            Deletar
          </Button>
        </ButtonGroup>
      );
    },
  },
];
export const defaultColumnDef: ColDef = {
  filter: true,
  floatingFilter: true,
  width: 220,
  autoHeight: true,
};
