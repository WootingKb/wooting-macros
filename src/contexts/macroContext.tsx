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
import { MacroState, ActionEventType, Macro, TriggerEventType } from '../types'
import { maxNameLength } from '../utils'
import { useApplicationContext } from './applicationContext'
import { useSelectedCollection, useSelectedMacro } from './selectors'
import { useSettingsContext } from './settingsContext'

type MacroProviderProps = { children: ReactNode }

const MacroContext = createContext<MacroState | undefined>(undefined)

function useMacroContext() {
  const context = useContext(MacroContext)
  if (context === undefined) {
    throw new Error('useMacroContext must be used within a MacroProvider')
  }
  return context
}

const macroDefault: Macro = {
  name: '',
  icon: ':smile:',
  active: true,
  macro_type: 'Single',
  trigger: { type: 'KeyPressEvent', data: [], allow_while_other_keys: false },
  sequence: []
}

function MacroProvider({ children }: MacroProviderProps) {
  const [macro, setMacro] = useState<Macro>(macroDefault)
  const [sequence, setSequence] = useState<ActionEventType[]>([]) // still needed because of how the sortable list works
  const [ids, setIds] = useState<number[]>([])
  const [selectedElementId, setSelectedElementId] = useState<
    number | undefined
  >(undefined)
  const [isUpdatingMacro, setIsUpdatingMacro] = useState(false)
  const currentMacro = useSelectedMacro()
  const currentCollection = useSelectedCollection()
  const { viewState, selection, onCollectionUpdate, changeSelectedMacroIndex } =
    useApplicationContext()
  const { config } = useSettingsContext()

  useEffect(() => {
    if (currentMacro === undefined) {
      return
    }
    setIds(currentMacro.sequence.map((_, i) => i + 1))
    setSequence(currentMacro.sequence)
    setMacro(currentMacro)
  }, [currentMacro])

  const updateMacroName = useCallback(
    (newName: string) => {
      if (newName.length > maxNameLength) {
        return
      }
      setMacro({ ...macro, name: newName })
    },
    [macro, setMacro]
  )
  const updateMacroIcon = useCallback(
    (newIcon: string) => {
      setMacro({ ...macro, icon: newIcon })
    },
    [macro, setMacro]
  )

  const updateMacroType = useCallback(
    (newType: MacroType) => {
      setMacro({ ...macro, macro_type: MacroType[newType] })
    },
    [macro, setMacro]
  )

  const updateTrigger = useCallback(
    (newElement: TriggerEventType) => {
      setMacro({ ...macro, trigger: newElement })
    },
    [macro, setMacro]
  )

  const updateAllowWhileOtherKeys = useCallback(
    (value: boolean) => {
      const temp = { ...macro, trigger: macro.trigger }
      if (temp.trigger.type === 'KeyPressEvent') {
        temp.trigger.allow_while_other_keys = value
      }
      setMacro(temp)
    },
    [macro, setMacro]
  )

  const onIdAdd = useCallback(
    (newId: number) => {
      setIds([...ids, newId])
    },
    [ids, setIds]
  )

  const onIdsAdd = useCallback(
    (newIds: number[]) => {
      setIds([...ids, ...newIds])
    },
    [ids, setIds]
  )

  const onIdDelete = useCallback(
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
      const newSequence = [...sequence, newElement]
      onIdAdd(newSequence.length)
      setSequence(newSequence)
      if (config.AutoSelectElement) {
        if (newElement.type === 'SystemEventAction') {
          if (newElement.data.type === 'Volume') {
            return
          } else if (
            newElement.data.type === 'Clipboard' &&
            newElement.data.action.type === 'Sarcasm'
          ) {
            return
          }
        }
        updateSelectedElementId(newSequence.length - 1)
      }
    },
    [config.AutoSelectElement, onIdAdd, sequence, updateSelectedElementId]
  )
  const onElementsAdd = useCallback(
    (newElements: ActionEventType[]) => {
      const newSequence = [...sequence, ...newElements]
      const newIds = [...Array(newSequence.length).keys()].filter(
        (i) => i >= sequence.length
      )
      onIdsAdd(newIds.map((i) => i + 1))
      setSequence(newSequence)
      if (config.AutoSelectElement) {
        if (newElements[1].type === 'SystemEventAction') {
          if (newElements[1].data.type === 'Volume') {
            return
          } else if (
            newElements[1].data.type === 'Clipboard' &&
            newElements[1].data.action.type === 'Sarcasm'
          ) {
            return
          }
        }
        updateSelectedElementId(newSequence.length - 1)
      }
    },
    [config.AutoSelectElement, onIdsAdd, sequence, updateSelectedElementId]
  )

  const updateElement = useCallback(
    (newElement: ActionEventType, index: number) => {
      const newSequence = sequence.map((element, i) => {
        return i === index ? newElement : element
      })
      setSequence(newSequence)
    },
    [sequence, setSequence]
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
    changeSelectedMacroIndex(undefined)
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

  const changeIsUpdatingMacro = useCallback(
    (newVal: boolean) => {
      setIsUpdatingMacro(newVal)
    },
    [setIsUpdatingMacro]
  )

  const value = useMemo<MacroState>(
    () => ({
      macro,
      sequence,
      ids,
      selectedElementId,
      isUpdatingMacro,
      updateMacroName,
      updateMacroIcon,
      updateMacroType,
      updateTrigger,
      updateAllowWhileOtherKeys,
      onElementAdd,
      onElementsAdd,
      updateElement,
      onElementDelete,
      overwriteSequence,
      onIdAdd,
      onIdsAdd,
      onIdDelete,
      overwriteIds,
      updateSelectedElementId,
      updateMacro,
      changeIsUpdatingMacro
    }),
    [
      macro,
      sequence,
      ids,
      selectedElementId,
      isUpdatingMacro,
      updateMacroName,
      updateMacroIcon,
      updateMacroType,
      updateTrigger,
      updateAllowWhileOtherKeys,
      onElementAdd,
      onElementsAdd,
      updateElement,
      onElementDelete,
      overwriteSequence,
      onIdAdd,
      onIdsAdd,
      onIdDelete,
      overwriteIds,
      updateSelectedElementId,
      updateMacro,
      changeIsUpdatingMacro
    ]
  )

  return <MacroContext.Provider value={value}>{children}</MacroContext.Provider>
}

export { MacroProvider, useMacroContext }
