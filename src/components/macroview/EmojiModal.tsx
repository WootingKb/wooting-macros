import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  useColorMode,
} from '@chakra-ui/react'
import { useCallback } from 'react'
import { useMacroContext } from '../../contexts/macroContext'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function EmojiModal({ isOpen, onClose }: Props) {
  const { updateMacroIcon } = useMacroContext()
  const { colorMode } = useColorMode()

  const onEmojiSelect = useCallback((emoji: { shortcodes: string }) => {
    updateMacroIcon(emoji.shortcodes)
    onClose()
  }, [onClose, updateMacroIcon])

  return (
    <Modal
      isOpen={isOpen}
      blockScrollOnMount={false}
      size={['md', 'xl', '3xl', '3xl']}
      variant="brand"
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select an Emoji</ModalHeader>
        <Divider w="90%" alignSelf="center" />
        <ModalBody>
          <Picker
            data={data}
            theme={colorMode}
            onEmojiSelect={onEmojiSelect}
            navPosition="bottom"
            dynamicWidth={true}
            maxFrequentRows={1}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            mr={3}
            onClick={() => {
              onClose()
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
