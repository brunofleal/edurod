import { getCurrentMonthRange } from "../../../shared/utils/formatDate";

export const getMockedChartData = () => {
  const [startDate, endDate] = getCurrentMonthRange();
  let currentDate = startDate;
  let points = 100;
  const data = [];
  while (currentDate < endDate) {
    currentDate = currentDate.add("days", 1);
    points = Math.max(points - Math.floor(Math.random() * 5), 0);
    data.push({ date: currentDate.toDate(), pontos: points });
  }
  return data;
};
