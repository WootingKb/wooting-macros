import {
  ReactNode,
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
  useCallback,
  SetStateAction
} from 'react'
import { useToast } from '@chakra-ui/react'
import { ViewState } from '../constants/enums'
import { AppState, Collection, MacroData, CurrentSelection } from '../types'
import { updateBackendConfig } from '../constants/utils'
import { error } from 'tauri-plugin-log'
import { invoke } from '@tauri-apps/api'

interface ApplicationProviderProps {
  children: ReactNode
}

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
  const [initComplete, setInitComplete] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [searchValue, setSearchValue] = useState("");
  const [selection, setSelection] = useState<CurrentSelection>({
    collectionIndex: 0,
    macroIndex: undefined
  })
  const toast = useToast()

  useEffect(() => {
    invoke<MacroData>('get_macros')
      .then((res: { data: SetStateAction<Collection[]> }) => {
        setCollections(res.data)
        setInitComplete(true)
      })
      .catch((e: string) => {
        error(e)
        toast({
          title: 'Error loading macros',
          description:
            'Unable to load macros, please re-open the app. If that does not work, please contact us on Discord.',
          status: 'error',
          duration: 10000,
          isClosable: true
        })
      })
  }, [toast])

  useEffect(() => {
    if (initComplete)
      updateBackendConfig(collections).catch((e) => {
        error(e)
        toast({
          title: 'Error updating macro data',
          description: `Unable to update macro data: ${e}. 
            Your system action filepath or website URL may be incorrect. Alternatively, please contact us on Discord.`,
          status: 'error',
          duration: 10000,
          isClosable: true
        })
      })
  }, [collections, initComplete, toast])

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

  const changeSearchValue = useCallback(
    (term: string) => {
      setSearchValue(term)
    }, [setSearchValue]
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
    changeSelectedCollectionIndex(
      Math.min(selection.collectionIndex, newCollections.length - 1)
    )
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
      changeSelectedMacroIndex,
      searchValue,
      setSearchValue,
      changeSearchValue,
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
      changeSelectedMacroIndex,
      searchValue,
      setSearchValue,
      changeSearchValue,
    ]
  )

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}

export { ApplicationProvider, useApplicationContext }
