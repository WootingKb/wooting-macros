import { invoke } from '@tauri-apps/api/tauri'
import { Collection, MacroData } from './types'

export const updateBackendConfig = (collections: Collection[]) => {
  const macroData: MacroData = { data: collections }
  console.log(macroData)
  invoke<void>('set_macros', { frontendData: macroData }).catch((e) => {
    console.error(e)
  })
}

export const checkIfStringIsNonNumeric: (text: string) => boolean = function (
  value: string
): boolean {
  return !(isNaN(Number(value)) === false)
}
