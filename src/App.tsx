import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { Box, Button, Flex, useColorMode } from '@chakra-ui/react'

function App() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box minH="100vh">
      <Flex minH="100vh" direction="column" justifyContent="center" alignItems="center" gap="4">
        <h1>Welcome to Tauri!</h1>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </Flex>
    </Box>
  );
}

export default App;
