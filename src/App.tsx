import { appWindow, PhysicalSize } from '@tauri-apps/api/window'
import { Flex } from '@chakra-ui/react'
import Overview from './views/Overview'
import AddMacroView from './views/AddMacroView'
import EditMacroView from './views/EditMacroView'
import { ViewState } from './enums'
import { useApplicationContext } from './contexts/applicationContext'

function App() {
  const { viewState, initComplete } = useApplicationContext()
  appWindow.setMinSize(new PhysicalSize(800, 600))

  // TODO: Update Loading Screen & investigate loading time of application prior to loading screen taking effect
  if (!initComplete) {
    return (
      <Flex h="100vh" justifyContent="center" alignItems="center">
        Loading
      </Flex>
    )
  }

  return (
    <Flex h="100vh" direction="column">
      {viewState === ViewState.Overview && <Overview />}
      {viewState === ViewState.Addview && <AddMacroView />}
      {viewState === ViewState.Editview && <EditMacroView />}
    </Flex>
  )
}

export default App
