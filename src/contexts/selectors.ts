import { useMemo } from 'react'
import { useApplicationContext } from './applicationContext'
import { useMacroContext } from './macroContext'

export function useCollections() {
  const context = useApplicationContext()
  return context.collections
}

export function useSelectedCollection() {
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
    () =>
      selection.macroIndex !== undefined
        ? selectedCollection.macros[selection.macroIndex]
        : undefined,
    [selectedCollection, selection]
  )
}

export function useSequence() {
  const context = useMacroContext()
  return context.sequence
}

export function useSelectedElement() {
  const context = useMacroContext()
  return useMemo(
    () =>
      context.selectedElementId !== undefined
        ? context.sequence[context.selectedElementId]
        : undefined,
    [context]
  )
}
