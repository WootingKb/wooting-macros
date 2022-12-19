import { invoke } from '@tauri-apps/api/tauri'
import { MouseButton } from './enums'
import { ApplicationConfig, Collection, MacroData } from './types'

export const maxNameLength = 25

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

export const isMouseButtonArray = (
  items: number[] | MouseButton[]
): items is MouseButton[] => {
  return Object.keys(MouseButton).includes(
    (items as MouseButton[])[0].toString()
  )
}

export const checkIfStringIsNonNumeric: (text: string) => boolean = function (
  value: string
): boolean {
  return !(isNaN(Number(value)) === false)
}
