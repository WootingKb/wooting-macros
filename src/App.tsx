import { appWindow, PhysicalSize } from '@tauri-apps/api/window'
import { Flex } from '@chakra-ui/react'
import Overview from './views/Overview'
import { ViewState } from './enums'
import { useApplicationContext } from './contexts/applicationContext'
import { SequenceProvider } from './contexts/sequenceContext'
import Macroview from './views/Macroview'
import { useEffect } from 'react'

function App() {
  const { viewState, initComplete } = useApplicationContext()

  useEffect(() => {
    appWindow.setMinSize(new PhysicalSize(800, 600))
  }, [])

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
      <SequenceProvider>
        {viewState === ViewState.Addview && <Macroview isEditing={false} />}
        {viewState === ViewState.Editview && <Macroview isEditing={true} />}
      </SequenceProvider>
    </Flex>
  )
}

export default App
