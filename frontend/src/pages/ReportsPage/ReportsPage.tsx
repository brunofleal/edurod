import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import AgGrid from "../../components/AgGrid/AgGrid";
import PointsPerDriverChart from "./setup/DriverDetailCellRenderer/PointsPerDriverChart";
import { colDefs, defaultColumnDef } from "./setup/constants";
import { mockedDriverReports } from "./setup/mock";

const ReportsPage = () => {
  return (
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
  );
};

export default ReportsPage;
