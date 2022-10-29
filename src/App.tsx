import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { Flex } from '@chakra-ui/react'
import { Route } from "wouter";
import Overview from "./components/Overview";
import AddMacroView from "./components/AddMacroView";
import EditMacroView from "./components/EditMacroView";
import { Collection, Macro } from "./types";

function App() {
  const [collections, setCollections] = useState<Collection[]>([])

  // let collections: Collection[] = [
  //   {name:"Default", isActive: true, macros:[{"name": "Macro 1", "isActive": false, "trigger": ['a', 's', 'd'], "sequence":"not available"}], icon:""}
  // ]
  let macros: Macro[] = []

  useEffect(() => {
    console.log("hello")
    invoke("export_frontend", {data: []}).then((result) => setCollections(result as Collection[]))
    console.log(collections)

    if (collections.length <= 0) {
      setCollections([
        {name:"Default", isActive: true, macros:[{"name": "Macro 1", "isActive": false, "trigger": ['a', 's', 'd'], "sequence":"not available"}], icon:""}
      ])
    }
  }, [])

  async function getCollections() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  }

  return (
    <Flex h="100vh" direction="column">
      <Route path="/">
        <Overview collections={collections}/>
      </Route>
      <Route path="/macroview/:cid">
        <AddMacroView collections={collections}/>
      </Route>
      <Route path="/editview/:cid/:mid">
        <EditMacroView collections={collections}/>
      </Route>
    </Flex>
  );
}

export default App;
