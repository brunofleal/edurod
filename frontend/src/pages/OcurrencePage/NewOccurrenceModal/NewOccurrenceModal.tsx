import {
  Button,
  CloseButton,
  Combobox,
  Dialog,
  Icon,
  Input,
  Portal,
} from "@chakra-ui/react";
import React from "react";
import { BsPlusCircle } from "react-icons/bs";

const NewOccurrencePage = () => {
  return (
    <Dialog.Root size={"lg"}>
      <Dialog.Trigger asChild>
        <Button variant="solid">
          <Icon>
            <BsPlusCircle />
          </Icon>
          Adicionar Ocorrência
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form>
                <Combobox.Root
                  collection={collection}
                  onInputValueChange={(e) => filter(e.inputValue)}
                  width="320px"
                >
                  <Combobox.Label>Select framework</Combobox.Label>
                  <Combobox.Control>
                    <Combobox.Input placeholder="Type to search" />
                    <Combobox.IndicatorGroup>
                      <Combobox.ClearTrigger />
                      <Combobox.Trigger />
                    </Combobox.IndicatorGroup>
                  </Combobox.Control>
                  <Portal>
                    <Combobox.Positioner>
                      <Combobox.Content>
                        <Combobox.Empty>No items found</Combobox.Empty>
                        {collection.items.map((item) => (
                          <Combobox.Item item={item} key={item.value}>
                            {item.label}
                            <Combobox.ItemIndicator />
                          </Combobox.Item>
                        ))}
                      </Combobox.Content>
                    </Combobox.Positioner>
                  </Portal>
                </Combobox.Root>
                <Input />
                <Input />
                <Input />
                <Input />
                <Input />
                <Input />
              </form>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button>Save</Button>
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

export default NewOccurrencePage;
