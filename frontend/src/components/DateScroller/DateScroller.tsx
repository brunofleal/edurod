import { HStack, Button, Text, Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { formatDateToLocalTime } from "../../shared/utils/formatDate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
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
    const getCurrentMonthPeriod = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const start = new Date(year, month, 1).toISOString().split("T")[0];
        const end = new Date(year, month + 1, 1).toISOString().split("T")[0];

        return { start, end };
    };

    const shiftDate = (direction: "right" | "left") => {
        if (!value) return;

        const startDate = new Date(value.start);
        const monthOffset = direction === "right" ? 2 : 0;

        // Let Date constructor handle month/year overflow automatically
        const newStartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + monthOffset,
            1
        );

        const start = newStartDate.toISOString().split("T")[0];
        const end = new Date(
            newStartDate.getFullYear(),
            newStartDate.getMonth() + 1,
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
        </HStack>
    );
};

export default DateScroller;
