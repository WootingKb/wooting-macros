import {
  Box,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorMode
} from '@chakra-ui/react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useRef } from 'react'

interface Props {
  shortcodeToShow: string
  isEmojiPopoverOpen: boolean
  onEmojiPopoverOpen: () => void
  onEmojiPopoverClose: () => void
  onEmojiSelect: (emoji: { shortcodes: string }) => void
}

export default function EmojiPopover({
  shortcodeToShow,
  isEmojiPopoverOpen,
  onEmojiPopoverClose,
  onEmojiPopoverOpen,
  onEmojiSelect
}: Props) {
  const { colorMode } = useColorMode()
  const initialFocusRef = useRef<HTMLDivElement | null>(null)
  return (
    <Popover
      initialFocusRef={initialFocusRef}
      returnFocusOnClose={true}
      isOpen={isEmojiPopoverOpen}
      onClose={onEmojiPopoverClose}
      closeOnBlur={true}
      isLazy
    >
      <PopoverTrigger>
        <Box
          maxHeight="32px"
          cursor="pointer"
          onClick={onEmojiPopoverOpen}
          _hover={{ transform: 'scale(110%)' }}
          transition="ease-out 150ms"
        >
          <em-emoji shortcodes={shortcodeToShow} size="32px" />
        </Box>
      </PopoverTrigger>
      <PopoverContent bg="transparent" border="0px" shadow="none">
        <PopoverBody>
          <Box id="picker-box" w="full" ref={initialFocusRef}>
            <Picker
              data={data}
              theme={colorMode}
              autoFocus={true}
              onEmojiSelect={onEmojiSelect}
              previewPosition="none"
              dynamicWidth={true}
            />
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
