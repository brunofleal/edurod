import { HStack, Button, Text, Box, Menu, Portal } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { formatDateToLocalTime } from "../../shared/utils/formatDate";
import { BsCalendarDate, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { MdOutlineUpdate } from "react-icons/md";

export interface Period {
    start: string;
    end: string;
}

interface Props {
    value: Period | undefined;
    setValue: (value: Period) => void;
}

const DateScroller = ({ value, setValue }: Props) => {
    const [monthsPeriod, setMonthsPeriod] = useState(1);
    const items = [
        { label: "1 mês", value: 1 },
        { label: "3 meses", value: 3 },
    ];

    const getCurrentMonthPeriod = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const start = new Date(year, month + 1 - monthsPeriod, 1)
            .toISOString()
            .split("T")[0];
        const end = new Date(year, month + 1, 1).toISOString().split("T")[0];

        return { start, end };
    };

    const shiftDate = (direction: "right" | "left") => {
        if (!value) return;

        const startDate = new Date(value.start);
        const monthOffset = direction === "right" ? 2 : 0;

        // Calculate new start date (always move by 1 month)
        const newStartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + monthOffset,
            1
        );

        const start = newStartDate.toISOString().split("T")[0];
        // End date is the last day of the period (monthsPeriod months from start)
        const end = new Date(
            newStartDate.getFullYear(),
            newStartDate.getMonth() + monthsPeriod,
            1
        )
            .toISOString()
            .split("T")[0];

        setValue({ start, end });
    };

    useEffect(() => {
        if (value === undefined) {
            setValue(getCurrentMonthPeriod());
        }
    }, [value]);

    useEffect(() => {
        // When monthsPeriod changes, update the period based on current start date
        if (value) {
            const startDate = new Date(value.start);
            const start = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                1
            )
                .toISOString()
                .split("T")[0];
            const end = new Date(
                startDate.getFullYear(),
                startDate.getMonth() + monthsPeriod,
                1
            )
                .toISOString()
                .split("T")[0];
            setValue({ start, end });
        } else {
            setValue(getCurrentMonthPeriod());
        }
    }, [monthsPeriod]);

    return (
        <HStack
            gap={4}
            align="center"
            border="dashed 2px black"
            borderRadius="5%"
            p={1}
            bgColor="white"
        >
            <Button
                size="xs"
                variant="outline"
                onClick={() => shiftDate("left")}
                disabled={!value}
            >
                <BsChevronLeft />
            </Button>

            <Box textAlign="center" minW="200px">
                {value && (
                    <Text fontSize="md" fontWeight="medium">
                        {`${formatDateToLocalTime(value.start, { onlyDate: true })} - ${formatDateToLocalTime(value.end, { onlyDate: true })} (${new Date(value.end).toLocaleDateString("pt-BR", { month: "long" })}/${new Date(value.end).getFullYear()})`}
                    </Text>
                )}
            </Box>

            <Button
                size="xs"
                variant="outline"
                onClick={() => shiftDate("right")}
                disabled={!value}
            >
                <BsChevronRight />
            </Button>
            <Button
                size="xs"
                variant="outline"
                onClick={() => setValue(getCurrentMonthPeriod())}
                disabled={!value}
            >
                <MdOutlineUpdate />
            </Button>
            <Menu.Root>
                <Menu.Trigger asChild>
                    <Button variant="outline" size="sm">
                        <BsCalendarDate /> {monthsPeriod}
                        {monthsPeriod > 1 ? " Meses" : " Mês"}
                    </Button>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content minW="10rem">
                            <Menu.RadioItemGroup
                                value={String(monthsPeriod)}
                                onValueChange={(e) =>
                                    setMonthsPeriod(Number(e.value))
                                }
                            >
                                {items.map((item) => (
                                    <Menu.RadioItem
                                        key={item.value}
                                        value={String(item.value)}
                                    >
                                        {item.label}
                                        <Menu.ItemIndicator />
                                    </Menu.RadioItem>
                                ))}
                            </Menu.RadioItemGroup>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        </HStack>
    );
};

export default DateScroller;
