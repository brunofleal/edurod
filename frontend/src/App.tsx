import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router";
import { router } from "./shared/router/router";
import { system } from "./shared/theme/theme";

function App() {
    return (
        <ChakraProvider value={system}>
            <RouterProvider router={router} />
        </ChakraProvider>
    );
}

export default App;
