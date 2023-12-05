import { DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, HStack, Input, Text, Tooltip, useDisclosure, VStack } from '@chakra-ui/react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import DeleteCollectionModal from './DeleteCollectionModal'
import MacroList from './MacroList'
import { useCallback, useEffect, useState } from 'react'
import EmojiPopover from '../EmojiPopover'
import useMainBgColour from '../../hooks/useMainBgColour'
import useBorderColour from '../../hooks/useBorderColour'

export default function CollectionPanel() {
  const {collections, selection, onCollectionUpdate, searchValue} = useApplicationContext()
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
  const borderColour = useBorderColour()
  const isCollectionUndeletable = collections.length <= 1


  useEffect(() => {
    setCollectionName(currentCollection.name)
  }, [currentCollection.name])

  const onEmojiSelect = useCallback(
    (emoji: { shortcodes: string }) => {
      if (emoji.shortcodes === currentCollection.icon) {
        return
      }
      onCollectionUpdate(
        {...currentCollection, icon: emoji.shortcodes},
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
        bg={useMainBgColour()}
        justifyContent="space-between"
        alignItems="center"
        py={2}
        px={4}
        w="full"
        h="90px"
        borderBottom="1px"
        borderColor={borderColour}
      >
        {searchValue.length === 0 ?

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
                placeholder="Collection Name"
                _placeholder={{opacity: 1, color: borderColour}}
                _focusVisible={{borderColor: 'primary-accent.500'}}
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
                  isCollectionUndeletable
                    ? "Can't delete your last collection!"
                    : ''
                }
                hasArrow
                placement="bottom-start"
              >
                <Box>
                  <Button
                    leftIcon={<DeleteIcon/>}
                    variant="brandWarning"
                    size="md"
                    isDisabled={isCollectionUndeletable}
                    onClick={onDeleteModalOpen}
                    aria-label="Delete Collection"
                  >
                    Delete Collection
                  </Button>
                </Box>
              </Tooltip>
            </HStack>
          </HStack> : <HStack>
            <Text as="b" fontSize="3xl">Search</Text>
          </HStack>}
      </Flex>
      <DeleteCollectionModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
      />
      <MacroList/>
    </VStack>
  )
}
