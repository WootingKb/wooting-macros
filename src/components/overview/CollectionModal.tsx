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
  Box,
  useColorModeValue,
  Center,
  Tooltip,
  Divider
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { open } from '@tauri-apps/api/dialog'
import { readBinaryFile } from '@tauri-apps/api/fs'
import { Buffer } from 'buffer'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const maxNameLength = 25

export default function CollectionModal({ isOpen, onClose }: Props) {
  const [collectionName, setCollectionName] = useState('')
  const [iconString, setIconString] = useState('')
  const [isNameUsable, setIsNameUsable] = useState(false)
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
      setCollectionName(collection.name)
      setIsNameUsable(true)
    } else {
      setIconString('')
      setCollectionName('')
      setIsNameUsable(false)
    }
  }, [collection.icon, collection.name, isOpen, isUpdatingCollection])

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
    [collections]
  )

  const onIconPress = useCallback(async () => {
    const path = await open({
      multiple: false,
      title: 'Select an image to use as an icon',
      filters: [
        {
          name: 'Image',
          extensions: ['png', 'jpg', 'jpeg']
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

  const tooltipText = useMemo(():string => {
    if (collectionName === '') {
      return "Please enter a name"
    } else {
      return ''
    }
  }, [collectionName])

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isUpdatingCollection ? 'Changed your mind?' : 'Make it unique!'}
        </ModalHeader>
        <ModalCloseButton />
        <Divider w="90%" alignSelf="center" />
        <ModalBody mt="4">
          <VStack w="100%">
            <HStack w="100%">
              <Text w="50%" textStyle="settingsCategoryHeader">
                Icon
              </Text>
              <Text w="50%" textStyle="settingsCategoryHeader">
                Name
              </Text>
            </HStack>
            <HStack w="100%">
              <Center
                w="50%"
                position="relative"
                role="group"
                onClick={onIconPress}
              >
                <Image
                  borderRadius="full"
                  border="1px"
                  borderColor={borderColour}
                  src={iconString}
                  fallbackSrc="https://via.placeholder.com/125"
                  alt="Macro Icon"
                  boxSize="100px"
                  objectFit="cover"
                />
                <Box
                  position="absolute"
                  bg="gray.700"
                  opacity="0%"
                  rounded="full"
                  w="50%"
                  h="100%"
                  _groupHover={{ opacity: '50%', cursor: 'pointer' }}
                ></Box>
                <Text
                  position="absolute"
                  fontWeight="bold"
                  fontSize="xs"
                  textColor="white"
                  opacity="0%"
                  _groupHover={{ opacity: '100%', cursor: 'pointer' }}
                >
                  Change Icon
                </Text>
              </Center>
              <VStack w="50%" spacing={0}>
                <Input
                  w="100%"
                  variant="flushed"
                  isRequired
                  isInvalid={!isNameUsable}
                  onChange={onCollectionNameChange}
                  value={collectionName}
                  placeholder={'Collection Name'}
                />
                {collectionName.length === 25 && (
                  <Text w="100%" fontSize="2xs" fontWeight="semibold">
                    Max length is 25 characters
                  </Text>
                )}
              </VStack>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Tooltip
            label={tooltipText}
            aria-label="A tooltip letting the user know what they need to do to be able to create a collection."
          >
            <Button
              colorScheme="yellow"
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
