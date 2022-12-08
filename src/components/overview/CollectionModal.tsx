import {
  Button,
  HStack,
  Input,
  Text,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Circle,
  Box,
  useColorModeValue
} from '@chakra-ui/react'
import { BaseSyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { open } from '@tauri-apps/api/dialog'
import { readBinaryFile } from '@tauri-apps/api/fs'
import { Buffer } from 'buffer'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function CollectionModal({ isOpen, onClose }: Props) {
  const [collectionName, setCollectionName] = useState('')
  const [iconString, setIconString] = useState('')
  const [isNameUsable, setIsNameUsable] = useState(true)
  const {
    selection,
    collections,
    isUpdatingCollection,
    onCollectionAdd,
    onCollectionUpdate
  } = useApplicationContext()
  const collection = useSelectedCollection()
  const borderColour = useColorModeValue('gray.400', 'gray.600')

  useEffect(() => {
    if (isUpdatingCollection) {
      setIconString(collection.icon)
    }
    setCollectionName('')
    setIsNameUsable(false)
  }, [collection.icon, isOpen, isUpdatingCollection])

  const onModalSuccessClose = useCallback(() => {
    if (isUpdatingCollection) {
      onCollectionUpdate(
        { ...collection, name: collectionName, icon: iconString },
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
    collection,
    collectionName,
    iconString,
    isUpdatingCollection,
    onClose,
    onCollectionAdd,
    onCollectionUpdate,
    selection.collectionIndex
  ])

  const onCollectionNameChange = useCallback(
    (event: BaseSyntheticEvent) => {
      let newName: string = event.target.value
      if (newName === '') {
        setIsNameUsable(false)
        return
      }
      newName = newName.trim()

      for (let i = 0; i < collections.length; i++) {
        const collection = collections[i]
        if (collection.name.toUpperCase() === newName.toUpperCase()) {
          setIsNameUsable(false)
          return
        }
      }
      setCollectionName(newName)
      setIsNameUsable(true)
    },
    [collections]
  )

  const onIconPress = useCallback(async () => {
    const path = await open({
      multiple: false,
      title: 'Select an image to use as an icon',
      filters: [
        {
          name: 'Image',
          extensions: ['png', 'jpeg']
        }
      ]
    })
    if (path === null || Array.isArray(path)) {
      return
    }
    let base64string = ''
    await readBinaryFile(path).then((res) => {
      base64string = Buffer.from(res).toString('base64')
    })
    if (base64string !== '') {
      setIconString('data:image/png;base64,' + base64string)
    }
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isUpdatingCollection ? 'Changed your mind?' : 'Make it unique!'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack>
            {/** Icon */}
            <VStack w="50%">
              <Text w="100%" textStyle="settingsCategoryHeader">
                Icon
              </Text>
              <Circle position="relative" role="group" onClick={onIconPress}>
                <Image
                  borderRadius="full"
                  border="1px"
                  borderColor={borderColour}
                  src={iconString}
                  fallbackSrc="https://via.placeholder.com/125"
                  alt="Macro Icon"
                  boxSize="50px"
                  objectFit="cover"
                />
                <Box
                  position="absolute"
                  bg="gray.700"
                  opacity="0%"
                  rounded="full"
                  w="100%"
                  h="100%"
                  _groupHover={{ opacity: '50%', cursor: 'pointer' }}
                ></Box>
                <Text
                  position="absolute"
                  fontWeight="bold"
                  fontSize="3xs"
                  textColor="white"
                  opacity="0%"
                  _groupHover={{ opacity: '100%', cursor: 'pointer' }}
                >
                  Change Icon
                </Text>
              </Circle>
            </VStack>
            {/** Name */}
            <VStack w="50%">
              <Text w="100%" textStyle="settingsCategoryHeader">
                Name
              </Text>
              <Input
                variant="flushed"
                isRequired
                isInvalid={!isNameUsable}
                onChange={onCollectionNameChange}
                placeholder={
                  isUpdatingCollection ? collection.name : 'Collection Name'
                }
              />
            </VStack>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="yellow"
            onClick={onModalSuccessClose}
            isDisabled={!isNameUsable}
          >
            {isUpdatingCollection ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
