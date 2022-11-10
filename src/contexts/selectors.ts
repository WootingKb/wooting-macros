import { useMemo } from 'react'
import { useApplicationContext } from './applicationContext'
import { Collection } from '../types'
import { useSequenceContext } from './sequenceContext'

export function useCollections() {
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

export function useSelectedMacro() {
  const { selection } = useApplicationContext()
  const selectedCollection = useSelectedCollection()
  return useMemo(
    () => selectedCollection.macros[selection.macroIndex],
    [selectedCollection, selection]
  )
}

export function useSequence() {
  const context = useSequenceContext()
  return context.sequence
}
