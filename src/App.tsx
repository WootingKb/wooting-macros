import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { Flex } from '@chakra-ui/react'
import { Route } from "wouter";
import Overview from "./components/Overview";
import MacroView from "./components/MacroView";

function App() {

  return (
    <Flex h="100vh" direction="column">
      <Route path="/">
        <Overview />
      </Route>
      <Route path="/macroview">
        <MacroView />
      </Route>
    </Flex>
  );
}

export default App;
