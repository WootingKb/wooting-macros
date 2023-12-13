import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react'
import Overview from './views/Overview'
import { ViewState } from './constants/enums'
import { useApplicationContext } from './contexts/applicationContext'
import Macroview from './views/Macroview'
import { useEffect } from 'react'
import data from '@emoji-mart/data'
import { init } from 'emoji-mart'
import './App.css'
import { MacroProvider } from './contexts/macroContext'
import MacroSettingsModal from './views/MacroSettingsModal'
import SettingsModal from './views/SettingsModal'

function App() {
  const { viewState, initComplete } = useApplicationContext()
  const {
    isOpen: isOpenSettings,
    onOpen: onOpenSettings,
    onClose: onCloseSettings
  } = useDisclosure()
  const {
    isOpen: isOpenMacroSettings,
    onOpen: onOpenMacroSettings,
    onClose: onCloseMacroSettings
  } = useDisclosure()

  useEffect(() => {
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
          // backgroundImage="url('/keycapPattern.png')"
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
        // backgroundImage="url('/keycapPattern.png')"
      />
      {viewState === ViewState.Overview && (
        <Overview onOpenSettingsModal={onOpenSettings} />
      )}
      {viewState === ViewState.Addview && (
        <MacroProvider>
          <Macroview
            isEditing={false}
            onOpenMacroSettingsModal={onOpenMacroSettings}
          />
        </MacroProvider>
      )}
      {viewState === ViewState.Editview && (
        <MacroProvider>
          <Macroview
            isEditing={true}
            onOpenMacroSettingsModal={onOpenMacroSettings}
          />
        </MacroProvider>
      )}
      <SettingsModal isOpen={isOpenSettings} onClose={onCloseSettings} />
      <MacroSettingsModal
        isOpen={isOpenMacroSettings}
        onClose={onCloseMacroSettings}
      />
    </Flex>
  )
}

export default App
