import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  VStack,
  Flex,
  HStack,
  IconButton,
  Button,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import DeleteCollectionModal from './DeleteCollectionModal'
import MacroList from './MacroList'

type Props = {
  onOpen: () => void
}

export default function CollectionPanel({ onOpen }: Props) {
  const {
    selection,
    changeIsUpdatingCollection
  } = useApplicationContext()
  const currentCollection = useSelectedCollection()
  const { isOpen, onOpen: onDeleteModalOpen, onClose } = useDisclosure()
  const borderColour = useColorModeValue('stone.500', 'zinc.500')

  return (
    <VStack w="100%" h="100vh" spacing="0">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p="2"
        borderBottom="1px"
        borderColor={borderColour}
        w="100%"
      >
        <HStack w="100%" justifyContent="space-between">
          <HStack w="100%" pl="4">
            <Text fontWeight="bold" fontSize="xl">
              {currentCollection.name}
            </Text>
            <IconButton
              aria-label="Collection Edit Button"
              icon={<EditIcon />}
              variant="brandGhost"
              isDisabled={selection.collectionIndex <= 0}
              onClick={() => {
                changeIsUpdatingCollection(true)
                onOpen()
              }}
            />
          </HStack>
          <HStack w="fit">
            {/* <Button leftIcon={<AddIcon />} size={['xs', 'sm', 'md']} isDisabled>
              Export Collection
            </Button>
            <Button leftIcon={<AddIcon />} size={['xs', 'sm', 'md']} isDisabled>
              Import Macros
            </Button> */}
            <Button
              leftIcon={<DeleteIcon />}
              variant="brand"
              size={['xs', 'sm', 'md']}
              isDisabled={selection.collectionIndex <= 0}
              onClick={onDeleteModalOpen}
            >
              Delete Collection
            </Button>
          </HStack>
        </HStack>
      </Flex>
      <DeleteCollectionModal isOpen={isOpen} onClose={onClose} />
      <MacroList />
    </VStack>
  )
}
