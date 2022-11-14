import { ViewState } from './enums'

export interface CurrentSelection {
  collectionIndex: number
  macroIndex: number
}

export type AppState = {
  viewState: ViewState
  collections: Collection[]
  initComplete: boolean
  selection: CurrentSelection
  changeSelectedCollectionIndex: (index: number) => void
  changeSelectedMacroIndex: (index: number) => void
  changeViewState: (newState: ViewState) => void
}

export type SequenceState = {
  sequence: SequenceElement[]
  selectedElementIndex: number
  addToSequence: (element: SequenceElement) => void
  removeFromSequence: (element: SequenceElement) => void
  overwriteSequence: (newSequence: SequenceElement[]) => void
  updateElementIndex: (newIndex: number) => void
}

export interface SequenceElement {
  id: number
  data: ActionEventType
}

export interface Keypress {
  keypress: number
  press_duration: number
  keytype: string
}

export type TriggerEventType = {
  type: 'KeyPressEvent'
  data: Keypress[]
  allow_while_other_keys: boolean
}

export type ActionEventType =
  | { type: 'KeyPressEvent'; data: Keypress }
  | { type: 'Delay'; data: number }

export interface MacroData {
  data: Collection[]
}

export interface Macro {
  name: string
  active: boolean
  macro_type: string
  trigger: TriggerEventType
  sequence: ActionEventType[]
}

export interface Collection {
  name: string
  active: boolean
  macros: Macro[]
  icon: string
}
