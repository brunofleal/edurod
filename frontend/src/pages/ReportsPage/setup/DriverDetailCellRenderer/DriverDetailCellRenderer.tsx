import type { CustomCellRendererProps } from "ag-grid-react";
import React from "react";
import type { DriverReport } from "../../../../interfaces/driver";
import { Button, Icon } from "@chakra-ui/react";
import { BsEyeFill } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router";

const DriverDetailCellRenderer = ({
    data,
}: CustomCellRendererProps<DriverReport>) => {
    const [searchParams] = useSearchParams();
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const navigate = useNavigate();
    const handleDetail = () => {
        const encodedDriverName = encodeURIComponent(data?.driver.name || "");
        const url = `/occurrences?startDate=${startDate}&endDate=${endDate}&driver=${encodedDriverName}`;
        navigate(url);
    };
    return (
        <Button variant="solid" size="md" onClick={handleDetail}>
            <Icon>
                <BsEyeFill />
            </Icon>
            Detalhe
        </Button>
    );
};

export default DriverDetailCellRenderer;
