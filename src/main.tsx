import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { theme } from './theme/index'
import { ApplicationProvider } from './contexts/applicationContext'
import { SettingsProvider } from './contexts/settingsContext'
import { MacroProvider } from './contexts/macroContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ApplicationProvider>
      <SettingsProvider>
        <MacroProvider>
          <App />
        </MacroProvider>
      </SettingsProvider>
    </ApplicationProvider>
  </ChakraProvider>
)
