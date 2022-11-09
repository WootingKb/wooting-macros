import { useMemo } from 'react'
import { useApplicationContext } from './applicationContext'
import { Collection } from '../types'

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
