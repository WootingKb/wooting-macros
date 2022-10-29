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
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    invoke("push_frontend_first").then((res) => {
      if (typeof res === 'string') {
        // setCollections(JSON.parse(res))
      }

      if (collections.length == 0) {
        setCollections([
          {name:"Default", isActive: true, macros:[{"name": "Macro 1", "isActive": false, "trigger": ['a', 's', 'd'], "sequence": []}], icon:""}
        ])
      }

      setLoading(false)
    }).catch(e => {
      console.error(e)
    })
  }, [])

  if (isLoading) {
    return(
      <Flex h="100vh">
        Loading
      </Flex>
    )
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
