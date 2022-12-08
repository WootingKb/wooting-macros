import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react'
import { useCallback } from 'react'
import { useApplicationContext } from '../../contexts/applicationContext'

type Props = { isOpen: boolean; onClose: () => void }

export default function DeleteCollectionModal({ isOpen, onClose }: Props) {
  const { onSelectedCollectionDelete } = useApplicationContext()

  const onModalSuccessClose = useCallback(() => {
    onSelectedCollectionDelete()
    onClose()
  }, [onClose, onSelectedCollectionDelete])

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete this collection?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          This action is irreversible! Any macros within this collection will be
          lost.
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="red" onClick={onModalSuccessClose}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
