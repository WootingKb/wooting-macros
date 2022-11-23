import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { BaseSyntheticEvent, useState } from 'react'
import { useApplicationContext } from '../../contexts/applicationContext'
import { useSelectedCollection } from '../../contexts/selectors'
import { Collection } from '../../types'

type Props = {
  isRenaming: boolean
  isOpen: boolean
  onClose: () => void
}

const CollectionModal = ({ isRenaming, isOpen, onClose }: Props) => {
  const [collectionName, setCollectionName] = useState('')
  const [isNameUsable, setIsNameUsable] = useState(true)
  const { selection, collections, onCollectionAdd, onCollectionUpdate } =
    useApplicationContext()
  const collection: Collection = useSelectedCollection()

  const onModalSuccessClose = () => {
    if (isRenaming) {
      onCollectionUpdate({ ...collection, name: collectionName }, selection.collectionIndex)
    } else {
      onCollectionAdd({
        active: true,
        icon: 'i',
        macros: [],
        name: collectionName
      })
    }
    onClose()
  }

  const onCollectionNameChange = (event: BaseSyntheticEvent) => {
    let newName: string = event.target.value
    newName = newName.trim()
    console.log(newName)
    setCollectionName(newName)

    for (let i = 0; i < collections.length; i++) {
      const collection = collections[i]
      if (collection.name.toUpperCase() === newName.toUpperCase()) {
        console.log("name matches")
        setIsNameUsable(false)
        return
      }
    }
    console.log("name is usable")
    setIsNameUsable(true)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isRenaming ? 'Changed your mind?' : 'Give it a unique name!'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            variant="flushed"
            isRequired
            isInvalid={!isNameUsable}
            onChange={onCollectionNameChange}
            placeholder={isRenaming ? collection.name : 'Collection Name'}
          />
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="yellow" onClick={onModalSuccessClose} isDisabled={!isNameUsable}>
            {isRenaming ? 'Rename' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CollectionModal
