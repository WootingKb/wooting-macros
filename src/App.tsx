import { appWindow, PhysicalSize } from '@tauri-apps/api/window'
import { Flex, useDisclosure, Text, Box } from '@chakra-ui/react'
import Overview from './views/Overview'
import { ViewState } from './constants/enums'
import { useApplicationContext } from './contexts/applicationContext'
import Macroview from './views/Macroview'
import { useEffect } from 'react'
import SettingsModal from './views/SettingsModal'
import data from '@emoji-mart/data'
import { init } from 'emoji-mart'
import './App.css'
import { MacroProvider } from './contexts/macroContext'

function App() {
  const { viewState, initComplete } = useApplicationContext()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    appWindow.setMinSize(new PhysicalSize(800, 600))
    document.addEventListener('contextmenu', (event) => event.preventDefault()) // disables tauri's right click context menu
    // TODO: Figure out how to disable other keyboard shortcuts like CTRL-F
    init({ data })
  }, [])

  if (!initComplete) {
    return (
      <Flex h="100vh" justifyContent="center" alignItems="center">
        <Box
          zIndex={-1}
          pos="absolute"
          w="full"
          h="full"
          opacity={0.15}
          backgroundImage="url('/keycapPattern.png')"
        />
        <Text fontSize="4xl" fontWeight="bold">
          Loading...
        </Text>
      </Flex>
    )
  }

  return (
    <Flex h="100vh" pos="relative" direction="column">
      <Box
        zIndex={-1}
        pos="absolute"
        w="full"
        h="full"
        opacity={0.15}
        backgroundImage="url('/keycapPattern.png')"
      />
      {viewState === ViewState.Overview && (
        <Overview onOpenSettingsModal={onOpen} />
      )}
      {viewState === ViewState.Addview && (
        <MacroProvider>
          <Macroview isEditing={false} onOpenSettingsModal={onOpen} />
        </MacroProvider>
      )}
      {viewState === ViewState.Editview && (
        <MacroProvider>
          <Macroview isEditing={true} onOpenSettingsModal={onOpen} />
        </MacroProvider>
      )}
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  )
}

export default App
