import { invoke } from '@tauri-apps/api/tauri'
import { MouseButton } from './enums'
import {
  ApplicationConfig,
  Collection,
  Keypress,
  MacroData,
  MousePressAction
} from '../types'

export const updateBackendConfig = (collections: Collection[]) => {
  const macroData: MacroData = { data: collections }
  invoke<void>('set_macros', { frontendData: macroData }).catch((e) => {
    console.error(e)
  })
}

export const updateSettings = (newConfig: ApplicationConfig) => {
  if ('AutoStart' in newConfig) {
    // BUG: without this type guard, some how macro data is passed through????
    invoke<void>('set_config', { config: newConfig }).catch((e) => {
      console.error(e)
    })
  }
}

export const updateMacroOutput = (value: boolean): Promise<void> => {
  return invoke<void>('control_grabbing', {
    frontendBool: !value
  })
}

export const checkIfMouseButtonArray = (
  items: number[] | MouseButton[]
): items is MouseButton[] => {
  return Object.keys(MouseButton).includes(
    (items as MouseButton[])[0].toString()
  )
}

export const checkIfKeypress = (
  e: Keypress | MousePressAction | undefined
): e is Keypress => {
  return (e as Keypress).keypress !== undefined
}

export const checkIfMouseButton = (
  e: Keypress | MousePressAction | undefined
): e is MousePressAction => {
  return (e as MousePressAction).button !== undefined
}

export const checkIfStringIsNonNumeric: (text: string) => boolean = function (
  value: string
): boolean {
  return !(isNaN(Number(value)) === false)
}

export const scrollbarStylesLight = {
  '&::-webkit-scrollbar': {
    width: '10px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#D5DAE2',
    borderRadius: '10px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#9EAABD',
    borderRadius: '10px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#8392AA',
    borderRadius: '10px'
  }
}

export const scrollbarsStylesDark = {
  '&::-webkit-scrollbar': {
    width: '10px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#27272a',
    borderRadius: '10px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#3f3f46',
    borderRadius: '10px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#52525b',
    borderRadius: '10px'
  }
}
