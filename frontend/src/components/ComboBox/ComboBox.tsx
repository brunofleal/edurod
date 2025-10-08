import React from "react";
import {
    Box,
    Combobox as ChakraComboBox,
    Skeleton,
    useFilter,
    useListCollection,
    type BoxProps,
} from "@chakra-ui/react";
import type Option from "../../interfaces/option";

interface Props {
    label: string;
    placeholder: string;
    options: Option[];
    setValue: Function;
    loading?: boolean;
    styleProps?: BoxProps;
}
const ComboBox = ({
    placeholder,
    label,
    options,
    setValue,
    loading,
    ...styleProps
}: Props) => {
    const { contains } = useFilter({ sensitivity: "base" });

    const { collection, filter } = useListCollection({
        initialItems: options,
        filter: contains,
    });
    return !loading ? (
        <ChakraComboBox.Root
            collection={collection}
            onInputValueChange={(e) => filter(e.inputValue)}
            onValueChange={(e) => setValue(e.value[0])}
            positioning={{ strategy: "fixed", hideWhenDetached: true }}
            {...styleProps}
        >
            <ChakraComboBox.Label>{label}</ChakraComboBox.Label>
            <ChakraComboBox.Control>
                <ChakraComboBox.Input placeholder={placeholder} />
                <ChakraComboBox.IndicatorGroup>
                    <ChakraComboBox.ClearTrigger />
                    <ChakraComboBox.Trigger />
                </ChakraComboBox.IndicatorGroup>
            </ChakraComboBox.Control>
            <ChakraComboBox.Positioner>
                <ChakraComboBox.Content>
                    <ChakraComboBox.Empty>
                        Nenhum Item Encontrado
                    </ChakraComboBox.Empty>
                    {collection.items.map((item) => (
                        <ChakraComboBox.Item item={item} key={item.value}>
                            {item.label}
                            <ChakraComboBox.ItemIndicator />
                        </ChakraComboBox.Item>
                    ))}
                </ChakraComboBox.Content>
            </ChakraComboBox.Positioner>
        </ChakraComboBox.Root>
    ) : (
        <Box>
            <Skeleton mb={1} w={"50%"} h={"24px"} />
            <Skeleton w={"100%"} h={"35px"} />
        </Box>
    );
};

export default ComboBox;
