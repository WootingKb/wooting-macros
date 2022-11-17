import { StarIcon, EditIcon, AddIcon } from '@chakra-ui/icons'
import { VStack, Flex, HStack, IconButton, Button, Text, useColorModeValue } from '@chakra-ui/react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { ViewState } from '../../enums'
import { Collection } from '../../types'
import { updateBackendConfig } from '../../utils'
import MacroList from './MacroList'

type Props = {
    onOpen: () => void
    setIsRenamingCollection: (newVal:boolean) => void
}

const CollectionPanel = ({onOpen, setIsRenamingCollection}: Props) => {
  const {
    collections,
    selection,
    changeSelectedCollectionIndex,
    changeViewState
  } = useApplicationContext()
    const currentCollection: Collection = useSelectedCollection()
 const dividerBg = useColorModeValue("gray.400", "gray.600")

    const onCollectionDelete = () => {
    collections.splice(selection.collectionIndex, 1)
    collections[0].active = true
    changeSelectedCollectionIndex(0)
    updateBackendConfig(collections)
  }

  return (
    <VStack w="100%" h="100vh" spacing="0">
    <Flex
        justifyContent="space-between"
        alignItems="center"
        p="2"
        borderBottom="1px"
        borderColor={dividerBg}
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
    <MacroList />
    </VStack>
  )
}

export default CollectionPanel