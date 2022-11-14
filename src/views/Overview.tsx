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
  GridItem,
  Divider
} from '@chakra-ui/react'
import { AddIcon, EditIcon, StarIcon } from '@chakra-ui/icons'
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
      <VStack
        bg="gray.200"
        borderRight="1px"
        h="100vh"
        p="2"
        w={['25%', '20%', '15%']}
        justifyContent="space-between"
      >
        <VStack w="100%">
          <Text w="100%" fontWeight="bold">
            Collections
          </Text>
          <Divider borderColor="black" />
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
            size={['sm']}
            leftIcon={<AddIcon />}
            onClick={() => {
              setIsRenamingCollection(false)
              onOpen()
            }}
          >
            New Collection
          </Button>
        </VStack>
        <HStack w="100%">
          <Button onClick={toggleColorMode} w="100%" size={'sm'}>
            <Text fontSize={'xs'}>
              Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
            </Text>
          </Button>
          <Button w="100%" size={'sm'}>
            <Text fontSize={'xs'}>Give Feedback</Text>
          </Button>
        </HStack>
      </VStack>
      {/** Main Panel */}
      <VStack w="100%" h="100vh">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          p="2"
          borderBottom="1px"
          w="100%"
        >
          <VStack>
            <HStack w="100%">
              <IconButton
                aria-label="Collection Icon Button"
                icon={<StarIcon />}
                variant="ghost"
                isDisabled
                size={'sm'}
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
              <Button
                leftIcon={<AddIcon />}
                size={['xs', 'sm', 'md']}
                isDisabled
              >
                Export Collection
              </Button>
              <Button
                leftIcon={<AddIcon />}
                size={['xs', 'sm', 'md']}
                isDisabled
              >
                Import Macros
              </Button>
              <Button
                leftIcon={<AddIcon />}
                size={['xs', 'sm', 'md']}
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
