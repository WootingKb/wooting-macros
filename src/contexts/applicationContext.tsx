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
  const [isRenamingCollection, setIsRenamingCollection] = useState(false)

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

  const changeSelectedCollectionIndex = useCallback(
    (index: number) => {
      setSelection({ collectionIndex: index, macroIndex: -1 })
    },
    [setSelection]
  )

  const changeSelectedMacroIndex = useCallback(
    (index: number) => {
      console.log("setting macro index to " + index)
      setSelection((prevState) => ({
        ...prevState,
        macroIndex: index
      }))
      if (index >= 0) {
        setViewState(ViewState.Editview)
      } else {
        setViewState(ViewState.Overview)
      }
    },
    [setSelection]
  )

  const onCollectionAdd = useCallback(
    (newCollection: Collection) => {
      setCollections((collections) => [...collections, newCollection])
      changeSelectedCollectionIndex(collections.length)
    },
    [changeSelectedCollectionIndex, collections.length]
  )

  const onSelectedCollectionDelete = useCallback(() => {
    const newCollections = collections.filter(
      (_, i) => i !== selection.collectionIndex
    )
    setCollections(newCollections)
    changeSelectedCollectionIndex(0)
  }, [changeSelectedCollectionIndex, collections, selection.collectionIndex])

  const onCollectionUpdate = useCallback(
    (updatedCollection: Collection, collectionIndex: number) => {
      const newCollections = collections.map((collection, index) =>
        index === collectionIndex ? updatedCollection : collection
      )
      setCollections(newCollections)
    },
    [collections]
  )

  const updateIsRenamingCollection = useCallback(
    (newVal: boolean) => {
      setIsRenamingCollection(newVal)
    },
    [setIsRenamingCollection]
  )

  const value = useMemo<AppState>(
    () => ({
      viewState,
      collections,
      initComplete,
      selection,
      isRenamingCollection,
      changeViewState,
      onSelectedCollectionDelete,
      onCollectionAdd,
      onCollectionUpdate,
      changeSelectedCollectionIndex,
      changeSelectedMacroIndex,
      updateIsRenamingCollection
    }),
    [
      viewState,
      collections,
      initComplete,
      selection,
      isRenamingCollection,
      changeViewState,
      onSelectedCollectionDelete,
      onCollectionAdd,
      onCollectionUpdate,
      changeSelectedCollectionIndex,
      changeSelectedMacroIndex,
      updateIsRenamingCollection
    ]
  )

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}

export { ApplicationProvider, useApplicationContext }
