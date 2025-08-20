import { Box } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  navigate("/occurrences");
  return (
    <Box bgGradient="to-r" gradientFrom="red.200" gradientTo="blue.200"></Box>
  );
};

export default HomePage;
