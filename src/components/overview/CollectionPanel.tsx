import { DeleteIcon } from '@chakra-ui/icons'
import {
  VStack,
  Flex,
  HStack,
  Button,
  useColorModeValue,
  useDisclosure,
  Input,
  Tooltip,
  Box
} from '@chakra-ui/react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import DeleteCollectionModal from './DeleteCollectionModal'
import MacroList from './MacroList'
import { useState, useCallback, useEffect } from 'react'
import EmojiPopover from '../EmojiPopover'

export default function CollectionPanel() {
  const { collections, selection, onCollectionUpdate } = useApplicationContext()
  const currentCollection = useSelectedCollection()
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose
  } = useDisclosure()
  const {
    isOpen: isEmojiPopoverOpen,
    onOpen: onEmojiPopoverOpen,
    onClose: onEmojiPopoverClose
  } = useDisclosure()
  const [collectionName, setCollectionName] = useState('')
  const panelBg = useColorModeValue('bg-light', 'primary-dark.900')
  const borderColour = useColorModeValue(
    'primary-light.100',
    'primary-dark.700'
  )

  useEffect(() => {
    setCollectionName(currentCollection.name)
  }, [currentCollection.icon, currentCollection.name])

  const onEmojiSelect = useCallback(
    (emoji: { shortcodes: string }) => {
      if (emoji.shortcodes === currentCollection.icon) {
        return
      }
      onCollectionUpdate(
        { ...currentCollection, icon: emoji.shortcodes },
        selection.collectionIndex
      )
    },
    [currentCollection, onCollectionUpdate, selection.collectionIndex]
  )

  const onCollectionNameChange = useCallback(() => {
    if (collectionName === currentCollection.name) {
      return
    }

    if (collectionName === '') {
      setCollectionName(`Collection ${selection.collectionIndex + 1}`)
      onCollectionUpdate(
        {
          ...currentCollection,
          name: `Collection ${selection.collectionIndex + 1}`
        },
        selection.collectionIndex
      )
    } else {
      onCollectionUpdate(
        {
          ...currentCollection,
          name: collectionName
        },
        selection.collectionIndex
      )
    }
  }, [
    collectionName,
    currentCollection,
    onCollectionUpdate,
    selection.collectionIndex
  ])

  return (
    <VStack w="full" h="100vh" spacing="0">
      <Flex
        bg={panelBg}
        justifyContent="space-between"
        alignItems="center"
        py={2}
        px={4}
        w="full"
        h="90px"
        borderBottom="1px"
        borderColor={borderColour}
      >
        <HStack w="full" justifyContent="space-between">
          <HStack w="full" spacing={4}>
            <EmojiPopover
              shortcodeToShow={currentCollection.icon}
              isEmojiPopoverOpen={isEmojiPopoverOpen}
              onEmojiPopoverClose={onEmojiPopoverClose}
              onEmojiPopoverOpen={onEmojiPopoverOpen}
              onEmojiSelect={onEmojiSelect}
            />
            <Input
              w="fit"
              variant="flushed"
              onChange={(event) => setCollectionName(event.target.value)}
              onBlur={onCollectionNameChange}
              value={collectionName}
              size="xl"
              textStyle="name"
              placeholder={'Collection Name'}
              _placeholder={{ opacity: 1, color: borderColour }}
              _focusVisible={{ borderColor: 'primary-accent.500' }}
            />
          </HStack>
          <HStack w="fit">
            {/* <Button leftIcon={<AddIcon />} size={['xs', 'sm', 'md']} isDisabled>
              Export Collection
            </Button>
            <Button leftIcon={<AddIcon />} size={['xs', 'sm', 'md']} isDisabled>
              Import Macros
            </Button> */}
            <Tooltip
              variant="brand"
              label={
                collections.length <= 1
                  ? "Can't delete your last collection!"
                  : ''
              }
              aria-label="Collection delete button tooltip"
              hasArrow
              placement="bottom-start"
            >
              <Box>
                <Button
                  leftIcon={<DeleteIcon />}
                  variant="brandWarning"
                  size="md"
                  isDisabled={collections.length <= 1}
                  onClick={onDeleteModalOpen}
                >
                  Delete Collection
                </Button>
              </Box>
            </Tooltip>
          </HStack>
        </HStack>
      </Flex>
      <DeleteCollectionModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
      />
      <MacroList />
    </VStack>
  )
}
