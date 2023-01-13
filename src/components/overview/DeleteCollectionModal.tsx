import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider
} from '@chakra-ui/react'
import { useCallback } from 'react'
import { useApplicationContext } from '../../contexts/applicationContext'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function DeleteCollectionModal({ isOpen, onClose }: Props) {
  const { onSelectedCollectionDelete } = useApplicationContext()

  const onModalSuccessClose = useCallback(() => {
    onSelectedCollectionDelete()
    onClose()
  }, [onClose, onSelectedCollectionDelete])

  return (
    <Modal variant="brand" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={2}>
        <ModalHeader>Delete this collection?</ModalHeader>
        <Divider w="90%" alignSelf="center" />
        <ModalBody>
          This action is irreversible! Any macros within this collection will be
          lost.
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="brandWarning" onClick={onModalSuccessClose}>
            Yes, delete it
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
