import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { MacroType, ViewState } from '../constants/enums'
import { checkIfElementIsEditable } from '../constants/utils'
import { ActionEventType, KeyPressEventAction, Macro, MacroState, MouseEventAction, TriggerEventType } from '../types'
import { useApplicationContext } from './applicationContext'
import { useSelectedCollection, useSelectedMacro } from './selectors'
import { useSettingsContext } from './settingsContext'

interface MacroProviderProps {
  children: ReactNode
}

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
  enabled: true,
  macro_type: 'Single',
  trigger: {type: 'KeyPressEvent', data: [], allow_while_other_keys: false},
  sequence: [],
  repeat_amount: 1,
}

function MacroProvider({children}: MacroProviderProps) {
  const [macro, setMacro] = useState<Macro>(macroDefault)
  const [sequence, setSequence] = useState<ActionEventType[]>([])
  const [ids, setIds] = useState<number[]>([])
  const [selectedElementId, setSelectedElementId] = useState<
    number | undefined
  >(undefined)
  const [isUpdatingMacro, setIsUpdatingMacro] = useState(false)
  const currentMacro = useSelectedMacro()
  const currentCollection = useSelectedCollection()
  const {
    collections,
    viewState,
    selection,
    onCollectionUpdate,
    changeSelectedMacroIndex
  } = useApplicationContext()
  const {config} = useSettingsContext()

  const keypressesInSequence = useMemo(() => {
    return sequence
      .filter(
        (element): element is KeyPressEventAction =>
          element.type === 'KeyPressEventAction'
      )
      .map((element: KeyPressEventAction) => element.data.keypress)
  }, [sequence])

  const mousepressesInSequence = useMemo(() => {
    return sequence
      .filter(
        (element): element is MouseEventAction =>
          element.type === 'MouseEventAction'
      )
      .map((element: MouseEventAction) => element.data.data.button)
  }, [sequence])

  const willCauseTriggerLooping = useMemo(() => {
    let willTriggerAnotherMacro = false

    for (const collection of collections) {
      for (let index = 0; index < collection.macros.length; index++) {
        if (index === selection.macroIndex) {
          continue
        }

        const macroToCheck = collection.macros[index]

        if (macroToCheck.trigger.type === 'KeyPressEvent') {
          willTriggerAnotherMacro = macroToCheck.trigger.data.every(
            (triggerKey) => keypressesInSequence.includes(triggerKey)
          )
          if (willTriggerAnotherMacro) {
            break
          }
        } else {
          willTriggerAnotherMacro = mousepressesInSequence.includes(
            macroToCheck.trigger.data
          )
          if (willTriggerAnotherMacro) {
            break
          }
        }
      }
    }

    // Check the data for the currently editing macro, as the user may have changed the trigger but not saved yet
    if (macro.trigger.type === 'KeyPressEvent') {
      if (macro.trigger.data.length > 0) {
        willTriggerAnotherMacro = macro.trigger.data.every((triggerKey) =>
          keypressesInSequence.includes(triggerKey)
        )
      }
    } else {
      if (macro.trigger.data !== undefined) {
        willTriggerAnotherMacro = mousepressesInSequence.includes(
          macro.trigger.data
        )
      }
    }
    return willTriggerAnotherMacro
  }, [
    collections,
    macro.trigger.data,
    macro.trigger.type,
    keypressesInSequence,
    mousepressesInSequence,
    selection.macroIndex
  ])
  const canSaveMacro = useMemo(() => {
    if (
      (macro.trigger.type === 'KeyPressEvent' &&
        macro.trigger.data.length === 0) ||
      (macro.trigger.type === 'MouseEvent' &&
        macro.trigger.data === undefined) ||
      sequence.length === 0
    ) {
      return false
    }

    return true
  }, [
    macro.trigger.data,
    macro.trigger.type,
    sequence.length,
    willCauseTriggerLooping
  ])

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
      setMacro({...macro, name: newName})
    },
    [macro, setMacro]
  )
  const updateMacroIcon = useCallback(
    (newIcon: string) => {
      setMacro({...macro, icon: newIcon})
    },
    [macro, setMacro]
  )

  const updateMacroType = useCallback(
    (newType: MacroType) => {
      setMacro({...macro, macro_type: MacroType[newType]})
    },
    [macro, setMacro]
  )

  const updateMacroRepeatAmount = useCallback(
    (repeat_amount: number) => {
      setMacro({...macro, repeat_amount})
    },
    [macro, setMacro]
  )

  const updateTrigger = useCallback(
    (newElement: TriggerEventType) => {
      setMacro({...macro, trigger: newElement})
    },
    [macro, setMacro]
  )

  const updateAllowWhileOtherKeys = useCallback(
    (value: boolean) => {
      const temp = {...macro, trigger: macro.trigger}
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
      if (config.AutoSelectElement && checkIfElementIsEditable(newElement)) {
        updateSelectedElementId(newSequence.length - 1)
      }
    },
    [config, onIdAdd, sequence, updateSelectedElementId]
  )
  const onElementsAdd = useCallback(
    (newElements: ActionEventType[]) => {
      const newSequence = [...sequence, ...newElements]
      const newIds = [...Array(newSequence.length).keys()].filter(
        (i) => i >= sequence.length
      )
      onIdsAdd(newIds.map((i) => i + 1))
      setSequence(newSequence)
      if (
        config.AutoSelectElement &&
        checkIfElementIsEditable(newElements[newElements.length - 1])
      ) {
        updateSelectedElementId(newSequence.length - 1)
      }
    },
    [config, onIdsAdd, sequence, updateSelectedElementId]
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
    let itemToAdd = {
      ...macro,
      sequence: ids.map((id) => sequence[id - 1])
    }

    if (macro.name === '') {
      itemToAdd = {
        ...itemToAdd,
        name: `Macro ${currentCollection.macros.length}`
      }
    }

    const newCollection = {...currentCollection}
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
      canSaveMacro,
      willCauseTriggerLooping,
      updateMacroName,
      updateMacroIcon,
      updateMacroType,
      updateMacroRepeatAmount,
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
      canSaveMacro,
      willCauseTriggerLooping,
      updateMacroName,
      updateMacroIcon,
      updateMacroType,
      updateMacroRepeatAmount,
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
