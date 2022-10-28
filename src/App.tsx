import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { Flex } from '@chakra-ui/react'
import { Route } from "wouter";
import Overview from "./components/Overview";
import AddMacroView from "./components/AddMacroView";
import EditMacroView from "./components/EditMacroView";
import { Macro } from "./types";

function App() {

  let macros: Macro[] = []

  return (
    <Flex h="100vh" direction="column">
      <Route path="/">
        <Overview macros={macros}/>
      </Route>
      <Route path="/macroview">
        <AddMacroView macros={macros}/>
      </Route>
      <Route path="/editview">
        <EditMacroView macro={macros[0]}/>
      </Route>
    </Flex>
  );
}

export default App;
