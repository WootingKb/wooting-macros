import { useMemo } from 'react'
import { useApplicationContext } from './applicationContext'
import { ActionEventType, Collection, Macro } from '../types'
import { useSequenceContext } from './sequenceContext'

export function useCollections(): Collection[] {
  const context = useApplicationContext()
  return context.collections
}

export function useSelectedCollection(): Collection {
  const { collections, selection } = useApplicationContext()
  return useMemo(
    () => collections[selection.collectionIndex],
    [collections, selection]
  )
}

export function useSelectedMacro(): Macro {
  const { selection } = useApplicationContext()
  const selectedCollection = useSelectedCollection()
  return useMemo(
    () => selectedCollection.macros[selection.macroIndex],
    [selectedCollection, selection]
  )
}

export function useSequence(): ActionEventType[] {
  const context = useSequenceContext()
  return context.sequence
}

export function useSelectedElement(): ActionEventType {
  const context = useSequenceContext()
  return useMemo(() => context.sequence[context.selectedElementId], [context])
}
