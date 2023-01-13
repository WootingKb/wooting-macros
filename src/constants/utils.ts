import { invoke } from '@tauri-apps/api/tauri'
import { HIDCategory, MouseButton } from './enums'
import {
  ApplicationConfig,
  Collection,
  Keypress,
  MacroData,
  MousePressAction
} from '../types'
import { HIDLookup } from './HIDmap'

export const updateBackendConfig = (
  collections: Collection[]
): Promise<void> => {
  const macroData: MacroData = { data: collections }
  return invoke<void>('set_macros', { frontendData: macroData })
}

export const updateSettings = (newConfig: ApplicationConfig): Promise<void> => {
  return invoke<void>('set_config', { config: newConfig })
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

/** Currently unused, if Macro types are added back this can probably be refactored elsewhere */
export const checkIfStringIsNonNumeric = (value: string): boolean => {
  return !(isNaN(Number(value)) === false)
}

export const checkIfModifierKey = (hid: number): boolean => {
  return HIDLookup.get(hid)?.category === HIDCategory.Modifier
}

export const scrollbarStylesLight = {
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#D5DAE2',
    borderRadius: '8px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#9EAABD',
    borderRadius: '8px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#8392AA',
    borderRadius: '8px'
  }
}

export const scrollbarsStylesDark = {
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#27272a',
    borderRadius: '8px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#3f3f46',
    borderRadius: '8px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#52525b',
    borderRadius: '8px'
  }
}
