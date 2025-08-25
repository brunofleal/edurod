import React from "react";
import { Grid, GridItem, Text } from "@chakra-ui/react";
import AgGrid from "../../components/AgGrid/AgGrid";
import PointsPerDriverChart from "./PointsPerDriverChart/PointsPerDriverChart";
import { colDefs, defaultColumnDef } from "./setup/constants";
import { mockedDriverReports } from "./setup/mock";

const ReportsPage = () => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap="6" p={4}>
      <GridItem>
        <AgGrid
          title="Pontuação por Motorista"
          rowData={mockedDriverReports}
          height="85vh"
          columnDefs={colDefs}
          defaultColDef={defaultColumnDef}
          autoSizeStrategy={{
            type: "fitGridWidth",
            defaultMinWidth: 100,
          }}
        />
      </GridItem>
      <GridItem>
        <PointsPerDriverChart />
      </GridItem>
    </Grid>
  );
};

export default ReportsPage;
