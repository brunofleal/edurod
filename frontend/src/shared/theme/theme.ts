import { createSystem, defaultConfig, defineRecipe } from "@chakra-ui/react";

const buttonRecipe = defineRecipe({
    variants: {
        variant: {
            outline: {
                bg: "white",
                border: "1px solid",
                borderColor: "gray.300",
                _hover: {
                    border: "2px solid",
                    borderColor: "black",
                    transform: "scale(0.95)",
                },
            },
        },
    },
});

export const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            fonts: {
                heading: { value: `'Roboto', sans-serif` },
                body: { value: `'Roboto', sans-serif` },
            },
        },
        recipes: {
            button: buttonRecipe,
        },
    },
});
