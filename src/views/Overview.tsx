import { useEffect, useState } from 'react'
import MacroCard from '../components/overview/MacroCard'
import { Collection, Macro } from '../types'
import CollectionButton from '../components/overview/CollectionButton'
import {
  Button,
  Flex,
  HStack,
  useColorMode,
  VStack,
  Text,
  IconButton,
  useDisclosure,
  Grid,
  GridItem
} from '@chakra-ui/react'
import { AddIcon, EditIcon } from '@chakra-ui/icons'
import { updateBackendConfig } from '../utils'
import { useApplicationContext } from '../contexts/applicationContext'
import { ViewState } from '../enums'
import CollectionModal from '../components/overview/CollectionModal'
import { useSelectedCollection } from '../contexts/selectors'

function Overview() {
  const {
    collections,
    selection,
    changeSelectedCollectionIndex,
    changeSelectedMacroIndex,
    changeViewState
  } = useApplicationContext()
  const currentCollection: Collection = useSelectedCollection()
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isRenamingCollection, setIsRenamingCollection] = useState(false)

  useEffect(() => {
    changeSelectedMacroIndex(-1) // none selected
  }, [])

  const onCollectionButtonPress = (newActiveIndex: number) => {
    changeSelectedCollectionIndex(newActiveIndex)
  }

  const onCollectionToggle = (index: number) => {
    collections[index].active = !collections[index].active
    setIsRenamingCollection(!isRenamingCollection)
    updateBackendConfig(collections)
  }

  const onCollectionDelete = () => {
    collections.splice(selection.collectionIndex, 1)
    collections[0].active = true
    changeSelectedCollectionIndex(0)
    updateBackendConfig(collections)
  }

  const onMacroDelete = (macroIndex: number) => {
    collections[selection.collectionIndex].macros.splice(macroIndex, 1)
    setIsRenamingCollection(!isRenamingCollection)
    updateBackendConfig(collections)
  }

  return (
    <HStack minH="100vh" spacing="0" overflow="hidden">
      {/** Left Side Panel */}
      <VStack borderRight="1px" h="100vh" p="4" w={['20%']}>
        {collections.map((collection: Collection, index: number) => (
          <CollectionButton
            collection={collection}
            index={index}
            key={index}
            isFocused={index == selection.collectionIndex}
            setFocus={onCollectionButtonPress}
            toggleCollection={onCollectionToggle}
          />
        ))}
        <Button
          colorScheme="yellow"
          size={['sm', 'md', 'lg']}
          leftIcon={<AddIcon />}
          onClick={() => {
            setIsRenamingCollection(false)
            onOpen()
          }}
        >
          New Collection
        </Button>
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </VStack>
      {/** Main Panel */}
      <VStack w="100%" h="100vh">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          p="4"
          borderBottom="1px"
          w="100%"
        >
          <VStack>
            <HStack w="100%">
              <IconButton
                aria-label="Collection Icon Button"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    width="24px"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                    />
                  </svg>
                }
                variant="ghost"
                isDisabled
              ></IconButton>
              <Text fontWeight="bold" fontSize="xl">
                {currentCollection.name}
              </Text>
              <IconButton
                aria-label="Collection Edit Button"
                icon={<EditIcon />}
                variant="ghost"
                isDisabled={selection.collectionIndex <= 0}
                onClick={() => {
                  setIsRenamingCollection(true)
                  onOpen()
                }}
              />
            </HStack>
            <HStack w="100%">
              <Button leftIcon={<AddIcon />} size={['sm', 'md']} isDisabled>
                Export Collection
              </Button>
              <Button leftIcon={<AddIcon />} size={['sm', 'md']} isDisabled>
                Import Macros
              </Button>
              <Button
                leftIcon={<AddIcon />}
                size={['sm', 'md']}
                isDisabled={selection.collectionIndex <= 0}
                onClick={onCollectionDelete}
              >
                Delete Collection
              </Button>
            </HStack>
          </VStack>
          <Button
            colorScheme="yellow"
            leftIcon={<AddIcon />}
            size={['sm', 'md', 'lg']}
            onClick={() => changeViewState(ViewState.Addview)}
          >
            Add Macro
          </Button>
        </Flex>
        <Grid
          w="100%"
          templateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)']}
          p="1"
          gap="1"
          overflowY="auto"
        >
          {currentCollection.macros.map((macro: Macro, index: number) => (
            <GridItem w="100%" key={index}>
              <MacroCard macro={macro} index={index} onDelete={onMacroDelete} />
            </GridItem>
          ))}
        </Grid>
      </VStack>

      <CollectionModal
        isRenaming={isRenamingCollection}
        isOpen={isOpen}
        onClose={onClose}
      />
    </HStack>
  )
}

export default Overview
