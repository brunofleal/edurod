import React from "react";
import AgGrid from "../../components/AgGrid/AgGrid";
import { colDefs, defaultColumnDef } from "./setup/constants";
import { mockedDriverReports } from "./setup/mock";
import TimePeriod from "./setup/DriverDetailCellRenderer/setup/TimePeriod";

const ReportsPage = () => {
  const date = "";
  const title = `Pontuação por Motorista (${date})`;
  return (
    <AgGrid
      title={title}
      children={<TimePeriod />}
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
