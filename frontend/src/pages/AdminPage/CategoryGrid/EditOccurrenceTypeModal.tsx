import React, { useEffect, useState } from "react";
import {
    Dialog,
    Button,
    Input,
    Box,
    Text,
    Select,
    Portal,
    createListCollection,
    CloseButton,
} from "@chakra-ui/react";
import Option from "../../../interfaces/option";

interface OccurrenceCategory {
    _id: string;
    name: string;
    points: number;
}

interface OccurrenceType {
    _id?: string;
    description: string;
    occurrenceCategory: string | OccurrenceCategory;
}

interface EditOccurrenceTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    occurrenceType: OccurrenceType | null;
    categories: OccurrenceCategory[];
    loading: boolean;
    onSave: (id: string, updated: OccurrenceType) => void;
}

const EditOccurrenceTypeModal = ({
    isOpen,
    onClose,
    occurrenceType,
    categories,
    loading,
    onSave,
}: EditOccurrenceTypeModalProps) => {
    const [form, setForm] = useState<any>(null);

    useEffect(() => {
        if (occurrenceType) {
            const categoryId =
                typeof occurrenceType.occurrenceCategory === "string"
                    ? occurrenceType.occurrenceCategory
                    : occurrenceType.occurrenceCategory?._id || "";

            setForm({
                description: occurrenceType.description,
                occurrenceCategory: categoryId,
            });
        }
    }, [occurrenceType]);

    const categoriesOptions: Option[] = categories.map((cat) => ({
        value: cat._id,
        label: `${cat.name} (${cat.points})`,
    }));
    const categoriesCollection = createListCollection({
        items: categoriesOptions,
    });

    return (
        <Dialog.Root lazyMount open={isOpen}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Editar Tipo de Ocorrência
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Box mb={3}>
                                <Text mb={1}>Descrição</Text>
                                <Input
                                    value={form?.description || ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </Box>
                            <Box mb={3}>
                                <Text mb={1}>Categoria</Text>
                                <Select.Root
                                    collection={categoriesCollection}
                                    value={
                                        form?.occurrenceCategory
                                            ? [form.occurrenceCategory]
                                            : []
                                    }
                                    onValueChange={(details) =>
                                        setForm({
                                            ...form,
                                            occurrenceCategory:
                                                details.value[0],
                                        })
                                    }
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText placeholder="Selecione a Categoria" />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {categoriesOptions.map((cat) => (
                                                <Select.Item
                                                    item={cat.value}
                                                    key={cat.value}
                                                >
                                                    {cat.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Select.Root>
                            </Box>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button bgColor="red" mr={3} onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => {
                                    if (occurrenceType && form) {
                                        onSave(occurrenceType._id!, {
                                            description: form.description,
                                            occurrenceCategory:
                                                form.occurrenceCategory,
                                        });
                                        onClose();
                                    }
                                }}
                                loading={loading}
                                disabled={
                                    !form?.description ||
                                    !form?.occurrenceCategory
                                }
                            >
                                Salvar
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger onClick={onClose} asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default EditOccurrenceTypeModal;
