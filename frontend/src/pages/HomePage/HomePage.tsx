import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/occurrences");
  }, []);
  return (
    <Box bgGradient="to-r" gradientFrom="red.200" gradientTo="blue.200">
      HomePage
    </Box>
  );
};

export default HomePage;
