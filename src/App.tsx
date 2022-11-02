import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import "./App.css";
import {Flex} from '@chakra-ui/react'
import {Route} from "wouter";
import Overview from "./components/Overview";
import AddMacroView from "./components/AddMacroView";
import EditMacroView from "./components/EditMacroView";
import {Collection} from "./types";

function App() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    invoke<Collection[]>("get_configuration").then((res) => {
      console.log(res)
      setCollections(res)

      setLoading(false)
    }).catch(e => {
      console.error(e)
    })
  }, [])

  // Loading State is required, since getting data from the backend is async - Update Loading Screen
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
