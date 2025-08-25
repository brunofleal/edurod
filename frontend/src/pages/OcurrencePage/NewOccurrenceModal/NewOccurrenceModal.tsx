import {
  Button,
  CloseButton,
  Dialog,
  Grid,
  GridItem,
  Icon,
  Input,
  Portal,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { BsPlusCircle } from "react-icons/bs";
import ComboBox from "../../../components/ComboBox/ComboBox";
import { MenuLabels } from "./constants";
import {
  mockedDriverOptions,
  mockedLineOptions,
  mockedOccurrenceOptions,
  mockedSource,
} from "./mock";

const NewOccurrencePage = () => {
  const defaultPlaceholder = "Selecione uma opção";
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
              <Dialog.Title>Registro de nova Ocorrência</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form>
                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                  <GridItem>
                    <ComboBox
                      label={MenuLabels.Occurrence}
                      placeholder={defaultPlaceholder}
                      options={mockedOccurrenceOptions}
                    />
                  </GridItem>
                  <GridItem>
                    <ComboBox
                      label={MenuLabels.Driver}
                      placeholder={defaultPlaceholder}
                      options={mockedDriverOptions}
                    />
                  </GridItem>
                  <GridItem>
                    <ComboBox
                      label={MenuLabels.Line}
                      placeholder={defaultPlaceholder}
                      options={mockedLineOptions}
                    />
                  </GridItem>
                  <GridItem>
                    <ComboBox
                      label={MenuLabels.Source}
                      placeholder={defaultPlaceholder}
                      options={mockedSource}
                    />
                  </GridItem>
                  <GridItem>
                    <Text mb={2}>Data e hora</Text>
                    <Input type="datetime-local" />
                  </GridItem>
                </Grid>
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
