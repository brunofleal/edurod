import type { CustomCellRendererProps } from "ag-grid-react";
import React from "react";
import type { DriverReport } from "../../../../interfaces/driver";
import {
  Dialog,
  Button,
  Icon,
  Portal,
  CloseButton,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { BsEyeFill } from "react-icons/bs";
import PointsPerDriverChart from "./PointsPerDriverChart";
import AgGrid from "../../../../components/AgGrid/AgGrid";
import { occurrencesMock } from "../../../OcurrencePage/setup/mock";
import { colDefs } from "./setup/colDefs";
import TimePeriod from "./setup/TimePeriod";

const DriverDetailCellRenderer = ({
  data,
}: CustomCellRendererProps<DriverReport>) => {
  return (
    <Dialog.Root size={"full"}>
      <Dialog.Trigger asChild>
        <Button variant="solid" size="md">
          <Icon>
            <BsEyeFill />
          </Icon>
          Detalhe
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Ocorrências de {data?.name}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Grid templateColumns="repeat(2, 1fr)" gap="8">
                <GridItem colSpan={2}>
                  <AgGrid
                    title="Ocorrências no Período"
                    children={<TimePeriod />}
                    rowData={occurrencesMock}
                    columnDefs={colDefs}
                  />
                </GridItem>
                <GridItem>
                  <PointsPerDriverChart driverName={data?.name ?? ""} />
                </GridItem>
              </Grid>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default DriverDetailCellRenderer;
