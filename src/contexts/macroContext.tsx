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
  const [macro, setMacro] = useState<Macro>({
    name: '',
    active: true,
    macro_type: 'Single',
    trigger: { type: 'KeyPressEvent', data: [], allow_while_other_keys: false },
    sequence: []
  })
  const [sequence, setSequence] = useState<ActionEventType[]>([]) // still needed because of how the sortable list works
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
    setMacro(currentMacro)
    setIds(currentMacro.sequence.map((_, i) => i + 1))
  }, [currentMacro])

  const updateMacroName = useCallback(
    (newName: string) => {
      setMacro((macro) => {
        return { ...macro, name: newName }
      })
    },
    [setMacro]
  )

  const updateMacroType = useCallback(
    (newType: MacroType) => {
      setMacro((macro) => {
        return { ...macro, macro_type: MacroType[newType] }
      })
    },
    [setMacro]
  )

  const updateTriggerKeys = useCallback(
    (newArray: Keypress[]) => {
      setMacro((macro) => {
        const temp = { ...macro }
        temp.trigger.data = newArray
        return temp
      })
    },
    [setMacro]
  )

  const updateAllowWhileOtherKeys = useCallback(
    (value: boolean) => {
      setMacro((macro) => {
        const temp = { ...macro }
        temp.trigger.allow_while_other_keys = value
        return temp
      })
    },
    [setMacro]
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
    const itemToAdd = {
      ...macro,
      sequence: ids.map((id) => sequence[id - 1]) // set sequence in order that the user set
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
    changeSelectedMacroIndex,
    currentCollection,
    ids,
    macro,
    onCollectionUpdate,
    selection.collectionIndex,
    selection.macroIndex,
    sequence,
    viewState
  ])

  const value = useMemo<MacroState>(
    () => ({
      macro,
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
      macro,
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
