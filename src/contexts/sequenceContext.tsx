import {
  ReactNode,
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
  useCallback
} from 'react'
import { ViewState } from '../enums'
import { SequenceState, ActionEventType } from '../types'
import { useApplicationContext } from './applicationContext'
import { useSelectedMacro } from './selectors'

type SequenceProviderProps = { children: ReactNode }

const SequenceContext = createContext<SequenceState | undefined>(undefined)

function useSequenceContext() {
  const context = useContext(SequenceContext)
  if (context === undefined) {
    throw new Error('useSequenceContext must be used within a SequenceProvider')
  }
  return context
}

function SequenceProvider({ children }: SequenceProviderProps) {
  const { viewState } = useApplicationContext()
  const [sequence, setSequence] = useState<ActionEventType[]>([])
  const [ids, setIds] = useState<number[]>([])
  const [selectedElementId, setSelectedElementId] = useState(-1)
  const currentMacro = useSelectedMacro()

  useEffect(() => {
    if (viewState === ViewState.Addview) {
      setSequence([])
    } else if (viewState === ViewState.Editview) {
      setSequence(currentMacro.sequence)
    }
  }, [viewState])

  const onElementAdd = useCallback(
    (newElement: ActionEventType) => {
      setSequence((sequence) => [...sequence, newElement])
    },
    [setSequence]
  )

  const onSelectedElementDelete = useCallback(
    () => {
      const newSequence = sequence.filter(
        (_, i) => i !== selectedElementId
      )
      setSequence(newSequence)
    },
    [selectedElementId, sequence, setSequence]
  )

  const overwriteSequence = useCallback(
    (newSequence: ActionEventType[]) => {
      setSequence(newSequence)
    },
    [setSequence]
  )

  const onIdAdd = useCallback(
    (newId: number) => {
      setIds((ids) => [...ids, newId])
    },
    [setIds]
  )
  
  const onIdDelete = useCallback(
    () => {
      const newIds = ids.filter(
        (_, i) => i !== selectedElementId
      )
      setIds(newIds)
    },
    [ids, selectedElementId, setIds]
  )
  
  const overwriteIds = useCallback(
    (newArray: number[]) => {
      setIds(newArray)
    },
    [setIds]
  )

  const updateSelectedElementId = useCallback(
    (newIndex: number) => {
      setSelectedElementId(newIndex)
    },
    [setSelectedElementId]
  )

  const value = useMemo<SequenceState>(
    () => ({
      sequence,
      ids,
      selectedElementId,
      onElementAdd,
      onSelectedElementDelete,
      overwriteSequence,
      onIdAdd,
      onIdDelete,
      overwriteIds,
      updateSelectedElementId
    }),
    [
      sequence,
      ids,
      selectedElementId,
      onElementAdd,
      onSelectedElementDelete,
      overwriteSequence,
      onIdAdd,
      onIdDelete,
      overwriteIds,
      updateSelectedElementId
    ]
  )

  return (
    <SequenceContext.Provider value={value}>
      {children}
    </SequenceContext.Provider>
  )
}

export { SequenceProvider, useSequenceContext }
