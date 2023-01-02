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
  Divider,
  useColorMode
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function CollectionModal({ isOpen, onClose }: Props) {
  const [collectionName, setCollectionName] = useState('')
  const [iconString, setIconString] = useState(':smile:')
  const {
    selection,
    isUpdatingCollection,
    onCollectionAdd,
    onCollectionUpdate
  } = useApplicationContext()
  const currentCollection = useSelectedCollection()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const borderColour = useColorModeValue(
    'primary-light.500',
    'primary-dark.500'
  )
  const { colorMode } = useColorMode()

  useEffect(() => {
    if (isUpdatingCollection) {
      setIconString(currentCollection.icon)
      setCollectionName(currentCollection.name)
    } else {
      setIconString(':smile:')
      setCollectionName('')
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

  const onEmojiSelect = useCallback(
    (emoji: { shortcodes: string }) => {
      setIconString(emoji.shortcodes)
    },
    [setIconString]
  )

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
                  _hover={{ transform: 'scale(125%)' }}
                  maxHeight="32px"
                  transition="ease-out 150ms"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <em-emoji shortcodes={iconString} size="32px" />
                </Box>
              </Box>
              <VStack w="50%" spacing={2}>
                <Input
                  w="100%"
                  variant="brand"
                  onChange={(event) => setCollectionName(event.target.value)}
                  value={collectionName}
                  placeholder={'Collection Name'}
                  _placeholder={{ opacity: 1, color: borderColour }}
                />
              </VStack>
            </HStack>
            {showEmojiPicker && (
              <Box id="picker-box" w="100%" py="4">
                <Picker
                  data={data}
                  theme={colorMode}
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
          <Button variant="yellowGradient" onClick={onModalSuccessClose}>
            {isUpdatingCollection ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
