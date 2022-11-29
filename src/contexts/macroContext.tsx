import {
  ReactNode,
  useState,
  useMemo,
  useContext,
  createContext,
  useCallback,
  useEffect
} from 'react'
import { MacroType, ViewState } from '../enums'
import { MacroState, ActionEventType, Keypress, Macro } from '../types'
import { useApplicationContext } from './applicationContext'
import { useSelectedCollection, useSelectedMacro } from './selectors'

type MacroProviderProps = { children: ReactNode }

const MacroContext = createContext<MacroState | undefined>(undefined)

function useMacroContext() {
  const context = useContext(MacroContext)
  if (context === undefined) {
    throw new Error('useMacroContext must be used within a MacroProvider')
  }
  return context
}

function MacroProvider({ children }: MacroProviderProps) {
  const [macroName, setMacroName] = useState('')
  const [triggerKeys, setTriggerKeys] = useState<Keypress[]>([])
  const [allowWhileOtherKeys, setAllowWhileOtherKeys] = useState(false) // allows the trigger to be registered if the input contains more than the trigger keys
  const [macroType, setMacroType] = useState(0)
  const [sequence, setSequence] = useState<ActionEventType[]>([])
  const [ids, setIds] = useState<number[]>([])
  const [selectedElementId, setSelectedElementId] = useState<
    number | undefined
  >(undefined)
  const currentMacro = useSelectedMacro()
  const currentCollection = useSelectedCollection()
  const { viewState, selection, onCollectionUpdate, changeSelectedMacroIndex } =
    useApplicationContext()

  useEffect(() => {
    if (currentMacro === undefined) {
      return
    }
    console.log(currentMacro)
    setMacroName(currentMacro.name)
    setTriggerKeys(currentMacro.trigger.data)
    setMacroType(MacroType[currentMacro.macro_type as keyof typeof MacroType])
    setSequence(currentMacro.sequence)
    setIds(currentMacro.sequence.map((_, i) => i + 1))
  }, [currentMacro])

  const updateMacroName = useCallback(
    (newName: string) => {
      console.log(newName)
      setMacroName(newName)
    },
    [setMacroName]
  )

  const updateMacroType = useCallback(
    (newType: MacroType) => {
      setMacroType(newType)
    },
    [setMacroType]
  )

  const updateTriggerKeys = useCallback(
    (newArray: Keypress[]) => {
      setTriggerKeys(newArray)
    },
    [setTriggerKeys]
  )

  const updateAllowWhileOtherKeys = useCallback(
    (value: boolean) => {
      setAllowWhileOtherKeys(value)
    },
    [setAllowWhileOtherKeys]
  )

  const onIdAdd = useCallback(
    (newId: number) => {
      setIds((ids) => [...ids, newId])
    },
    [setIds]
  )

  const onIdDelete = useCallback(
    // ask about how to clean this up, and prevent flickering (due to rerender)
    (IdToRemove: number) => {
      setIds((ids) => {
        const temp = [...ids]
        for (let i = 0; i < temp.length; i++) {
          if (temp[i] > temp[IdToRemove]) {
            temp[i]--
          }
        }
        temp.splice(IdToRemove, 1)
        return temp
      })
    },
    [setIds]
  )

  const overwriteIds = useCallback(
    (newArray: number[]) => {
      setIds(newArray)
    },
    [setIds]
  )

  const updateSelectedElementId = useCallback(
    (newIndex: number | undefined) => {
      setSelectedElementId(newIndex)
    },
    [setSelectedElementId]
  )

  const onElementAdd = useCallback(
    (newElement: ActionEventType) => {
      setSequence((sequence) => {
        const newSequence = [...sequence, newElement]
        onIdAdd(newSequence.length)
        return newSequence
      })
    },
    [onIdAdd, setSequence]
  )

  const updateElement = useCallback(
    (newElement: ActionEventType, index: number) => {
      setSequence((sequence) => {
        console.log(sequence)
        const newSequence = [...sequence]
        newSequence[index] = newElement
        console.log(newSequence)
        return newSequence
      })
    },
    [setSequence]
  )

  const onElementDelete = useCallback(
    (index: number) => {
      const newSequence = sequence.filter((_, i) => i !== index)
      setSequence(newSequence)
      onIdDelete(index)
    },
    [onIdDelete, sequence]
  )

  const overwriteSequence = useCallback(
    (newSequence: ActionEventType[]) => {
      setSequence(newSequence)
      setIds(newSequence.map((_, i) => i + 1))
    },
    [setSequence, setIds]
  )

  const updateMacro = useCallback(() => {
    // activated when the user presses the "Save Macro" button
    // Updates the collection data with new macro / edited macro data
    const itemToAdd: Macro = {
      name: macroName,
      active: true,
      macro_type: MacroType[macroType],
      trigger: {
        type: 'KeyPressEvent',
        data: triggerKeys,
        allow_while_other_keys: allowWhileOtherKeys
      },
      sequence: ids.map((id) => sequence[id - 1])
    }

    const newCollection = { ...currentCollection }

    if (
      viewState === ViewState.Editview &&
      selection.macroIndex !== undefined
    ) {
      newCollection.macros[selection.macroIndex] = itemToAdd
    } else {
      newCollection.macros.push(itemToAdd)
    }

    onCollectionUpdate(newCollection, selection.collectionIndex)
    // switches views
    changeSelectedMacroIndex(undefined)
    // no need to set anything to null, macro context is done and thrown away
    // next time user goes to macroview, there will be a new macro context with the default data
    // ask about the sheer number of dependencies lol, turn this into a store?
  }, [
    allowWhileOtherKeys,
    changeSelectedMacroIndex,
    currentCollection,
    ids,
    macroName,
    macroType,
    onCollectionUpdate,
    selection.collectionIndex,
    selection.macroIndex,
    sequence,
    triggerKeys,
    viewState
  ])

  const value = useMemo<MacroState>(
    () => ({
      macroName,
      macroType,
      triggerKeys,
      allowWhileOtherKeys,
      sequence,
      ids,
      selectedElementId,
      updateMacroName,
      updateMacroType,
      updateTriggerKeys,
      updateAllowWhileOtherKeys,
      onElementAdd,
      updateElement,
      onElementDelete,
      overwriteSequence,
      onIdAdd,
      onIdDelete,
      overwriteIds,
      updateSelectedElementId,
      updateMacro
    }),
    [
      macroName,
      macroType,
      triggerKeys,
      allowWhileOtherKeys,
      sequence,
      ids,
      selectedElementId,
      updateMacroName,
      updateMacroType,
      updateTriggerKeys,
      updateAllowWhileOtherKeys,
      onElementAdd,
      updateElement,
      onElementDelete,
      overwriteSequence,
      onIdAdd,
      onIdDelete,
      overwriteIds,
      updateSelectedElementId,
      updateMacro
    ]
  )

  return <MacroContext.Provider value={value}>{children}</MacroContext.Provider>
}

export { MacroProvider, useMacroContext }
