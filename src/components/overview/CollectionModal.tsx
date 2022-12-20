import {
  Button,
  HStack,
  Input,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Box,
  useColorModeValue,
  Tooltip,
  Divider
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { maxNameLength } from '../../utils'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function CollectionModal({ isOpen, onClose }: Props) {
  const [collectionName, setCollectionName] = useState('')
  const [iconString, setIconString] = useState(':smile:')
  const [isNameUsable, setIsNameUsable] = useState(false)
  const {
    selection,
    collections,
    isUpdatingCollection,
    onCollectionAdd,
    onCollectionUpdate
  } = useApplicationContext()
  const currentCollection = useSelectedCollection()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const borderColour = useColorModeValue('stone.500', 'zinc.500')

  useEffect(() => {
    if (isUpdatingCollection) {
      setIconString(currentCollection.icon)
      setCollectionName(currentCollection.name)
      setIsNameUsable(true)
    } else {
      setIconString(':smile:')
      setCollectionName('')
      setIsNameUsable(false)
    }
  }, [
    currentCollection.icon,
    currentCollection.name,
    isOpen,
    isUpdatingCollection
  ])

  const onModalSuccessClose = useCallback(() => {
    if (isUpdatingCollection) {
      onCollectionUpdate(
        { ...currentCollection, name: collectionName, icon: iconString },
        selection.collectionIndex
      )
    } else {
      onCollectionAdd({
        active: true,
        icon: iconString,
        macros: [],
        name: collectionName
      })
    }
    onClose()
  }, [
    currentCollection,
    collectionName,
    iconString,
    isUpdatingCollection,
    onClose,
    onCollectionAdd,
    onCollectionUpdate,
    selection.collectionIndex
  ])

  const onCollectionNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newName: string = event.target.value
      if (newName === '') {
        setCollectionName(newName)
        setIsNameUsable(false)
        return
      } else if (newName.length > maxNameLength) {
        setIsNameUsable(false)
        return
      }

      if (isUpdatingCollection) {
        if (
          newName.trim().toUpperCase() === currentCollection.name.toUpperCase()
        ) {
          setCollectionName(newName)
          setIsNameUsable(true)
          return
        }
      }

      for (let i = 0; i < collections.length; i++) {
        const collection = collections[i]
        if (collection.name.toUpperCase() === newName.trim().toUpperCase()) {
          setCollectionName(newName)
          setIsNameUsable(false)
          return
        }
      }
      setCollectionName(newName)
      setIsNameUsable(true)
    },
    [currentCollection.name, collections, isUpdatingCollection]
  )

  const onEmojiSelect = useCallback(
    (emoji: { shortcodes: string }) => {
      setIconString(emoji.shortcodes)
    },
    [setIconString]
  )

  const tooltipText = useMemo((): string => {
    if (collectionName === '') {
      return 'Please enter a name'
    } else {
      return ''
    }
  }, [collectionName])

  return (
    <Modal
      variant="brand"
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isUpdatingCollection ? 'Changed your mind?' : 'Make it unique!'}
        </ModalHeader>
        <ModalCloseButton />
        <Divider w="90%" alignSelf="center" />
        <ModalBody>
          <VStack w="100%">
            <HStack w="100%">
              <Text w="50%" textStyle="miniHeader">
                Icon
              </Text>
              <Text w="50%" textStyle="miniHeader">
                Name
              </Text>
            </HStack>
            <HStack w="100%">
              <Box w="50%">
                <Box
                  _hover={{ transform: 'scale(110%)' }}
                  maxHeight="32px"
                  transition="ease-out 150ms"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <em-emoji shortcodes={iconString} size="32px" />
                </Box>
              </Box>
              <VStack w="50%" spacing={0}>
                <Input
                  w="100%"
                  variant="brand"
                  isRequired
                  isInvalid={!isNameUsable}
                  onChange={onCollectionNameChange}
                  value={collectionName}
                  placeholder={'Collection Name'}
                  _placeholder={{ opacity: 1, color: borderColour }}
                />
                {collectionName.length === 25 && (
                  <Text w="100%" fontSize="2xs" fontWeight="semibold">
                    Max length is 25 characters
                  </Text>
                )}
              </VStack>
            </HStack>
            {showEmojiPicker && (
              <Box id="picker-box" w="100%" py="4">
                <Picker
                  data={data}
                  theme="auto"
                  onEmojiSelect={onEmojiSelect}
                  navPosition="bottom"
                  previewPosition="none"
                  dynamicWidth={true}
                  maxFrequentRows={1}
                />
              </Box>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="brand" mr={3} onClick={onClose}>
            Close
          </Button>
          <Tooltip
            hasArrow
            variant="brand"
            label={tooltipText}
            aria-label="A tooltip letting the user know what they need to do to be able to create a collection."
          >
            <Button
              variant="yellowGradient"
              onClick={onModalSuccessClose}
              isDisabled={!isNameUsable}
            >
              {isUpdatingCollection ? 'Update' : 'Create'}
            </Button>
          </Tooltip>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
