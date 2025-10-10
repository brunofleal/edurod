import React, { useEffect, useState } from "react";
import AgGrid from "../../components/AgGrid/AgGrid";
import { colDefs, defaultColumnDef } from "./setup/constants";
import { HStack } from "@chakra-ui/react";
import DateScroller, {
    type Period,
} from "../../components/DateScroller/DateScroller";
import { useFetch } from "../../shared/hooks/useFetch";
import { useNavigate, useSearchParams } from "react-router";

const ReportsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const [period, setPeriod] = useState<Period>();
    const { data, loading } = useFetch(
        `/api/drivers-report?startDate=${startDate ?? ""}&endDate=${endDate ?? ""}`
    );
    const rowData = data ? data.data : [];

    useEffect(() => {
        if (startDate && endDate) {
            setPeriod({ start: startDate, end: endDate });
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if (
            period?.start !== startDate &&
            period?.end !== endDate &&
            period?.start &&
            period?.end
        ) {
            navigate(
                `/reports?startDate=${period?.start}&endDate=${period?.end}`
            );
        }
    }, [period?.start, period?.end]);

    return (
        <AgGrid
            title={"Pontuação por Motorista"}
            children={
                <HStack>
                    <DateScroller value={period} setValue={setPeriod} />
                </HStack>
            }
            rowData={rowData}
            loading={loading}
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
