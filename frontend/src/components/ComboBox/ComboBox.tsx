import { useEffect } from "react";
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
    value: any;
    setValue: Function;
    loading?: boolean;
    styleProps?: BoxProps;
}
const ComboBox = ({
    placeholder,
    label,
    options,
    value,
    setValue,
    loading,
    ...styleProps
}: Props) => {
    const { contains } = useFilter({ sensitivity: "base" });

    const { collection, filter } = useListCollection<Option>({
        initialItems: options,
        filter: contains,
    });

    // Update collection when options change
    useEffect(() => {
        collection.setItems(options);
    }, [options, collection]);

    // Find the selected option object based on the value
    const selectedOption = options.find((option) => option.value === value);
    const selectedValue = selectedOption ? [selectedOption.value] : [];

    return !loading ? (
        <ChakraComboBox.Root
            collection={collection}
            onInputValueChange={(e) => filter(e.inputValue)}
            defaultValue={selectedValue}
            onValueChange={(e) => setValue(e.value?.[0] || "")}
            positioning={{ strategy: "fixed", hideWhenDetached: true }}
            openOnClick
            {...styleProps}
        >
            <ChakraComboBox.Label>{label}</ChakraComboBox.Label>
            <ChakraComboBox.Control>
                <ChakraComboBox.Input
                    placeholder={placeholder}
                    onFocus={() => {
                        // This will trigger the dropdown to open when input is focused
                    }}
                />
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
