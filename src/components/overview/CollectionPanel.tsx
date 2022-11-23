import { StarIcon, EditIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  VStack,
  Flex,
  HStack,
  IconButton,
  Button,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { Collection } from '../../types'
import MacroList from './MacroList'

type Props = {
  onOpen: () => void
}

const CollectionPanel = ({ onOpen }: Props) => {
  const { selection, onSelectedCollectionDelete, updateIsRenamingCollection } =
    useApplicationContext()
  const currentCollection: Collection = useSelectedCollection()
  const dividerBg = useColorModeValue('gray.400', 'gray.600')

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
                updateIsRenamingCollection(true)
                onOpen()
              }}
            />
          </HStack>
          <HStack w="100%">
            <Button leftIcon={<AddIcon />} size={['xs', 'sm', 'md']} isDisabled>
              Export Collection
            </Button>
            <Button leftIcon={<AddIcon />} size={['xs', 'sm', 'md']} isDisabled>
              Import Macros
            </Button>
            <Button
              leftIcon={<DeleteIcon />}
              size={['xs', 'sm', 'md']}
              isDisabled={selection.collectionIndex <= 0}
              onClick={onSelectedCollectionDelete}
            >
              Delete Collection
            </Button>
          </HStack>
        </VStack>
      </Flex>
      <MacroList />
    </VStack>
  )
}

export default CollectionPanel
