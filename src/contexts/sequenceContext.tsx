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
import { SequenceState, SequenceElement, ActionEventType } from '../types'
import { useApplicationContext } from './applicationContext'
import { useSelectedMacro } from './selectors'

type SequenceProviderProps = { children: ReactNode }

const SequenceContext = createContext<SequenceState | undefined>(undefined)

function useSequenceContext() {
  const context = useContext(SequenceContext)
  if (context === undefined) {
    throw new Error('useSequence must be used within a SequenceProvider')
  }
  return context
}

function SequenceProvider({ children }: SequenceProviderProps) {
  const { viewState } = useApplicationContext()
  const [sequence, setSequence] = useState<SequenceElement[]>([])
  const currentMacro = useSelectedMacro()

  useEffect(() => {
    if (viewState === ViewState.Addview) {
      setSequence([])
    } else if (viewState === ViewState.Editview) {
      const temp: SequenceElement[] = currentMacro.sequence.map(
        (element, id) => {
          return { id: id, data: element }
        }
      )
      console.log(temp)
      setSequence(temp)
    }
  }, [])

  const addToSequence = useCallback(
    (newElement: SequenceElement) => {
      setSequence((sequence) => [...sequence, newElement])
    },
    [setSequence]
  )

  const removeFromSequence = useCallback(
    (element: SequenceElement) => {
      const index = sequence.indexOf(element, 0)
      setSequence(sequence.splice(index, 1))
    },
    [setSequence]
  )

  const overwriteSequence = useCallback(
    (newSequence: SequenceElement[]) => {
      setSequence(newSequence)
    },
    [setSequence]
  )

  const value = useMemo<SequenceState>(
    () => ({
      sequence,
      addToSequence,
      removeFromSequence,
      overwriteSequence
    }),
    [sequence, addToSequence, removeFromSequence, overwriteSequence]
  )

  return (
    <SequenceContext.Provider value={value}>
      {children}
    </SequenceContext.Provider>
  )
}

export { SequenceProvider, useSequenceContext }
