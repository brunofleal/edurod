import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router";
import { router } from "./shared/router/router";
import { system } from "./shared/theme/theme";
import AuthChecker from "./components/AuthChecker/AuthChecker";

function App() {
  return (
    <ChakraProvider value={system}>
      <AuthChecker />
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
