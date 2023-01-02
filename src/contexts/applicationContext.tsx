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
import { useToast } from '@chakra-ui/react'
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
    macroIndex: undefined
  })
  const [isUpdatingCollection, setIsUpdatingCollection] = useState(false)
  const toast = useToast()

  useEffect(() => {
    invoke<MacroData>('get_macros')
      .then((res) => {
        setCollections(res.data)
        setInitComplete(true)
      })
      .catch((e) => {
        console.error(e)
        toast({
          title: 'Error loading macros',
          description: "Unable to load macros, please re-open the app.",
          status: 'error',
          duration: 2000,
          isClosable: true
        })
      })
  }, [toast])

  useEffect(() => {
    if (initComplete) updateBackendConfig(collections)
  }, [collections, initComplete])

  const changeViewState = useCallback(
    (newState: ViewState) => {
      setViewState(newState)
    },
    [setViewState]
  )

  const changeSelectedCollectionIndex = useCallback(
    (index: number) => {
      setSelection({ collectionIndex: index, macroIndex: undefined })
    },
    [setSelection]
  )

  const changeSelectedMacroIndex = useCallback(
    (index: number | undefined) => {
      setSelection((prevState) => ({
        ...prevState,
        macroIndex: index
      }))

      if (index !== undefined && index >= 0) {
        setViewState(ViewState.Editview)
      } else {
        setViewState(ViewState.Overview)
      }
    },
    [setSelection]
  )

  const onCollectionAdd = useCallback(
    (newCollection: Collection) => {
      let newIndex = 0
      let itemToAdd = newCollection
      setCollections((collections) => {
        newIndex = collections.length
        if (itemToAdd.name === '') {
          itemToAdd = { ...itemToAdd, name: `Collection ${newIndex + 1}` }
        }
        return [...collections, itemToAdd]
      })
      changeSelectedCollectionIndex(newIndex)
    },
    [changeSelectedCollectionIndex]
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

  const changeIsUpdatingCollection = useCallback(
    (newVal: boolean) => {
      setIsUpdatingCollection(newVal)
    },
    [setIsUpdatingCollection]
  )

  const value = useMemo<AppState>(
    () => ({
      viewState,
      collections,
      initComplete,
      selection,
      isUpdatingCollection: isUpdatingCollection,
      changeViewState,
      onSelectedCollectionDelete,
      onCollectionAdd,
      onCollectionUpdate,
      changeSelectedCollectionIndex,
      changeSelectedMacroIndex,
      changeIsUpdatingCollection
    }),
    [
      viewState,
      collections,
      initComplete,
      selection,
      isUpdatingCollection,
      changeViewState,
      onSelectedCollectionDelete,
      onCollectionAdd,
      onCollectionUpdate,
      changeSelectedCollectionIndex,
      changeSelectedMacroIndex,
      changeIsUpdatingCollection
    ]
  )

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}

export { ApplicationProvider, useApplicationContext }
