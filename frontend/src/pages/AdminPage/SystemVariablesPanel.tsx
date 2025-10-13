import { Box, Button, HStack, Text, Textarea, VStack } from "@chakra-ui/react";
import { useFetch } from "../../shared/hooks/useFetch";
import { useEffect, useState } from "react";
import { axiosApi } from "../../shared/axiosApi";
import { toast } from "react-toastify";

const SystemVariablesPanel = () => {
    const { data, refetch } = useFetch("/api/systemVariables");
    const systemVariables = data && data.data ? data.data[0] : undefined;

    const [textPayload, setTextPayload] = useState("");

    const handleInitializaSystemVariables = () => {
        const payload = {
            pointsPerDriver: 100,
            maxPayAmoutPerDriver: 300,
            maintenanceMode: false,
        };
        axiosApi
            .post("/api/systemVariables", payload)
            .then((response) => {
                if (response.status < 300) {
                    toast.success(
                        "Variáveis de Sistema inicializadas com sucesso!"
                    );
                } else {
                    toast.error("Falha na operação!");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Falha na inicialização das variáveis de ambiente");
            })
            .finally(() => {
                refetch();
            });
    };

    const handleUpdateSystemVariables = () => {
        const payload = JSON.parse(textPayload);
        console.log(payload);
        axiosApi
            .patch(`/api/systemVariables/${systemVariables._id}`, payload)
            .then((response) => {
                if (response.status < 300) {
                    toast.success(
                        "Variáveis de Sistema atualizadas com sucesso!"
                    );
                } else {
                    toast.success("Falha na atualização!");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Falha na inicialização das variáveis de ambiente");
            })
            .finally(() => {
                refetch();
            });
    };

    useEffect(() => {
        if (systemVariables) {
            const payload = { ...systemVariables };
            delete payload.createdAt;
            delete payload.updatedAt;
            delete payload.createdBy;
            delete payload.modifiedBy;
            delete payload._id;
            delete payload.__v;
            setTextPayload(JSON.stringify(payload, null, 2));
        }
    }, [systemVariables]);

    const hasValidSyntax = () => {
        try {
            JSON.parse(textPayload);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <Box>
            {!systemVariables ? (
                <VStack>
                    <p>
                        Variáveis de sistema não inicializadas. Alguns funções
                        podem ficar desabilitadas
                    </p>
                    <Button onClick={handleInitializaSystemVariables}>
                        Inicializar Variáveis
                    </Button>
                </VStack>
            ) : (
                <Box>
                    <HStack>
                        <Text fontWeight="bold">Variáveis de Ambiente</Text>
                        <Button
                            disabled={!hasValidSyntax()}
                            onClick={handleUpdateSystemVariables}
                        >
                            Atualizar Variáveis
                        </Button>
                    </HStack>
                    <Textarea
                        minW={"30vw"}
                        minH={"30vh"}
                        value={textPayload}
                        onChange={(event) => setTextPayload(event.target.value)}
                    />
                </Box>
            )}
        </Box>
    );
};

export default SystemVariablesPanel;
