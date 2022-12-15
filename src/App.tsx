import { appWindow, PhysicalSize } from '@tauri-apps/api/window'
import { Flex, useDisclosure } from '@chakra-ui/react'
import Overview from './views/Overview'
import { ViewState } from './enums'
import { useApplicationContext } from './contexts/applicationContext'
import Macroview from './views/Macroview'
import { useEffect } from 'react'
import { MacroProvider } from './contexts/macroContext'
import SettingsModal from './views/settings/SettingsModal'
import './App.css'

function App() {
  const { viewState, initComplete } = useApplicationContext()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    appWindow.setMinSize(new PhysicalSize(800, 600))
    document.addEventListener('contextmenu', (event) => event.preventDefault()) // disables tauri's right click context menu
  }, [])

  if (!initComplete) {
    return (
      <Flex h="100vh" justifyContent="center" alignItems="center">
        Loading
      </Flex>
    )
  }

  return (
    <Flex h="100vh" direction="column">
      {viewState === ViewState.Overview && (
        <Overview onOpenSettingsModal={onOpen} />
      )}
      {viewState === ViewState.Addview && (
        <MacroProvider key={0}>
          <Macroview />
        </MacroProvider>
      )}
      {viewState === ViewState.Editview && (
        <MacroProvider key={1}>
          <Macroview />
        </MacroProvider>
      )}
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  )
}

export default App
