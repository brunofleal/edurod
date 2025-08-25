import React from "react";
import {
  Combobox as ChakraComboBox,
  useFilter,
  useListCollection,
  type BoxProps,
} from "@chakra-ui/react";
import type Option from "../../interfaces/option";

interface Props {
  label: string;
  placeholder: string;
  options: Option[];
  styleProps?: BoxProps;
}
const ComboBox = ({ placeholder, label, options, ...styleProps }: Props) => {
  const { contains } = useFilter({ sensitivity: "base" });

  const { collection, filter } = useListCollection({
    initialItems: options,
    filter: contains,
  });
  return (
    <ChakraComboBox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
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
          <ChakraComboBox.Empty>Nenhum Item Encontrado</ChakraComboBox.Empty>
          {collection.items.map((item) => (
            <ChakraComboBox.Item item={item} key={item.value}>
              {item.label}
              <ChakraComboBox.ItemIndicator />
            </ChakraComboBox.Item>
          ))}
        </ChakraComboBox.Content>
      </ChakraComboBox.Positioner>
    </ChakraComboBox.Root>
  );
};

export default ComboBox;
