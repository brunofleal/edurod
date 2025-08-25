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
