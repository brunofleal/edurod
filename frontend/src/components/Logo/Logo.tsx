import { HStack, Text } from "@chakra-ui/react";

const Logo = () => {
    return (
        <HStack
            bgClip="text"
            padding={0}
            m={0}
            gap={0}
            justifyContent="center"
            bgGradient="to-r"
            gradientFrom="red.400"
            gradientTo="green.400"
        >
            <Text
                fontSize="3xl"
                fontWeight="extrabold"
                WebkitTextStroke="1px black"
            >
                EduRod
            </Text>
        </HStack>
    );
};

export default Logo;
