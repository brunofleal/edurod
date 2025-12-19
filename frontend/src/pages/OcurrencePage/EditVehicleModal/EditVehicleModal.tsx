import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Field,
    Grid,
    GridItem,
    Icon,
    Portal,
    Text,
} from "@chakra-ui/react";
import { BsPencilSquare } from "react-icons/bs";
import ComboBox from "../../../components/ComboBox/ComboBox";
import { useFetch } from "../../../shared/hooks/useFetch";
import { fromDataArrayToOption } from "../NewOccurrenceModal/utils";
import { axiosApi } from "../../../shared/axiosApi";
import { toast } from "react-toastify";
import type { OccurrenceRegistry } from "../../../interfaces/occurrenceRegistry";
import { formatDateToLocalTime } from "../../../shared/utils/formatDate";

interface Props {
    occurrence: OccurrenceRegistry;
    refetch: () => void;
}

const EditVehicleModal = ({ occurrence, refetch }: Props) => {
    const [vehicle, setVehicle] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const { data: dataVehicles, loading: loadingVehicles } =
        useFetch("/api/vehicles");
    const vehicleOptions = dataVehicles
        ? fromDataArrayToOption(
              dataVehicles.data,
              ["code", "plate", "nChassi"],
              "_id"
          )
        : [];

    useEffect(() => {
        if (occurrence && vehicleOptions.length > 0 && open && !initialized) {
            setVehicle(occurrence.vehicle?._id);
            setInitialized(true);
        }
        if (!open && initialized) {
            setInitialized(false);
        }
    }, [occurrence, vehicleOptions, open]);

    const handleSave = () => {
        if (!vehicle) {
            toast.error("Selecione um veículo");
            return;
        }

        setLoading(true);
        const payload = {
            vehicle,
        };

        axiosApi
            .patch(`/api/occurrences/${occurrence._id}`, payload)
            .then((response) => {
                toast.success("Veículo atualizado com sucesso!");
                setOpen(false);
                refetch();
            })
            .catch((error) => {
                toast.error("Falha ao atualizar veículo.");
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Dialog.Root
            size={"full"}
            closeOnInteractOutside={false}
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
        >
            <Dialog.Trigger asChild>
                <Button variant="solid" size="xs">
                    <Icon>
                        <BsPencilSquare />
                    </Icon>
                    Editar Veículo
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Editar Veículo da Ocorrência
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Grid templateColumns="repeat(2, 1fr)" gap="6">
                                <GridItem>
                                    <Field.Root>
                                        <Field.Label>
                                            Data da ocorrência
                                        </Field.Label>
                                        <Text
                                            p={2}
                                            border="1px solid"
                                            borderColor="gray.300"
                                            borderRadius="4px"
                                            bg="gray.50"
                                        >
                                            {formatDateToLocalTime(
                                                occurrence.occurrenceDate,
                                                { onlyDate: false }
                                            )}
                                        </Text>
                                    </Field.Root>
                                </GridItem>
                                <GridItem>
                                    <Field.Root>
                                        <Field.Label>Linha</Field.Label>
                                        <Text
                                            p={2}
                                            border="1px solid"
                                            borderColor="gray.300"
                                            borderRadius="4px"
                                            bg="gray.50"
                                        >
                                            {occurrence.line
                                                ? `${occurrence.line.code} | ${occurrence.line.description}`
                                                : "-"}
                                        </Text>
                                    </Field.Root>
                                </GridItem>
                                <GridItem>
                                    <ComboBox
                                        key={`vehicle-${occurrence._id}-${open}`}
                                        label="Veículo*"
                                        placeholder="Selecione um veículo"
                                        options={vehicleOptions}
                                        value={vehicle}
                                        setValue={setVehicle}
                                        loading={loadingVehicles}
                                    />
                                </GridItem>
                                <GridItem>
                                    <Field.Root>
                                        <Field.Label>Motorista</Field.Label>
                                        <Text
                                            p={2}
                                            border="1px solid"
                                            borderColor="gray.300"
                                            borderRadius="4px"
                                            bg="gray.50"
                                        >
                                            {occurrence.driver
                                                ? `${occurrence.driver.matricula} | ${occurrence.driver.name}`
                                                : "-"}
                                        </Text>
                                    </Field.Root>
                                </GridItem>
                                <GridItem>
                                    <Field.Root>
                                        <Field.Label>
                                            Tipo de Ocorrência
                                        </Field.Label>
                                        <Text
                                            p={2}
                                            border="1px solid"
                                            borderColor="gray.300"
                                            borderRadius="4px"
                                            bg="gray.50"
                                        >
                                            {occurrence.occurrenceType
                                                ? occurrence.occurrenceType
                                                      .description
                                                : "-"}
                                        </Text>
                                    </Field.Root>
                                </GridItem>
                                <GridItem>
                                    <Field.Root>
                                        <Field.Label>Fonte</Field.Label>
                                        <Text
                                            p={2}
                                            border="1px solid"
                                            borderColor="gray.300"
                                            borderRadius="4px"
                                            bg="gray.50"
                                        >
                                            {occurrence.source?.description ||
                                                "-"}
                                        </Text>
                                    </Field.Root>
                                </GridItem>
                                {occurrence.description && (
                                    <GridItem colSpan={2}>
                                        <Field.Root>
                                            <Field.Label>
                                                Informações Adicionais
                                            </Field.Label>
                                            <Text
                                                p={2}
                                                border="1px solid"
                                                borderColor="gray.300"
                                                borderRadius="4px"
                                                bg="gray.50"
                                                minH="60px"
                                            >
                                                {occurrence.description}
                                            </Text>
                                        </Field.Root>
                                    </GridItem>
                                )}
                            </Grid>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancelar</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                onClick={handleSave}
                                loading={loading}
                                disabled={loading || !vehicle}
                            >
                                Salvar
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default EditVehicleModal;
