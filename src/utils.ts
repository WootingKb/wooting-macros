import { invoke } from '@tauri-apps/api/tauri'
import { Collection, Keypress, MacroData, TriggerTypes } from './types'

export const updateBackendConfig = (collections: Collection[]) => {
  const macroData: MacroData = { data: collections }
  invoke<void>('set_macros', { frontendData: macroData }).catch((e) => {
    console.error(e)
  })
}

export const isKeypressArray = (items: TriggerTypes): items is Keypress[] => {
  return typeof (items as Keypress[])[0] !== 'number'
}

export const checkIfStringIsNonNumeric: (text: string) => boolean = function (
  value: string
): boolean {
  return !(isNaN(Number(value)) === false)
}
