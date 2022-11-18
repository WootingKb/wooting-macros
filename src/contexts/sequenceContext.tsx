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
  const [selectedElementIndex, setSelectedElementIndex] = useState(-1)
  const currentMacro = useSelectedMacro()

  useEffect(() => {
    if (viewState === ViewState.Addview) {
      setSequence([])
    } else if (viewState === ViewState.Editview) {
      setSequence(currentMacro.sequence)
    }
  }, [viewState])

  const addToSequence = useCallback(
    (newElement: ActionEventType) => {
      setSequence((sequence) => [...sequence, newElement])
    },
    [setSequence]
  )

  const removeFromSequence = useCallback(
    (element: ActionEventType) => {
      setSequence((sequence) => {
        const temp = [...sequence]
        const index = sequence.indexOf(element, 0)
        temp.splice(index, 1)
        overwriteIds(temp.map((element, index) => index + 1))
        return temp
      })
    },
    [setSequence]
  ) 

  const overwriteSequence = useCallback(
    (newSequence: ActionEventType[]) => {
      setSequence(newSequence)
    },
    [setSequence]
  )

  const overwriteIds = useCallback(
    (newArray: number[]) => {
      setIds(newArray)
    },
    [setIds]
  )

  const updateElementIndex = useCallback(
    (newIndex: number) => {
      setSelectedElementIndex(newIndex)
    },
    [setSelectedElementIndex]
  )

  const value = useMemo<SequenceState>(
    () => ({
      sequence,
      ids,
      selectedElementIndex,
      addToSequence,
      removeFromSequence,
      overwriteSequence,
      overwriteIds,
      updateElementIndex
    }),
    [
      sequence,
      ids,
      selectedElementIndex,
      addToSequence,
      removeFromSequence,
      overwriteSequence,
      overwriteIds,
      updateElementIndex
    ]
  )

  return (
    <SequenceContext.Provider value={value}>
      {children}
    </SequenceContext.Provider>
  )
}

export { SequenceProvider, useSequenceContext }
