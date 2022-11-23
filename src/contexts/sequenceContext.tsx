import {
  ReactNode,
  useState,
  useMemo,
  useContext,
  createContext,
  useCallback
} from 'react'
import { SequenceState, ActionEventType } from '../types'

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
  const [sequence, setSequence] = useState<ActionEventType[]>([])
  const [ids, setIds] = useState<number[]>([])
  const [selectedElementId, setSelectedElementId] = useState(-1)

  const onIdAdd = useCallback(
    (newId: number) => {
      setIds((ids) => [...ids, newId])
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
    (newIndex: number) => {
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

  const onElementDelete = useCallback(
    (index: number) => {
      console.log('deleting element')
      const newSequence = sequence.filter(
        (_, i) => i !== index
      )
      setSequence(newSequence)
      setIds(newSequence.map((element, index) => index + 1))
    },
    [sequence, setSequence]
  )

  const overwriteSequence = useCallback(
    (newSequence: ActionEventType[]) => {
      setSequence(newSequence)
      setIds(newSequence.map((element, index) => index + 1))
    },
    [setSequence, setIds]
  )

  const value = useMemo<SequenceState>(
    () => ({
      sequence,
      ids,
      selectedElementId,
      onElementAdd,
      onElementDelete,
      overwriteSequence,
      onIdAdd,
      overwriteIds,
      updateSelectedElementId
    }),
    [
      sequence,
      ids,
      selectedElementId,
      onElementAdd,
      onElementDelete,
      overwriteSequence,
      onIdAdd,
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
