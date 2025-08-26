import { Box, HStack, Icon, Text, Highlight } from "@chakra-ui/react";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatDateToLocalTime,
  getCurrentMonthRange,
} from "../../../../shared/utils/formatDate";
import { BsArrowRight } from "react-icons/bs";
import { getMockedChartData } from "../../PointsPerDriverChart/mock";
import moment from "moment";

function formatXAxis(tickItem: any) {
  return formatDateToLocalTime(moment(tickItem).toISOString(), {
    onlyDate: true,
  });
}

interface Props {
  driverName: string;
}
const PointsPerDriverChart = ({ driverName }: Props) => {
  const [startDate, endDate] = getCurrentMonthRange();
  const data = getMockedChartData();
  const lastData = data[data.length - 1];
  const title = `${driverName} possui ${lastData.pontos} pontos restantes para o período:`;
  return (
    <Box w="100%" h="60vh" p={4} bgColor="gray.200" borderRadius="20px">
      <HStack>
        <Highlight
          query={[driverName, lastData.pontos.toString()]}
          styles={{
            px: "1",
            bg: "green.700",
            color: "white",
            borderRadius: "20px",
          }}
        >
          {title}
        </Highlight>
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

      <ResponsiveContainer
        style={{ backgroundColor: "white", marginTop: "10px" }}
      >
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="date" scale="time" tickFormatter={formatXAxis} />
          <YAxis />
          <Tooltip labelFormatter={(value) => formatXAxis(value)} />
          <Legend />
          <Line type="monotone" dataKey="pontos" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PointsPerDriverChart;
