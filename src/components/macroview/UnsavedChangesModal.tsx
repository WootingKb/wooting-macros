import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Divider,
  Button,
  ModalFooter
} from '@chakra-ui/react'
import { useCallback } from 'react'
import { useApplicationContext } from '../../contexts/applicationContext'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function UnsavedChangesModal({ isOpen, onClose }: Props) {
  const { changeSelectedMacroIndex } = useApplicationContext()
  const onModalSuccessClose = useCallback(() => {
    changeSelectedMacroIndex(undefined)
    onClose()
  }, [changeSelectedMacroIndex, onClose])

  return (
    <Modal isOpen={isOpen} variant="brand" onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={2}>
        <ModalHeader>You have unsaved changes</ModalHeader>
        <Divider w="90%" alignSelf="center" />
        <ModalBody>
          Pressing the back button will discard any changes you have made to the
          macro.
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="brandWarning" onClick={onModalSuccessClose}>
            Yes, discard changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
