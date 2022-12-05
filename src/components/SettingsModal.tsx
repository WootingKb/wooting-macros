import { CloseIcon } from '@chakra-ui/icons'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text
} from '@chakra-ui/react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} size={'full'} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>body</ModalBody>

        <ModalFooter>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
