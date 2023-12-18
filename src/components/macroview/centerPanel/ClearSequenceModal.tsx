import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { useCallback } from 'react'
import { useMacroContext } from '../../../contexts/macroContext'

interface Props {
  isOpen: boolean
  onClose: () => void
  stopRecording: () => void
}

export default function ClearSequenceModal({
  isOpen,
  onClose,
  stopRecording
}: Props) {
  const { overwriteSequence } = useMacroContext()

  const onModalSuccessClose = useCallback(() => {
    overwriteSequence([])
    stopRecording()
    onClose()
  }, [onClose, overwriteSequence, stopRecording])

  return (
    <Modal isOpen={isOpen} variant="brand" onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={2}>
        <ModalHeader>Clear the sequence?</ModalHeader>
        <Divider w="90%" alignSelf="center" />
        <ModalBody>
          This action will clear the sequence. Don't worry, if you want to
          discard any changes to the sequence, you can always just press the
          back button.
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="brandWarning" onClick={onModalSuccessClose}>
            Yes, clear the sequence
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
