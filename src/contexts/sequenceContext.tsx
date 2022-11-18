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

  const removeFromSequence = (element: ActionEventType) => {
    const temp: ActionEventType[] = [...sequence]
    const index = temp.indexOf(element, 0)
    temp.splice(index, 1)
    setSequence(temp)
  }

  const overwriteSequence = useCallback(
    (newSequence: ActionEventType[]) => {
      setSequence(newSequence)
    },
    [setSequence]
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
      selectedElementIndex,
      addToSequence,
      removeFromSequence,
      overwriteSequence,
      updateElementIndex
    }),
    [
      sequence,
      selectedElementIndex,
      addToSequence,
      removeFromSequence,
      overwriteSequence,
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
