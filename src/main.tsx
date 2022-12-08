import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from './theme'
import { ApplicationProvider } from './contexts/applicationContext'
import { SettingsProvider } from './contexts/settingsContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ApplicationProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </ApplicationProvider>
  </ChakraProvider>
)
