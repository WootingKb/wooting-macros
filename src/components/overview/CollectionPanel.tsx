import { DeleteIcon } from '@chakra-ui/icons'
import {
  VStack,
  Flex,
  HStack,
  Button,
  useColorModeValue,
  useDisclosure,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorMode,
  Input,
  Tooltip,
} from '@chakra-ui/react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import DeleteCollectionModal from './DeleteCollectionModal'
import MacroList from './MacroList'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useState, useCallback, useEffect, useRef } from 'react'

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
  const { colorMode } = useColorMode()
  const initialFocusRef = useRef<HTMLDivElement | null>(null)
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
            <Popover
              initialFocusRef={initialFocusRef}
              returnFocusOnClose={false}
              isOpen={isEmojiPopoverOpen}
              onClose={onEmojiPopoverClose}
              closeOnBlur={false}
              isLazy
            >
              <PopoverTrigger>
                <Box
                  maxHeight="32px"
                  onClick={onEmojiPopoverOpen}
                  _hover={{ transform: 'scale(110%)' }}
                  transition="ease-out 150ms"
                >
                  <em-emoji shortcodes={currentCollection.icon} size="32px" />
                </Box>
              </PopoverTrigger>
              <PopoverContent bg="transparent" border="0px" shadow="none">
                <PopoverBody>
                  <Box id="picker-box" w="full" ref={initialFocusRef}>
                    <Picker
                      data={data}
                      theme={colorMode}
                      autoFocus={true}
                      onEmojiSelect={onEmojiSelect}
                      previewPosition="none"
                      dynamicWidth={true}
                    />
                  </Box>
                </PopoverBody>
              </PopoverContent>
            </Popover>
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
                collections.length <= 1 ? "Can't delete your last collection!" : ''
              }
              aria-label="Collection delete button tooltip"
              hasArrow
            >
              <Button
                leftIcon={<DeleteIcon />}
                variant="brandWarning"
                size="md"
                isDisabled={collections.length <= 1}
                onClick={onDeleteModalOpen}
              >
                Delete Collection
              </Button>
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
