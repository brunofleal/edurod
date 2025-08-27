import { HStack, Icon, Text } from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";
import {
  formatDateToLocalTime,
  getCurrentMonthRange,
} from "../../../../../shared/utils/formatDate";
import type { JSX } from "react";

interface Props {
  children?: JSX.Element;
}
const TimePeriod = ({ children }: Props) => {
  const [startDate, endDate] = getCurrentMonthRange();

  return (
    <HStack>
      {children}
      <Text fontWeight="bold" bgColor="white" borderRadius="20px" p={1}>
        {formatDateToLocalTime(startDate.toISOString(), { onlyDate: true })}
      </Text>
      <Icon>
        <BsArrowRight />
      </Icon>
      <Text fontWeight="bold" bgColor="white" borderRadius="20px" p={1}>
        {formatDateToLocalTime(endDate.toISOString(), { onlyDate: true })}
      </Text>
    </HStack>
  );
};

export default TimePeriod;
