import type { ColDef } from "ag-grid-community";
import AgGrid from "../../components/AgGrid/AgGrid";
import { useFetch } from "../../shared/hooks/useFetch";
import { createColDefsFromData } from "./utils";
import { getEditDeleteActionsColDef } from "./setup/colDefs";
import { Box, Button, HStack, Icon, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { axiosApi } from "../../shared/axiosApi";
import { toast } from "react-toastify";
import { BsPlus } from "react-icons/bs";

interface PanelProps {
    url: string;
    attributes: string[];
}
const PanelGrid = ({ url, attributes }: PanelProps) => {
    const { data, loading, refetch } = useFetch<any>(url);
    const [payload, setPayload] = useState({});
    const [formKey, setFormKey] = useState(0);

    const isButtonDisabled =
        Object.values(payload).length !== attributes.length;

    const rowData = data ? data.data : [];

    const colDefs: ColDef[] = createColDefsFromData(
        rowData ? rowData[0] : undefined
    );
    const editDeleteColDef = getEditDeleteActionsColDef(url, refetch);

    const handleAdd = async () => {
        try {
            const response = await axiosApi.post(url, payload);

            // Check if response exists and has a valid status
            const status = response?.status ?? 0;
            if (status >= 200 && status < 300) {
                toast.success("Objeto adicionado com sucesso!");
                setPayload({});
                setFormKey((prev) => prev + 1);
                refetch();
            } else if (status === 0) {
                toast.error("Erro do servidor");
            } else {
                toast.error(`Erro do servidor: ${status}`);
            }
        } catch (error: any) {
            console.error("Erro completo:", error);
            // Check if error has response data
            const errorStatus = error?.response?.status;
            const errorMessage =
                error?.response?.data?.message || error?.message;

            if (errorStatus) {
                toast.error(`Erro ${errorStatus}: ${errorMessage}`);
            } else {
                toast.error("Falha ao adicionar Usuario!");
            }
        }
    };

    return (
        <Box>
            <HStack p={1} gap={1}>
                {attributes.map((attribute) => (
                    <FormField
                        key={`${attribute}-${formKey}`}
                        attribute={attribute}
                        value={payload}
                        setValue={setPayload}
                    />
                ))}
                <Button mt={6} disabled={isButtonDisabled} onClick={handleAdd}>
                    <Icon>
                        <BsPlus />
                    </Icon>
                    Adicionar Entidade
                </Button>
            </HStack>
            <AgGrid
                width={"90vw"}
                height={"75vh"}
                rowData={rowData}
                columnDefs={[...colDefs, editDeleteColDef]}
                loading={loading}
            />
        </Box>
    );
};

interface FormProps {
    attribute: string;
    value: any;
    setValue: Function;
}
const FormField = ({ attribute, value, setValue }: FormProps) => {
    return (
        <Box>
            <Text>{attribute}</Text>
            <Input
                value={value[attribute] || ""}
                onChange={(event) =>
                    setValue({ ...value, [attribute]: event.target.value })
                }
            />
        </Box>
    );
};

export default PanelGrid;
