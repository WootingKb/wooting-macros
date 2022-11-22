import { invoke } from '@tauri-apps/api/tauri'
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
import { AppState, Collection, MacroData, CurrentSelection } from '../types'
import { updateBackendConfig } from '../utils'

type ApplicationProviderProps = { children: ReactNode }

const ApplicationContext = createContext<AppState | undefined>(undefined)

function useApplicationContext() {
  const context = useContext(ApplicationContext)
  if (context === undefined) {
    throw new Error(
      'useApplicationContext must be used within a ApplicationProvider'
    )
  }
  return context
}

function ApplicationProvider({ children }: ApplicationProviderProps) {
  const [viewState, setViewState] = useState<ViewState>(ViewState.Overview)
  const [initComplete, setInitComplete] = useState<boolean>(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [selection, setSelection] = useState<CurrentSelection>({
    collectionIndex: 0,
    macroIndex: -1
  })

  useEffect(() => {
    invoke<MacroData>('get_macros')
      .then((res) => {
        setCollections(res.data)
        setInitComplete(true)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [])

  useEffect(() => {
    updateBackendConfig(collections)
  }, [collections])
  

  const changeViewState = useCallback(
    (newState: ViewState) => {
      setViewState(newState)
    },
    [setViewState]
  )

  const onCollectionAdd = useCallback(
    (newCollection: Collection) => {
      setCollections((collections) => [...collections, newCollection])
    },
    [setCollections],
  )

  const onSelectedCollectionDelete = useCallback(
    () => {
      const newCollections = collections.filter(
        (_, i) => i !== selection.collectionIndex
      )
      newCollections[0].active = true
      setCollections(newCollections)
    },
    [collections, selection.collectionIndex, setCollections]
  )

  const onCollectionUpdate = useCallback(
    (updatedCollection: Collection) => {
      const newCollections = collections.map((collection) =>
        collection.name === updatedCollection.name
        ? updatedCollection
        : collection
      )
      setCollections(newCollections)
    },
    [collections],
  )

  const changeSelectedCollectionIndex = useCallback(
    (index: number) => {
      setSelection({ collectionIndex: index, macroIndex: -1 })
    },
    [setSelection]
  )

  const changeSelectedMacroIndex = useCallback(
    (index: number) => {
      setSelection((prevState) => ({
        ...prevState,
        macroIndex: index
      }))
    },
    [setSelection]
  )

  const value = useMemo<AppState>(
    () => ({
      viewState,
      collections,
      initComplete,
      selection,
      changeViewState,
      onSelectedCollectionDelete,
      onCollectionAdd,
      onCollectionUpdate,
      changeSelectedCollectionIndex,
      changeSelectedMacroIndex
    }),
    [
      viewState,
      collections,
      initComplete,
      selection,
      changeViewState,
      onSelectedCollectionDelete,
      onCollectionAdd,
      onCollectionUpdate,
      changeSelectedCollectionIndex,
      changeSelectedMacroIndex
    ]
  )

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}

export { ApplicationProvider, useApplicationContext }
