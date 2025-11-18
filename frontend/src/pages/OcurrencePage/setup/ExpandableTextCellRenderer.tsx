import React, { useState } from "react";
import { Box, Button, Icon, Text } from "@chakra-ui/react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

const MAX_LENGTH = 80;

const ExpandableTextCellRenderer = (value: string) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const text = value || "";

    if (text.length <= MAX_LENGTH) {
        return <Text>{text}</Text>;
    }

    return (
        <Box>
            <Text>
                {isExpanded ? text : `${text.substring(0, MAX_LENGTH)}...`}
            </Text>
            <Button
                size="xs"
                variant="solid"
                onClick={() => setIsExpanded(!isExpanded)}
                my={2}
            >
                <Icon>{isExpanded ? <BsChevronUp /> : <BsChevronDown />}</Icon>
                {isExpanded ? "Mostrar menos" : "Mostrar mais"}
            </Button>
        </Box>
    );
};

export default ExpandableTextCellRenderer;
